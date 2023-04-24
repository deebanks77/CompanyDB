const Employee = require("../model/Employee");

const getAllEmployees = async (req, res) => {
  const employees = await Employee.find({});
  if (!employees)
    return res.status(200).json({ message: "No employees found" });
  return res.json(employees);
};

const createNewEmployee = async (req, res) => {
  const newEmployee = {
    firstname: req.body?.firstname,
    lastname: req.body?.lastname,
  };

  if (!newEmployee.firstname || !newEmployee.lastname) {
    return res
      .status(400)
      .json({ msg: "please provide firstname and lastname" });
  }
  try {
    // Add new employee to database
    const employee = await Employee.create(newEmployee);
    // send response to client
    return res.status(201).json(employee);
  } catch (error) {
    console.log(error);
  }
};

const updateEmployee = async (req, res) => {
  const id = req.body?.id;
  if (!id) return res.status(400).json({ message: "id parameret is required" });
  // check if employee exist
  const foundEmployee = await Employee.findOne({ _id: id }).exec();
  if (!foundEmployee) {
    return res
      .status(400)
      .json({ message: `There is no employee with id:${id}` });
  }

  if (req.body?.firstname) foundEmployee.firstname = req.body.firstname;
  if (req.body?.lastname) foundEmployee.lastname = req.body.lastname;
  // Update MongoDB Employee database
  const employee = await foundEmployee.save();
  res.sendStatus(200).json(employee);
};

const deleteEmployee = async (req, res) => {
  const id = req.body?.id;
  if (!id) return res.status(400).json({ message: "id is required" });
  // check if employee with id exist in Database => MongoDB
  const foundEmployee = await Employee.findOne({ _id: id });
  if (!foundEmployee) {
    return res
      .status(400)
      .json({ message: `There is no employee with id:${id}` });
  }
  // Update employees database
  const employee = await Employee.findOneAndDelete({ _id: foundEmployee._id });
  // send client response
  return res.status(201).json({ success: true });
};

const getSingleEmployee = async (req, res) => {
  const id = req.params?.id;
  const employee = await Employee.findOne({ _id: id });
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
