const db = require("../config/db");
const ExcelJS = require("exceljs");

exports.generateReport = async (req, res) => {
    const userId = req.role_id;
    const state = req.state;
    const stateParameter = userId === 1 ? [] : [state];
    try {
        const { reportType } = req.params;
        const { parameter } = req.query;
        // Define the SQL Queries
        const queries = {
            List_of_All_Sessions_with_School_Details: `SELECT 
                          ss.id AS session_id,
                          ss.session_title, 
                          ss.session_host, 
                          ss.session_date, 
                          ss.session_time, 
                          ss.session_status,
                          ss.session_description,
                          sc.school_name, 
                          sc.udise, 
                          sc.state AS school_state, 
                          sc.district AS school_district,
                          ss.centre_code,
                          ss.state AS session_state,
                          ss.district AS session_district,
                          ss.sathee_mitra_name,
                          ss.school_type,
                          ss.school_type_other,
                          ss.school_address,
                          ss.principal_name,
                          ss.principal_contact,
                          ss.visit_mode
                      FROM sessions AS ss 
                      INNER JOIN schools AS sc ON ss.school_id = sc.id 
                       ${userId === 1 ? "" : "WHERE sc.state = ?"} 
                      ORDER BY ss.session_date DESC`,

            Student_Attendance_Report_for_a_Specific_Session: `SELECT 
                      ss.session_title,
                      ss.session_host,
                      ss.session_date,
                      ss.session_time,
                      st.student_aadhar,
                      st.student_first_name,
                      st.student_last_name,
                      st.student_class,
                      st.student_rollno,
                      st.student_attendance,
                      ss.school_name,
                      ss.school_district,
                      ss.school_state,
                      ss.lab_name,
                      ss.centre_code,
                      ss.state AS session_state,
                      ss.district AS session_district,
                      ss.sathee_mitra_name,
                      ss.school_type,
                      ss.school_type_other,
                      ss.school_address,
                      ss.principal_name,
                      ss.principal_contact,
                      ss.visit_mode
                    FROM students AS st
                    INNER JOIN vw_sessions AS ss ON st.session_id = ss.id
                    WHERE ss.id = ? 
                    ORDER BY st.student_class, st.student_rollno`,

            Total_Number_of_Students_Attended_per_Session: `SELECT
                      session_title, session_host, session_date, session_time, school_name, school_district, school_state, lab_name, session_description, session_setup_by_email, session_setup_on, 
                      session_status, attendees_count, session_updated_on,
                      centre_code, state AS session_state, district AS session_district, sathee_mitra_name, school_type, school_type_other, school_address, principal_name, principal_contact, visit_mode
                      FROM vw_sessions
                       ${userId === 1 ? "" : "WHERE school_state = ?"}`,

            List_of_Schools_with_Total_Sessions_Conducted: `SELECT sc.school_name, sc.udise, sc.state, sc.district, COUNT(ss.id) AS total_sessions_conducted 
                      FROM schools AS sc 
                      LEFT JOIN sessions AS ss ON sc.id = ss.id 
                       ${userId === 1 ? "WHERE sc.school_status = 1" : "WHERE sc.state = ? AND sc.school_status = 1"}
                      GROUP BY sc.id, sc.school_name, sc.udise, sc.state, sc.district 
                      ORDER BY total_sessions_conducted DESC`,

            Students_with_Low_Attendance_Across_All_Sessions: `SELECT st.student_id, st.student_aadhar, st.student_first_name, st.student_last_name, st.student_class, st.student_rollno, ss.school_name, ss.school_district, ss.school_state,
                             COUNT(st.student_attendance) AS total_sessions_attended, 
                             (COUNT(st.student_attendance) / (SELECT COUNT(*) FROM sessions)) * 100 AS attendance_percentage 
                      FROM students AS st 
                      INNER JOIN vw_sessions AS ss ON st.session_id = ss.id 
                      WHERE st.student_attendance = 'Present' 
                       ${userId === 1 ? "" : " AND ss.school_state = ?"}
                      GROUP BY st.student_id, st.student_aadhar, st.student_first_name, st.student_last_name, st.student_class, st.student_rollno 
                      HAVING attendance_percentage < 50 
                      ORDER BY attendance_percentage ASC`,

            Sessions_Conducted_in_a_Specific_or_All_states: `SELECT ss.id AS session_id, ss.session_title, ss.session_host, ss.session_date, ss.session_time, ss.session_status, ss.session_description,
                      sc.school_name, sc.udise, sc.state AS school_state, sc.district AS school_district,
                      ss.centre_code, ss.state AS session_state, ss.district AS session_district, ss.sathee_mitra_name, ss.school_type, ss.school_type_other, ss.school_address, ss.principal_name, ss.principal_contact, ss.visit_mode
                      FROM sessions AS ss
                      INNER JOIN schools AS sc ON ss.school_id = sc.id 
                       ${parameter === "allStates" ? "" : "WHERE sc.state = ?"}
                      ORDER BY ss.session_date DESC;`,

            Schools_with_No_Sessions_Conducted: `SELECT sc.school_name, sc.udise, sc.state, sc.district 
                      FROM schools AS sc 
                      LEFT JOIN sessions AS ss ON sc.id = ss.id 
                      WHERE ss.id IS NULL 
                       ${userId === 1 ? "AND sc.school_status = 1" : " AND sc.state = ? AND sc.school_status = 1"}
                      ORDER BY sc.school_name`,

            Sessions_Conducted_by_a_Specific_Host: `SELECT 
                        ss.id AS session_id,
                        ss.session_title,
                        ss.session_host,
                        ss.session_date,
                        ss.session_time,
                        ss.session_status,
                        ss.session_description,
                        sc.school_name,
                        sc.udise,
                        sc.state AS school_state,
                        sc.district AS school_district,
                        ss.centre_code,
                        ss.state AS session_state,
                        ss.district AS session_district,
                        ss.sathee_mitra_name,
                        ss.school_type,
                        ss.school_type_other,
                        ss.school_address,
                        ss.principal_name,
                        ss.principal_contact,
                        ss.visit_mode
                    FROM 
                        sessions AS ss
                    INNER JOIN 
                        schools AS sc ON ss.school_id = sc.id
                    WHERE 
                        ss.session_host = ?
                    ORDER BY 
                        ss.session_date DESC;`,

            Total_count_of_equipment_available: `SELECT 
                        equipment_name,
                        equipment_description,
                        warranty_status,
                        available_quantity,
                        expiry_date,
                        equipment_added_by_owner,
                        equipment_added_on
                FROM vw_equipments
                WHERE equipment_status = 1;`,

            List_of_Equipment_with_Expired_Warranties: `SELECT equipment_name, equipment_description, warranty_status, equipment_quantity, expiry_date, serial_number, equipment_added_by_owner, equipment_added_on FROM vw_equipments WHERE expiry_date < CURDATE() AND equipment_status = 1;`,

            Recently_Added_Equipment_for_a_period: `SELECT 
                        equipment_name, 
                        equipment_description, 
                        warranty_status, 
                        available_quantity, 
                        expiry_date, 
                        equipment_added_by_owner, 
                        equipment_added_on
                    FROM vw_equipments
                    WHERE equipment_added_on >= DATE_SUB(CURDATE(), INTERVAL ? DAY) AND equipment_status = 1`,

            Equipment_Inventory_Status_Available_vs_Allocated: `SELECT e.equipment_name,
            e.equipment_quantity AS total_quantity,
                COALESCE(SUM(a.allocated_quantity), 0) AS allocated_quantity,
                    (e.equipment_quantity - COALESCE(SUM(a.allocated_quantity), 0)) AS remaining_quantity
                        FROM equipments e
                        LEFT JOIN equipments_allocation a ON e.id = a.equipment_id
                        WHERE e.equipment_status = 1
                        GROUP BY e.id; `,

            Allocations_Made_in_past: `SELECT 
                        equipment_name, school_name, school_district, school_state, lab_name, allocated_quantity, available_quantity, allocated_by_user, allocated_by_email, allocation_date, allocated_on 
                    FROM vw_equipments_allocation 
                    WHERE allocation_date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
                       ${userId === 1 ? "AND equipment_status = 1" : "AND equipment_status = 1 AND school_state = ?"}; `,

            Total_Number_of_Labs_per_School: `SELECT 
                        school_name,
                        school_district,
                        school_state,
                        COUNT(id) AS 'Lab Count'
                    FROM vw_labs
                    WHERE school_state = ? AND lab_status = 1
                    GROUP BY school_id, school_name, school_district, school_state; `,

            Labs_Grouped_by_Type: `SELECT 
                        lab_type, COUNT(*) AS total_labs 
                    FROM vw_labs 
                    WHERE lab_status = 1
                    GROUP BY lab_type; `,

            Labs_Added_in_past: `SELECT 
                        lab_name,
                        lab_type,
                        school_name,
                        school_district,
                        school_state,
                        lab_added_by_owner,
                        lab_added_on
                    FROM vw_labs 
                    WHERE lab_added_on >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
                       ${userId === 1 ? "AND lab_status = 1" : "AND lab_status = 1 AND school_state = ?"}; `,

            Schools_Grouped_by_State: `SELECT 
                        state, 
                        COUNT(*) AS total_schools 
                        FROM vw_schools 
                        WHERE state = ? AND school_status = 1
                        GROUP BY state; `,

            Schools_with_Labs_but_No_Equipment_Allocations: `SELECT 
                        s.school_name, 
                        s.udise, 
                        s.state, 
                        s.district, 
                        COUNT(l.id) AS total_labs 
                    FROM vw_schools s
                    JOIN labs l ON s.id = l.school_id
                    WHERE l.id NOT IN (SELECT DISTINCT lab_id FROM equipments_allocation) AND s.school_status = 1
                    GROUP BY s.school_name, s.udise, s.state, s.district; `,

            Fetch_Student_Data_by_Aadhar: `SELECT DISTINCT 
                        st.student_aadhar, 
                        st.student_first_name, 
                        st.student_last_name, 
                        st.student_class, 
                        st.student_rollno,
                        st.student_attendance, 
                        ss.session_title, 
                        ss.session_host, 
                        ss.session_date, 
                        ss.session_time, 
                        ss.school_id, 
                        ss.lab_id,
                        ss.session_description, 
                        ss.session_setup_by, 
                        ss.session_setup_on, 
                        ss.session_status, 
                        ss.attendees_count, 
                        ss.session_updated_by, 
                        ss.session_updated_on, 
                        sc.school_name, 
                        sc.udise, 
                        sc.state,
                        sc.district,
                        ss.centre_code,
                        ss.state AS session_state,
                        ss.district AS session_district,
                        ss.sathee_mitra_name,
                        ss.school_type,
                        ss.school_type_other,
                        ss.school_address,
                        ss.principal_name,
                        ss.principal_contact,
                        ss.visit_mode
                    FROM 
                        students AS st
                    INNER JOIN 
                        sessions AS ss ON st.session_id = ss.id
                    INNER JOIN 
                        schools AS sc ON ss.school_id = sc.id
                    WHERE st.student_aadhar = ?`,
        };

        // Check if the requested report exists
        if (!queries[reportType]) {
            return res.status(400).json({ error: "Invalid report type." });
        }

        // Execute the Query with parameters
        const [rows] = await db.promise().query(queries[reportType], reportType === "Student_Attendance_Report_for_a_Specific_Session" || (reportType === "Sessions_Conducted_in_a_Specific_or_All_states" && parameter !== "allStates") || ((reportType === "Total_Number_of_Labs_per_School" || reportType === "Schools_Grouped_by_State") && userId === 1) || reportType === "Sessions_Conducted_by_a_Specific_Host" || reportType === "Recently_Added_Equipment_for_a_period" || reportType === "Fetch_Student_Data_by_Aadhar" ? [parameter] : reportType === "Allocations_Made_in_past" || reportType === "Labs_Added_in_past" ? [parameter, state] : [stateParameter]);

        // Create an Excel Workbook
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Report");

        // Add Column Headers
        if (rows.length > 0) {
            worksheet.columns = Object.keys(rows[0]).map((key) => ({
                header: key.replace(/_/g, " ").toUpperCase(),
                key: key,
                width: 20,
            }));
        }

        // Add Rows
        rows.forEach((row) => {
            worksheet.addRow(row);
        });

        // Set Response Headers for File Download
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", `attachment; filename = Report.xlsx`);

        // Write to Response Stream
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error("Error generating report:", error);
        res.status(500).json({ error: "Error generating report" });
    }
};