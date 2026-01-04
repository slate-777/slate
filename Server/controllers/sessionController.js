const sessionService = require('../services/sessionService');
const authService = require('../services/authService');
const xlsx = require('xlsx');
const db = require('../config/db'); // Assuming you have a configured database connection

exports.setupSession = async (req, res) => {
    const {
        sessionTitle, sessionHost, sessionDate, sessionTime,
        schoolId, labId, sessionDescription, sessionImages,
        // SATHEE KENDRA fields
        centreCode, state, district, satheeMitraName,
        schoolType, schoolTypeOther, schoolAddress,
        principalName, principalContact, visitMode
    } = req.body;

    const userId = req.id;
    const sessionSetupOn = new Date();

    if (!sessionTitle || !sessionHost || !sessionDate || !sessionTime || !schoolId || !labId || !req.file) {
        return res.status(400).json({ status: 'error', message: 'All fields are required!' });
    }

    try {
        // Validate file buffer
        if (!req.file || !req.file.buffer || req.file.buffer.length === 0) {
            return res.status(400).json({ status: 'error', message: 'No file uploaded or file is empty!' });
        }

        // Read Excel file
        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });

        if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
            return res.status(400).json({ status: 'error', message: 'Excel file has no sheets!' });
        }

        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const studentData = xlsx.utils.sheet_to_json(sheet, { header: 1 });

        // Expected headers in exact order
        const expectedHeaders = ["studentAadhar", "FirstName", "LastName", "Class", "RollNo", "Attendence"];

        // Extract first row from uploaded file (header row)
        const uploadedHeaders = studentData[0] || [];

        // Check if headers match exactly (both names and order)
        if (!uploadedHeaders.every((col, index) => col === expectedHeaders[index])) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid file format! Column names or order are incorrect.',
                expected: expectedHeaders,
                received: uploadedHeaders
            });
        }

        // Convert remaining rows to JSON
        const jsonData = xlsx.utils.sheet_to_json(sheet);

        // Filter out empty rows (rows where all required fields are empty)
        const validStudents = jsonData.filter(student => {
            return student.studentAadhar &&
                student.studentAadhar.toString().trim() !== '' &&
                student.FirstName &&
                student.FirstName.toString().trim() !== '';
        });

        console.log(`Total rows in Excel: ${jsonData.length}, Valid students after filtering: ${validStudents.length}`);

        if (!Array.isArray(validStudents) || validStudents.length === 0) {
            return res.status(400).json({
                status: 'error',
                message: 'The uploaded file has no valid student data! Please ensure students have Aadhaar numbers and names.'
            });
        }

        // Validate Aadhaar numbers
        const faultyRecords = [];
        validStudents.forEach((student, index) => {
            const aadharStr = student.studentAadhar.toString().trim();
            if (aadharStr.length !== 12) {
                faultyRecords.push({ row: index + 2, value: student.studentAadhar }); // +2 because header is row 1
            }
        });

        if (faultyRecords.length > 0) {
            return res.status(400).json({ status: 'error', message: `Invalid Aadhaar number in rows: ${faultyRecords.map(r => r.row).join(", ")}`, faultyRecords });
        }

        // Insert session details
        const sessionQuery = `
            INSERT INTO sessions (
                session_title, session_host, session_date, session_time, 
                school_id, lab_id, session_description, session_images,
                centre_code, state, district, sathee_mitra_name,
                school_type, school_type_other, school_address,
                principal_name, principal_contact, visit_mode,
                session_setup_by, session_setup_on
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const [sessionResult] = await db.promise().query(sessionQuery, [
            sessionTitle, sessionHost, sessionDate, sessionTime,
            schoolId, labId, sessionDescription, sessionImages || null,
            centreCode || null, state || null, district || null, satheeMitraName || null,
            schoolType || null, schoolTypeOther || null, schoolAddress || null,
            principalName || null, principalContact || null, visitMode || null,
            userId, sessionSetupOn
        ]);

        const sessionId = sessionResult.insertId;

        // Prepare student data for batch insert (use validStudents instead of jsonData)
        const studentInsertData = validStudents.map(student => [
            student.studentAadhar.toString().trim(),
            student.FirstName.toString().trim(),
            student.LastName ? student.LastName.toString().trim() : '',
            student.Class ? student.Class.toString().trim() : '',
            student.RollNo ? student.RollNo.toString().trim() : '',
            student.Attendence && student.Attendence.toString().trim() !== "" ? student.Attendence.toString().trim() : 'A',
            sessionId,
        ]);

        console.log(`Inserting ${studentInsertData.length} students for session ${sessionId}`);

        const studentQuery = `
            INSERT INTO students (
                student_aadhar, student_first_name, student_last_name, student_class, 
                student_rollno, student_attendance, session_id
            ) VALUES ?`;

        await db.promise().query(studentQuery, [studentInsertData]);
        await authService.logActivity(req.id, `User: ${req.email} setup a new session: [${sessionTitle}]`);

        res.json({ status: 'success', message: 'Session and attendees successfully added!' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Failed to setup session.' });
    }
};

exports.fetchMySessions = async (req, res) => {
    try {
        const sessions = await sessionService.fetchMySessions(req.id);
        res.status(200).json({ status: 'success', data: sessions });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'fail', message: error.message });
    }
};

exports.fetchAllSessions = async (req, res) => {
    const userId = req.id;
    const state = req.state;
    const assignedLab = req.assignedLab;
    try {
        const sessions = await sessionService.fetchAllSessions(userId, state, assignedLab);
        res.status(200).json({ status: 'success', data: sessions });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'fail', message: error.message });
    }
};

exports.fetchSessionHosts = async (req, res) => {
    try {
        const sessionHosts = await sessionService.fetchSessionHosts();
        res.status(200).json({ status: 'success', data: sessionHosts });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'fail', message: error.message });
    }
};

exports.updateSessionData = async (req, res) => {
    const { id } = req.params;
    const {
        session_title, session_host, session_date, session_time,
        school_id, lab_id, session_description, session_status,
        // SATHEE KENDRA fields
        centre_code, state, district, sathee_mitra_name,
        school_type, school_type_other, school_address,
        principal_name, principal_contact, visit_mode
    } = req.body;

    try {
        const sessionData = {
            session_title,
            session_host,
            session_date,
            session_time,
            school_id,
            lab_id,
            session_description,
            session_status,
            centre_code,
            state,
            district,
            sathee_mitra_name,
            school_type,
            school_type_other,
            school_address,
            principal_name,
            principal_contact,
            visit_mode
        };

        await sessionService.updateSessionData(req.id, id, sessionData);
        await authService.logActivity(req.id, `User: ${req.email} updated session data: [${session_title}]`);
        res.json({ status: 'success', message: 'Session data updated successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.deleteSession = async (req, res) => {
    const { id } = req.params;
    const { sessionTitle } = req.body;
    try {
        console.log(`[DELETE SESSION] Attempting to delete session with ID: ${id}, Title: ${sessionTitle}`);
        const result = await sessionService.deleteSession(id);
        console.log(`[DELETE SESSION] Deleted ${result.affectedRows} row(s) for session ID: ${id}`);
        await authService.logActivity(req.id, `User: ${req.email} deleted a session: [${sessionTitle}]`);
        res.json({ status: 'success', message: 'Session deleted successfully', deletedCount: result.affectedRows });
    } catch (error) {
        console.error('[DELETE SESSION] Error:', error);
        res.status(500).json({ status: 'fail', message: error.message });
    }
};

exports.getStudentList = async (req, res) => {
    const { sessionId } = req.params;
    try {
        const students = await sessionService.getStudentList(sessionId);
        res.status(200).json({ status: 'success', data: students });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'fail', message: error.message });
    }
};

exports.updateAttendance = async (req, res) => {
    const { sessionId } = req.params;
    const { attendance } = req.body;

    if (!Array.isArray(attendance)) {
        return res.status(400).json({ error: 'Invalid data format' });
    }

    try {
        await sessionService.updateStudentAttendance(sessionId, attendance);
        res.status(200).json({ message: 'Attendance updated successfully' });
    } catch (error) {
        console.error('Error in updateAttendance controller:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.fetchSessionsPerMonth = async (req, res) => {
    try {
        const sessionData = await sessionService.fetchSessionsPerMonth();
        res.status(200).json({ status: 'success', data: sessionData });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 'fail', message: err.message });
    }
};

exports.fetchCountOfSessions = async (req, res) => {
    try {
        const results = await sessionService.fetchCountOfSessions();
        res.json({ status: 'success', data: results });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 'fail', message: err.message });
    }
};

exports.fetchLatestSessions = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5;
        console.log('Fetching latest sessions with limit:', limit);
        const latestSessions = await sessionService.fetchLatestSessions(limit);
        console.log('Latest sessions found:', latestSessions.length);
        res.json({ status: 'success', data: latestSessions });
    } catch (err) {
        console.error('Error in fetchLatestSessions controller:', err);
        console.error('Error stack:', err.stack);
        res.status(500).json({
            status: 'fail',
            message: err.message,
            error: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
};