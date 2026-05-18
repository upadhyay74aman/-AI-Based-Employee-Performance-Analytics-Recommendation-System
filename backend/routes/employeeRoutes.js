const express = require('express');
const router = express.Router();
const { addEmployee, getEmployees, searchEmployee } = require('../controllers/employeeController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, addEmployee).get(protect, getEmployees);
router.route('/search').get(protect, searchEmployee);

module.exports = router;
