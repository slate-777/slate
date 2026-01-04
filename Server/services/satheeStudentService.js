const db = require('../config/db');
const ExcelJS = require('exceljs');

class SatheeStudentService {
    async registerStudent(studentName, schoolName, mobileNumber, email, courseOpted, createdBy) {
        const query = `
            INSERT INTO sathee_students (student_name, school_name, mobile_number, email, course_opted, created_by)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        await db.promise().query(query, [studentName, schoolName, mobileNumber, email, courseOpted, createdBy]);
    }

    async getAllStudents() {
        const query = "SELECT * FROM vw_sathee_students ORDER BY created_at DESC";
        const [results] = await db.promise().query(query);
        return results;
    }

    async getStudentsCount() {
        const query = "SELECT COUNT(*) as total_students FROM sathee_students";
        const [results] = await db.promise().query(query);
        return results[0];
    }

    async deleteStudent(studentId) {
        const query = "DELETE FROM sathee_students WHERE id = ?";
        await db.promise().query(query, [studentId]);
    }

    async updateStudent(studentId, studentName, schoolName, mobileNumber, email, courseOpted) {
        const query = `
            UPDATE sathee_students 
            SET student_name = ?, school_name = ?, mobile_number = ?, email = ?, course_opted = ?
            WHERE id = ?
        `;
        await db.promise().query(query, [studentName, schoolName, mobileNumber, email, courseOpted, studentId]);
    }

    async downloadStudentsExcel(res) {
        const query = `
            SELECT 
                id,
                student_name,
                school_name,
                mobile_number,
                email,
                course_opted,
                created_at
            FROM sathee_students 
            ORDER BY created_at DESC
        `;
        const [students] = await db.promise().query(query);

        // Create an Excel Workbook
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sathee Students');

        // Define columns
        worksheet.columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'STUDENT NAME', key: 'student_name', width: 30 },
            { header: 'SCHOOL NAME', key: 'school_name', width: 40 },
            { header: 'MOBILE NUMBER', key: 'mobile_number', width: 20 },
            { header: 'EMAIL', key: 'email', width: 30 },
            { header: 'COURSE OPTED', key: 'course_opted', width: 30 },
            { header: 'REGISTERED ON', key: 'created_at', width: 20 }
        ];

        // Style the header row
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF4472C4' }
        };
        worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

        // Add rows
        students.forEach((student) => {
            worksheet.addRow({
                id: student.id,
                student_name: student.student_name,
                school_name: student.school_name,
                mobile_number: student.mobile_number || 'N/A',
                email: student.email || 'N/A',
                course_opted: student.course_opted || 'N/A',
                created_at: student.created_at ? new Date(student.created_at).toLocaleDateString() : 'N/A'
            });
        });

        // Set Response Headers for File Download
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=Sathee_Students_Report.xlsx');

        // Write to Response Stream
        await workbook.xlsx.write(res);
        res.end();
    }
}

module.exports = new SatheeStudentService();
