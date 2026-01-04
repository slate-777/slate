import { useState, useEffect } from 'react';
import { fetchStudentList, handleSaveStudentList } from '../ApiHandler/sessionFunctions';

const StudentList = ({ sessionId, handleStudentListClose }) => {
    const [students, setStudents] = useState([]);

    useEffect(() => {
        fetchStudentList(sessionId, setStudents);
    }, [sessionId]);

    const handleCheckboxChange = (index) => {
        setStudents((prevStudents) => {
            const updatedStudents = [...prevStudents];
            updatedStudents[index].student_attendance = updatedStudents[index].student_attendance === 'P' ? 'A' : 'P';
            return updatedStudents;
        });
    };

    return (
        <div className="student-list-overlay">
            <div className="overlay-background" onClick={handleStudentListClose}></div>
            <div className="overlay-content">
                <h2>Student List</h2>
                <div className="artifacts-table-view">
                    <table className="artifacts-table">
                        <thead>
                            <tr>
                                <th>SNo</th>
                                <th>Aadhar</th>
                                <th>Name</th>
                                <th>Class</th>
                                <th>Roll No</th>
                                <th>Attendance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{student.student_aadhar}</td>
                                    <td>{student.student_first_name} {student.student_last_name}</td>
                                    <td>{student.student_class}</td>
                                    <td>{student.student_rollno}</td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={student.student_attendance === 'P'}
                                            onChange={() => handleCheckboxChange(index)}
                                        />{' '}
                                        Present
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="overlay-actions">
                    <button onClick={handleStudentListClose}>Close</button>
                    <button onClick={(e)=>handleSaveStudentList(e, sessionId, students, handleStudentListClose)}>Save</button>
                </div>
            </div>
        </div>
    );
};

export default StudentList;