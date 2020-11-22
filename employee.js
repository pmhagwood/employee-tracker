const mysql = require('mysql');
const inquirer = require('inquirer');
// const cTable = require('console.table');

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'Pw7Shadow4me2.',
  database: 'employee_trackerDB',
});
connection.connect((err) => {
  if (err) throw err;
  addDepartment();
});

const addDepartment = () => {
  inquirer
    .prompt({
      name: "department",
      type: "list",
      message: "What would you like to do?",
      choices: [
        'View all employees',
        'View all employees by department',
        'View all employees by manager',
        'Add employee',
        'Remove employee',
        'Update employee role',
        'Update employee manager'
      ],
    })
    .then((answer) => {
      // console.log(answer);
      switch (answer.action) {
        case 'View all employees':
          viewEmployees();
          break;
        case 'View all employees by department':
          viewEmpbyDepartment();
          break;
        case 'View all employees by manager':
          viewEmpbyManager();
          break;
        case 'Add employee':
          addEmployee();
          break;
        case 'Remove employee':
          removeEmployee();
          break;
        case 'Update employee role':
          updateEmployeerole();
          break;
        case 'Update employee manager':
          updateEmployeeManager();
          break;
        case 'exit':
          connection.end();
          break;
      }
    });
};


const viewEmployees = () => {
  console.log('worked');
  // const query =
  //   'SELECT employee.id, employee.first_name, employee.last_name , role.title, role.salary FROM employee left join role on employee.role_id=role.id;';
  // connection.query(query, (err, res) => {
  //   if (err) throw err;
  //   console.log('\n');
  //       console.log('VIEW ALL EMPLOYEES');
  //       console.log('\n');
  //       console.table(res);
  //       prompt();
  // });
};