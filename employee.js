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
  menu();
});

const menu = () => {
  inquirer
    .prompt({
      name: "department",
      type: "list",
      message: "What would you like to do?",
      choices: [
        'View all employees',
        'View all departments',
        'View all roles',
        'Add employee',
        'Add new department',
        'Add new role',
        'Update employee role',
        'Remove department',
        'Remove employee',
        'View all employees by department',
        'View all employees by manager',
      ],
    })
    .then((answer) => {
      console.log(answer);
      switch (answer.department) {
        case 'View all employees':
          viewEmployees();
          break;
        case 'View all departments':
          viewDepartment();
          break;
        case 'View all roles':
          viewRoles();
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
        case 'Add new department':
          addNewDepartment();
          break;
        case 'Remove department':
          removeDepartment();
          break;
        case 'Add new role':
          addNewRole();
          break;
        case 'Update employee role':
          updateEmployeerole();
          break;
        // case 'Update employee manager':
        //   updateEmployeeManager();
        //   break;
        case 'exit':
          connection.end();
          break;
      }
    });
};
const addNewRole = () => {
  connection.query("SELECT * FROM department", (err, res) => {
     const newDepartment = res.map(department => department.name)
    inquirer
      .prompt([
        {
          type: "input",
          message: "What is the title of new role?",
          name: "title",
        },
        {
          type: "number",
          message: "What is the salary for this role?",
          name: "salary"
        },
        {
          type: "list",
          message: "Select the department",
          name: "department",
          choices:  newDepartment
        }
      ]).then(input => {
        // This will loop through the selection to find the match of the department name the user selected.
        const roleObj = res.find(department => input.department === department.name)

        connection.query("INSERT INTO role (title, salary, department_id) VALUES ( ?, ?, ?)", [input.title, input.salary, roleObj.id], (err) =>{
          if(err) throw err;
          menu();
        })
      })


  })






}

const viewDepartment = () => {
  const query = "SELECT * from department";
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.log('\n');
    console.log('VIEW DEPARTMENTS');
    console.log('\n');
    console.table(res);
    menu();
  })
};

const viewRoles = () => {
  connection.query(`SELECT role.id, title, salary, name department FROM employee_trackerDB.role
  LEFT JOIN department ON role.department_id = department.id`, (err, res) => {
    if (err) throw err;
    console.log('\n');
    console.log('VIEW ALL ROLES');
    console.log('\n');
    console.table(res);
    menu();
  })
}

const viewEmployees = () => {

  console.log('worked');
  const query =
    `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    LEFT JOIN employee manager on manager.id = employee.manager_id
    LEFT JOIN role ON (role.id = employee.role_id  )
    LEFT JOIN department ON (department.id = role.department_id)`;
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.log('\n');
    console.log('VIEW ALL EMPLOYEES');
    console.log('\n');
    console.table(res);
    menu();
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
    menu();
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
    menu();
  });
};

const addEmployee = () => {
  connection.query('SELECT * FROM role', function (err, result) {
    if (err) throw (err);


    inquirer
      .prompt([{
        name: "firstName",
        type: "input",
        message: "What is the employee's first name?",
      },
      {
        name: "lastName",
        type: "input",
        message: "What is the employee's last name?",
      },
      {
        name: "roleName",
        type: "list",
        message: "What role does the employee have?",
        // hopefully gets all the roles
        choices: function () {
          rolesArray = [];
          result.map(result => {
            rolesArray.push(
              result.title
            );
          })
          return rolesArray;
        }
      }
      ])
      .then(function (answer) {
        console.log(answer);
        const role = answer.roleName;
        // try to get the role and add the employee and get ID
        connection.query('SELECT * FROM role', function (err, res) {
          if (err) throw (err);
          let filteredRole = res.filter(function (res) {
            return res.title == role;
          })
          let roleId = filteredRole[0].id;
          connection.query("SELECT * FROM employee", function (err, res) {
            inquirer
              .prompt([
                {
                  name: "manager",
                  type: "list",
                  message: "Who is your manager?",
                  choices: function () {
                    managersArray = []
                    res.map(res => {
                      managersArray.push(
                        res.last_name)

                    })
                    return managersArray;
                  }
                }
              ]).then(function (managerAnswer) {
                const manager = managerAnswer.manager;
                connection.query('SELECT * FROM employee', function (err, res) {
                  if (err) throw (err);
                  let filteredManager = res.filter(function (res) {
                    return res.last_name == manager;
                  })
                  let managerId = filteredManager[0].id;
                  console.log(managerAnswer);
                  let query = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
                  let values = [answer.firstName, answer.lastName, roleId, managerId]
                  console.log(values);
                  connection.query(query, values,
                    function (err, res, fields) {
                      console.log(`You have added this employee: ${(values[0]).toUpperCase()}.`)
                    })
                  viewEmployees();
                })
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
          menu();
        }
      )
    })
}

function addNewDepartment() {
  inquirer
    .prompt({
      name: "department",
      type: "input",
      message: "Add a new Department?"
    })
    .then(function (answer) {
      connection.query('INSERT INTO department (name) VALUES ( ? )', answer.department, function (err, res) {
        console.log(`The following department has been added: ${(answer.department).toUpperCase()}.`)
      })
      viewDepartment();
    })
}


const removeDepartment = () => {
  inquirer
    .prompt([
      {
        name: "remove",
        type: "input",
        message: "Enter the ID of the Department you would like to remove: "
      }
    ])
    .then(function (answer) {
      connection.query('DELETE FROM department WHERE ?',
        {
          id: answer.remove
        },
        function (err) {
          if (err) throw err;
          console.log('Department has been removed');
          menu();
        }
      )
    })
}

const updateEmployeerole = () => {
  connection.query('SELECT * FROM employee', function (err, res) {
    if (err) throw (err);
    const newEmployees = res.map(employee => employee.first_name + " " + employee.last_name)
    console.log('main details ', res);
    inquirer
      .prompt([
        {
          name: "employeeUpdate",
          type: "list",
          message: "Select Employee to change role",
          choices: newEmployees
             
        }
      ])
      .then(function (answer) {
        console.log(answer);
        const name = answer.employeeUpdate;
        console.log("name1 is ", answer.employeeUpdate);
        // Have the employee need to update id from deparment
        connection.query('SELECT * FROM role', function (err, resrole) {
          const newRoles = resrole.map(role => role.title)
          inquirer
            .prompt([
              {
                name: "role",
                type: "list",
                message: "What is the new role?",
                choices:  newRoles
              }
            ])
            .then(function (rolesAnswer) {
                const employeeObj = res.find(employee => answer.employeeUpdate === employee.first_name + " " + employee.last_name)
                 const roleObj = resrole.find(role => rolesAnswer.role === role.title)
           
                 
                 connection.query('UPDATE employee SET role_id = ? WHERE id = ?', [roleObj.id, employeeObj.id], function (err) {
                 if (err) throw err;
                  menu();
                })
                
           
            })
        })

      })
  })
}