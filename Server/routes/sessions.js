const express = require('express');
const multer = require('multer');
const verifyUser = require('../middlewares/auth');
const sessionController = require('../controllers/sessionController');

// Middleware for handling file uploads (memory storage)
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.post('/setupSession', verifyUser, upload.single('attendeesFile'), sessionController.setupSession);
router.get('/fetchMySessions', verifyUser, sessionController.fetchMySessions);
router.get('/fetchAllSessions', verifyUser, sessionController.fetchAllSessions);
router.get('/fetchSessionHosts', verifyUser, sessionController.fetchSessionHosts);
router.put('/updateSessionData/:id', verifyUser, sessionController.updateSessionData);
router.post('/deleteSession/:id', verifyUser, sessionController.deleteSession);
router.get('/getStudentList/:sessionId', verifyUser, sessionController.getStudentList);
router.put('/saveStudentList/:sessionId', verifyUser, sessionController.updateAttendance);
router.get('/sessionsPerMonth', verifyUser, sessionController.fetchSessionsPerMonth);
router.get('/fetchCountOfSessions', verifyUser, sessionController.fetchCountOfSessions);
router.get('/fetchLatestSessions', verifyUser, sessionController.fetchLatestSessions);

module.exports = router;
