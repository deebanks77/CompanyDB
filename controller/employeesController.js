const data = {
  employees: require("../model/employees.json"),
  setEmployees: function (data) {
    this.employees = data;
  },
};

const { v4: uuidv4 } = require("uuid");
const fsPromises = require("fs").promises;
const path = require("path");

const getAllEmployees = async (req, res) => {
  return res.json(data.employees);
};

const createNewEmployee = async (req, res) => {
  const newEmployee = {
    id: uuidv4(),
    firstname: req.body.firstname,
    lastname: req.body.lastname,
  };

  if (!newEmployee.firstname || !newEmployee.lastname) {
    return res
      .status(400)
      .json({ msg: "please provide firstname and lastname" });
  }
  // Add new employee to database
  data.setEmployees([...data.employees, newEmployee]);
  await fsPromises.writeFile(
    path.resolve(__dirname, "..", "model", "employees.json"),
    JSON.stringify(data.employees)
  );
  // send response to client
  return res.status(201).json(data.employees);
};

const updateEmployee = async (req, res) => {
  const id = req.params.id;
  const employee = data.employees.find((emp) => emp.id === id);
  if (!employee) {
    return res
      .status(400)
      .json({ message: `There is no employee with id:${id}` });
  }

  if (req.body.firstname) employee.firstname = req.body.firstname;
  if (req.body.lastname) employee.lastname = req.body.lastname;

  const filteredEmployees = data.employees.filter(
    (emp) => emp.id !== employee.id
  );
  const allEmployees = [...filteredEmployees, employee];
  // Update Employee database
  data.setEmployees(allEmployees);
  await fsPromises.writeFile(
    path.resolve(__dirname, "..", "model", "employees.json"),
    JSON.stringify(data.employees)
  );
  res.status(200).json(data.employees);
};

const deleteEmployee = async (req, res) => {
  const id = req.body.id;
  const employee = data.employees.find((emp) => emp.id === id);
  if (!employee) {
    return res
      .status(400)
      .json({ message: `There is no employee with id:${id}` });
  }

  const filteredEmployees = data.employees.filter((emp) => emp.id !== id);
  // Update employees database
  data.setEmployees(filteredEmployees);
  await fsPromises.writeFile(
    path.resolve(__dirname, "..", "model", "employees.json"),
    JSON.stringify(data.employees)
  );
  // send client response
  return res.status(201).json(data.employees);
};

const getSingleEmployee = (req, res) => {
  const id = req.params.id;
  const employee = data.employees.find((emp) => emp.id === id);
  if (!employee) {
    res.status(400).json({ message: `There is no employee with id:${id}` });
  }
  return res.status(201).json(employee);
};

module.exports = {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getSingleEmployee,
};
