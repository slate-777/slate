const express = require('express');
const router = express.Router();
const satheeStudentService = require('../services/satheeStudentService');
const verifyUser = require('../middlewares/auth');

// Register a new Sathee student
router.post('/register', verifyUser, async (req, res) => {
    try {
        const { studentName, schoolName, mobileNumber, email, courseOpted } = req.body;
        const userId = req.id;

        if (!studentName || !schoolName) {
            return res.status(400).json({
                status: 'error',
                message: 'Student name and school are required'
            });
        }

        await satheeStudentService.registerStudent(
            studentName,
            schoolName,
            mobileNumber,
            email,
            courseOpted,
            userId
        );

        res.status(201).json({
            status: 'success',
            message: 'Student registered successfully!'
        });
    } catch (error) {
        console.error('Error registering student:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to register student'
        });
    }
});

// Get all Sathee students
router.get('/all', verifyUser, async (req, res) => {
    try {
        const students = await satheeStudentService.getAllStudents();
        res.status(200).json({
            status: 'success',
            data: students
        });
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch students'
        });
    }
});

// Get total count of Sathee students
router.get('/count', verifyUser, async (req, res) => {
    try {
        const count = await satheeStudentService.getStudentsCount();
        res.status(200).json({
            status: 'success',
            data: count
        });
    } catch (error) {
        console.error('Error fetching students count:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch students count'
        });
    }
});

// Download all Sathee students as Excel (MUST be before /:id routes)
router.get('/download/excel', verifyUser, async (req, res) => {
    try {
        await satheeStudentService.downloadStudentsExcel(res);
    } catch (error) {
        console.error('Error downloading students:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to download students data'
        });
    }
});

// Update a Sathee student
router.put('/:id', verifyUser, async (req, res) => {
    try {
        const studentId = req.params.id;
        const { studentName, schoolName, mobileNumber, email, courseOpted } = req.body;

        console.log('Update request received:', { studentId, studentName, schoolName, mobileNumber, email, courseOpted });

        if (!studentName || !schoolName) {
            return res.status(400).json({
                status: 'error',
                message: 'Student name and school are required'
            });
        }

        await satheeStudentService.updateStudent(
            studentId,
            studentName,
            schoolName,
            mobileNumber || null,
            email || null,
            courseOpted || null
        );

        res.status(200).json({
            status: 'success',
            message: 'Student updated successfully!'
        });
    } catch (error) {
        console.error('Error updating student:', error);
        console.error('Error details:', error.message);
        res.status(500).json({
            status: 'error',
            message: 'Failed to update student: ' + error.message
        });
    }
});

// Delete a Sathee student
router.delete('/:id', verifyUser, async (req, res) => {
    try {
        const studentId = req.params.id;
        await satheeStudentService.deleteStudent(studentId);
        res.status(200).json({
            status: 'success',
            message: 'Student deleted successfully!'
        });
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to delete student'
        });
    }
});

module.exports = router;
