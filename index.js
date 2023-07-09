const mysql = require('mysql');
const inquirer = require('inquirer');

require('dotenv').config();


// Create connection to the MySQL database
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  
});
console.log(`╔═══════════════════════════╗`);
console.log(`║                           ║`);
console.log(`║    AbuFahad & Associates  ║`);
console.log(`║                           ║`);
console.log(`╚═══════════════════════════╝`);
// Connect to the database
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to the database.');
  startApp();
});

// Function to start the application
function startApp() {
  inquirer
    .prompt({
      name: 'action',
      type: 'list',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Exit',
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case 'View all departments':
          viewAllDepartments();
          break;
        case 'View all roles':
          viewAllRoles();
          break;
        case 'View all employees':
          viewAllEmployees();
          break;
        case 'Add a department':
          addDepartment();
          break;
        case 'Add a role':
          addRole();
          break;
        case 'Add an employee':
          addEmployee();
          break;
        case 'Update an employee role':
          updateEmployeeRole();
          break;
        case 'Exit':
          connection.end();
          break;
        default:
          console.log('Invalid action. Please try again.');
          startApp();
      }
    });
}

// Function to view all departments
function viewAllDepartments() {
  connection.query('SELECT * FROM department', (err, res) => {
    if (err) throw err;
    console.table(res);
    startApp();
  });
}

// Function to view all roles
function viewAllRoles() {
  const query =
    'SELECT roles.id, roles.title, roles.salary, department.name AS department FROM roles LEFT JOIN department ON roles.department_id = department.id';
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    startApp();
  });
}

// Function to view all employees
function viewAllEmployees() {
  const query =
    'SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.name AS department, roles.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee LEFT JOIN roles ON employee.roles_id = roles.id LEFT JOIN department ON roles.department_id = department.id LEFT JOIN employee manager ON employee.manager_id = manager.id';
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    startApp();
  });
}

// Function to add a department
function addDepartment() {
  inquirer
    .prompt({
      name: 'departmentName',
      type: 'input',
      message: 'Enter the name of the department:',
    })
    .then((answer) => {
      connection.query(
        'INSERT INTO department SET ?',
        { name: answer.departmentName },
        (err) => {
          if (err) throw err;
          console.log('Department added successfully.');
          startApp();
        }
      );
    });
}

// Function to add a role
function addRole() {
  connection.query('SELECT * FROM department', (err, departments) => {
    if (err) throw err;

    const departmentChoices = departments.map((department) => ({
      name: department.name,
      value: department.id,
    }));

    inquirer
      .prompt([
        {
          name: 'roleTitle',
          type: 'input',
          message: 'Enter the title of the role:',
        },
        {
          name: 'roleSalary',
          type: 'input',
          message: 'Enter the salary for the role:',
        },
        {
          name: 'departmentId',
          type: 'list',
          message: 'Select the department for the role:',
          choices: departmentChoices,
        },
      ])
      .then((answers) => {
        connection.query(
          'INSERT INTO roles SET ?',
          {
            title: answers.roleTitle,
            salary: answers.roleSalary,
            department_id: answers.departmentId,
          },
          (err) => {
            if (err) throw err;
            console.log('Role added successfully.');
            startApp();
          }
        );
      });
  });
}

// Function to add an employee
function addEmployee() {
  connection.query('SELECT * FROM roles', (err, roles) => {
    if (err) throw err;

    const roleChoices = roles.map((role) => ({
      name: role.title,
      value: role.id,
    }));

    inquirer
      .prompt([
        {
          name: 'firstName',
          type: 'input',
          message: 'Enter the first name of the employee:',
        },
        {
          name: 'lastName',
          type: 'input',
          message: 'Enter the last name of the employee:',
        },
        {
          name: 'roleId',
          type: 'list',
          message: 'Select the role for the employee:',
          choices: roleChoices,
        },
        {
          name: 'managerId',
          type: 'input',
          message:
            'Enter the manager ID for the employee (leave empty if none):',
        },
      ])
      .then((answers) => {
        connection.query(
          'INSERT INTO employee SET ?',
          {
            first_name: answers.firstName,
            last_name: answers.lastName,
            roles_id: answers.roleId,
            manager_id: answers.managerId || null,
          },
          (err) => {
            if (err) throw err;
            console.log('Employee added successfully.');
            startApp();
          }
        );
      });
  });
}

// Function to update an employee role
function updateEmployeeRole() {
  connection.query('SELECT * FROM employee', (err, employees) => {
    if (err) throw err;

    const employeeChoices = employees.map((employee) => ({
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id,
    }));

    connection.query('SELECT * FROM roles', (err, roles) => {
      if (err) throw err;

      const roleChoices = roles.map((role) => ({
        name: role.title,
        value: role.id,
      }));

      inquirer
        .prompt([
          {
            name: 'employeeId',
            type: 'list',
            message: 'Select the employee to update:',
            choices: employeeChoices,
          },
          {
            name: 'roleId',
            type: 'list',
            message: 'Select the new role for the employee:',
            choices: roleChoices,
          },
        ])
        .then((answers) => {
          connection.query(
            'UPDATE employee SET ? WHERE ?',
            [
              {
                roles_id: answers.roleId,
              },
              {
                id: answers.employeeId,
              },
            ],
            (err) => {
              if (err) throw err;
              console.log('Employee role updated successfully.');
              startApp();
            }
          );
        });
    });
  });
}
