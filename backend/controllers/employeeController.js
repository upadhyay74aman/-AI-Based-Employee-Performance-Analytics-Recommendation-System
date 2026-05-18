const Employee = require('../models/Employee');

// @desc    Add new employee
// @route   POST /api/employees
// @access  Private
const addEmployee = async (req, res) => {
  try {
    const { name, email, department, skills, performanceScore, experience } = req.body;

    if (!name || !email || !department || !skills || performanceScore === undefined || experience === undefined) {
      return res.status(400).json({ message: 'Please add all required fields' });
    }

    const employeeExists = await Employee.findOne({ email });

    if (employeeExists) {
      return res.status(400).json({ message: 'Employee with this email already exists' });
    }

    const employee = await Employee.create({
      name,
      email,
      department,
      skills,
      performanceScore,
      experience,
    });

    res.status(201).json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private
const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({});
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search employee by department
// @route   GET /api/employees/search?department=...
// @access  Private
const searchEmployee = async (req, res) => {
  try {
    const { department } = req.query;
    if (!department) {
       return res.status(400).json({ message: 'Please provide a department to search' });
    }
    const employees = await Employee.find({ department: new RegExp('^' + department + '$', 'i') });
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addEmployee,
  getEmployees,
  searchEmployee,
};
