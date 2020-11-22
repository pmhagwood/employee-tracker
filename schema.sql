DROP DATABASE IF EXISTS employee_trackerDB;
CREATE database employee_trackerDB;

USE employee_trackerDB;

CREATE TABLE department (
  id int AUTO_INCREMENT NOT NULL,
  name varchar(30) NOT NULL,
  PRIMARY KEY(id)
);

CREATE TABLE role (
  id int AUTO_INCREMENT NOT NULL,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL(10,4) NULL,
  department_id INT NULL,
  PRIMARY KEY (id),
  Foreign Key (department_id) References department(id)
);

CREATE TABLE employee (
  id INT AUTO_INCREMENT NOT NULL,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NULL,
  manager_id INT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY(role_id) REFERENCES role(id),
  FOREIGN KEY(manager_id) REFERENCES employee(id)
)

INSERT INTO department (name)
VALUES ("sales"),("Engineering"),("Finance"),("Legal");



INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead", 100000, 1), ("Sales Person", 80000, 1),("Lead Engineer", 150000, 2),("Software Engineer", 120000, 2),("Accountant", 125000, 3),("Legal Team Lead", 250000, 4),("Lawyer", 190000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", 1, null),("Mike", "Chan", 2, null),("Ashley", "Rodriguez", 3, null),("Kevin", "Tupik", 4, null),("Malia", "Brown", 5, null),("Sarah", "Lourd", 6, null),("Tom", "Allen", 7, NULL), ("Christian", "Eckenrode", 3, NULL);

UPDATE employee SET manager_id = 3 WHERE ID=1 OR ID=4;

UPDATE employee SET manager_id = 1 WHERE ID=2;

UPDATE employee SET manager_id = 6 WHERE ID=7;


USE employee_trackerDB;
SELECT employee.id, employee.first_name, employee.last_name , role.title, role.salary
FROM employee left join role on employee.role_id=role.id;