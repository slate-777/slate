const express = require('express');
const verifyUser = require('../middlewares/auth');
const equipmentController = require('../controllers/equipmentController');

const router = express.Router();

router.post('/addEquipment', verifyUser, equipmentController.addEquipment);
router.get('/fetchMyEquipments', verifyUser, equipmentController.fetchMyEquipments);
router.get('/fetchAllEquipments', verifyUser, equipmentController.fetchAllEquipments);
router.get('/fetchactiveEquipments', verifyUser, equipmentController.fetchActiveEquipments);
router.post('/allocateEquipment', verifyUser, equipmentController.allocateEquipment);
router.get('/fetchMyAllocatedEquipments', verifyUser, equipmentController.fetchMyAllocatedEquipments);
router.get('/fetchAllAllocatedEquipments', verifyUser, equipmentController.fetchAllAllocatedEquipments);
router.put('/updateEquipmentData/:id', verifyUser, equipmentController.updateEquipmentData);
router.put('/updateAllocation/:allocationId', verifyUser, equipmentController.updateEquipmentAllocation);
router.put('/disableEquipment/:id', verifyUser, equipmentController.disableEquipment);
router.delete('/deleteEquipment/:id', verifyUser, equipmentController.deleteEquipment);
router.get('/fetchLabEquipmentCount', verifyUser, equipmentController.fetchLabEquipmentCount);
router.get('/schoolsWithMostAllocatedEquipment', verifyUser, equipmentController.schoolsWithMostAllocatedEquipment);
router.get('/labsWithMostAllocatedEquipment', verifyUser, equipmentController.labsWithMostAllocatedEquipment);
router.get('/fetchCountOfEquipment', verifyUser, equipmentController.fetchCountOfEquipment);

module.exports = router;