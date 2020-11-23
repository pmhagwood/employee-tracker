const mysql = require('mysql');
const inquirer = require('inquirer');
require('console.table');

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
      console.log(answer);
      switch (answer.department) {
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
  const query =
    'SELECT employee.id, employee.first_name, employee.last_name , role.title, role.salary FROM employee left join role on employee.role_id=role.id;';
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.log('\n');
    console.log('VIEW ALL EMPLOYEES');
    console.log('\n');
    console.table(res);
    addDepartment();
  });
};

const viewEmpbyDepartment = () => {
  // console.log('worked2');
  const query =
    `SELECT department.name AS department, role.title, employee.id, employee.first_name, employee.last_name
    FROM employee
    LEFT JOIN role ON (role.id = employee.role_id)
    LEFT JOIN department ON (department.id = role.department_id)
    ORDER BY department.name;`;
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.log('\n');
    console.log('VIEW EMPLOYEE BY MANAGER');
    console.log('\n');
    console.table(res);
    addDepartment();
  });
};

const viewEmpbyManager = () => {
  const query =
    `SELECT CONCAT(manager.first_name, ' ', manager.last_name) AS manager, department.name AS department, employee.id, employee.first_name, employee.last_name, role.title
    FROM employee
    LEFT JOIN employee manager on manager.id = employee.manager_id
    INNER JOIN role ON (role.id = employee.role_id && employee.manager_id != 'NULL')
    INNER JOIN department ON (department.id = role.department_id)
    ORDER BY manager;`;
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.log('\n');
    console.log('VIEW EMPLOYEE BY DEPARTMENT');
    console.log('\n');
    console.table(res);
    addDepartment();
  });
};

const addEmployee = () => {
  connection.query('SELECT * FROM role', function(err, res){
    if (err) throw (err);
    inquirer
    .prompt([
      {
      name: "firstName",
      type: "input",
      message: "What is employee's first name?",
      },
      {
        name: "lastName",
        type: "input",
        message: "What is Employee's last name?",
      },
      {
        name: "roleName",
        type: "list",
        message: "what role does the Employee have?",
        // hopefully gets all the roles
        choices: function() {
          rolesArray = [];
          res.map(res => {
            rolesArray.push(
              res.title
            );
          })
          return rolesArray;
        }
      }
    ])
    .then(function(answer){
      console.log(answer);
      const role = answer.roleName;
      console.log('role name is : ', role);
      // try to get the role and add the employee and get ID
      connection.query('SELECT * FROM role', function(err, res){
        if (err) throw (err);
        let filterRole = res.filter(function(res){
          return res.title == role;
        })
        let roleId = filterRole[0].id;
        console.log(roleId);
        connection.query('SELECT * FROM employee', function(err, res){
          inquirer
          .prompt ([
            {
              name:"manager",
              type: "list",
              message: "Employee's Manager Name.",
              choices: function(){
                managersArray = []
                res.map(res => {
                  managersArray.push(
                    res.last_name
                  )
                  return managersArray;
                })
              }
            }
          ])
          .then(function(managerAnswer){
            const manager = managerAnswer.manager;
            console.log("manager name ", manager);
          })
        })
      })
    })
  })
}

const removeEmployee = () => {
  inquirer
    .prompt([
      {
        name: "remove",
        type: "input",
        message: "Enter the ID of the Employee you would like to remove: "
      }
    ])
    .then(function (answer) {
      connection.query('DELETE FROM employee WHERE ?',
        {
          id: answer.remove
        },
        function (err) {
          if (err) throw err;
          console.log('Employee has been removed');
          addDepartment();
        }
      )
    })
}

