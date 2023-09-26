const data = {
  employees: require("../model/employees.json"),
  setEmployees: function (data) {
    this.employees = data;
  },
};

const getAllEmployees = (req, res) => {
  res.status(200).json(data.employees);
};

const getEmployee = (req, res) => {
  const employee = data.employees.find(
    (itm) => itm.id === parseInt(req.params.id)
  );
  if (!employee) {
    return res.status(400).json({ message: "No Employee found with given ID" });
  }
  res.status(200).json(employee);
};

const createNewEmployee = (req, res) => {
  const newEmployee = {
    id: data.employees[data.employees.length - 1].id + 1 || 1,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
  };

  if (!newEmployee.firstname || !newEmployee.lastname) {
    return res
      .status(400)
      .json({ message: "First and last name are required" });
  }

  data.setEmployees([...data.employees, newEmployee]);

  res.status(201).json(data.employees);
};

const updateEmployee = (req, res) => {
  const employee = data.employees.find(
    (itm) => itm.id === parseInt(req.body.id)
  );

  if (!employee) {
    res.status(400).json({ message: "No employee found with given id" });
  }
  if (employee.firstname) {
    employee.firstname = req.body.firstname;
  }
  if (employee.lastname) {
    employee.lastname = req.body.lastname;
  }

  const filteredArr = data.employees.filter(
    (itm) => itm.id !== parseInt(req.body.id)
  );

  const unsortedArr = [...filteredArr, employee];
  data.setEmployees(
    unsortedArr.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0))
  );

  res.status(200).json(data.employees);
};

const deleteEmployee = (req, res) => {
  const employee = data.employees.find(
    (itm) => itm.id === parseInt(req.body.id)
  );
  if (!employee) {
    res.status(400).json({ message: "No employee with given id" });
  }
  const filteredArr = data.employees.filter((itm) => itm.id !== employee.id);
  data.setEmployees(filteredArr);
  res.status(200).json(data.employees);
};

module.exports = {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
};
