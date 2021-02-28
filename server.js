var inquirer = require('inquirer');
const cTable = require('console.table'); 
const mysql2 = require('mysql2');

// create the connection information for the sql database
var connection = mysql2.createConnection({
    multipleStatements: true,
    host: "localhost",
  
    // your port; if not 3306
    port: 3306,
  
    // your username
    user: "root",
  
    // your password
    password: "Evie1221!",
    database: "employee_tracker_db"
  });
  
  // connect to the mysql server and sql database
  connection.connect(function(err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
  });

  // questions for what user wants to do
  const questions = [
      {
          type: 'list',
          name: 'options',
          message: 'What would you like to do?',
          choices: [
            'View All Departments',
            'View All Roles',
            'View All Employees',
            'Add a Department',
            'Add a Role',
            'Add an Employee',
            'Update an Employee Role'
        ]
      }
  ]

  // function to begin inquirer prompt 
  function start() {
      return inquirer.prompt(questions)
      .then((data) => {
        optionHandler(data.options);
      });
  };

  // function to view all departments
  function viewAllDepartments() {
    connection.query('SELECT * FROM departments', function (err, res) {
        if (err) throw err;
        console.table(res);
        connection.end();
  });
}

// function to view all roles
function viewAllRoles () {
    connection.query('SELECT roles.id, roles.title, roles.salary, departments.name AS department FROM roles LEFT JOIN departments ON roles.department_id = departments.id', function (err, res) {
        if (err) throw err;
        console.table(res);
        connection.end();
    });
};

// function to view all employees
function viewAllEmployees() {
    connection.query(
        'SELECT employees.id, employees.first_name, employees.last_name, roles.title AS title, roles.salary AS salary, departments.name AS department, manager_id FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id', 
        function (err, res) {
        if (err) throw err;
        console.table(res);
        connection.end();
    })
}

// add a department
function addDepartment() {
    inquirer.prompt(
        {
            type: 'input',
            name: 'department',
            message: 'What is the name of the department would you like to add?'
        }
    )
    .then((data) => {
        connection.query('INSERT INTO departments SET ?', {
            name: data.department
        },
        function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + ' department added!\n');
      });
    });
}

// add a role
function addRole() {
    var departments = [];
    connection.query('SELECT * FROM departments', function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            departments.push(res[i].name);
        }
    });
    
    return inquirer.prompt([ 
            {
                type: 'input',
                name: 'role_title',
                message: 'What is the title of the role would you like to add?',
            },
            {
                type: 'input',
                name: 'role_salary',
                message: 'What is the salary of the role?'
            },
            {
                type: 'list',
                name: 'role_department',
                message: 'What deartment would you like to add the role to?',
                choices: departments
            }
    ])

    .then((data) => {
        connection.query('SELECT id FROM departments WHERE name =?',
        [
            data.role_department
        ],
        function (err, res) {
            if (err) throw err;
            var departmentId = res[0].id
        
    
            connection.query('INSERT INTO roles SET ?,?,?',
            [{
                title: data.role_title
            },
            {   salary: data.role_salary
            },
            {   department_id: departmentId
            }],
        function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + ' role added!\n');
        });
        });
    }
)};

// add an employee
function addEmployee() {
    var roles = [];
    connection.query('SELECT title FROM roles', function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            roles.push(res[i].title);
        }
    });

    var managers = [];
    connection.query('SELECT CONCAT( first_name, " ", last_name ) AS full_name FROM employees', function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            managers.push(res[i].full_name);
        }
    });

    return inquirer.prompt([
        {
            type: 'input',
            name: 'employee_first_name',
            message: 'What is the first name of the employee you would like to add?',
        },
        {
            type: 'input',
            name: 'employee_last_name',
            message: 'What is the last name of the employee you would like to add?',
        },
        {
            type: 'list',
            name: 'employee_role',
            message: 'What is the role of the employee you would like to add?',
            choices: roles
        },
        {
            type: 'list',
            name: 'employee_manager',
            message: 'Who is the manager of the employee you would like to add?',
            choices: managers
        },
    ])
    .then((data) => {
        connection.query('SELECT id FROM roles WHERE title =?; SELECT id FROM employees WHERE CONCAT( first_name, " ", last_name ) =?',
        [
            data.employee_role,
            data.employee_manager
        ],
        function (err, res) {
            if (err) throw err;
            var roleId = res[0][0].id;
            var managerId = res[1][0].id;
        
            connection.query('INSERT INTO employees SET ?,?,?,?',
            [{
                first_name: data.employee_first_name
            },
            {   last_name: data.employee_last_name
            },
            {   role_id: roleId
            },
            {   manager_id: managerId
            }],
        function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + ' employee added!\n');
      });
    }); 
    });
}

// update an employee role
function updateEmployeeRole() {
    var roles = [];
    connection.query('SELECT title FROM roles', function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            roles.push(res[i].title);
        }
    });

    var employees = [];
    connection.query('SELECT CONCAT( first_name, " ", last_name ) AS full_name FROM employees', function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            employees.push(res[i].full_name);
        }
    

    return inquirer.prompt([
        {
            type: 'list',
            name: 'employee_update',
            message: 'Which employee would you like to update?',
            choices: employees
        },
        {
            type: 'list',
            name: 'employee_role',
            message: 'What would you like to update this employees role to?',
            choices: roles
        },
    ])
    .then((data) => {
        connection.query('SELECT id FROM roles WHERE title =?; SELECT id FROM employees WHERE CONCAT( first_name, " ", last_name ) =?', 
        [
            data.employee_role,
            data.employee_update
        ],
        function (err, res) {
            if (err) throw err;
            var roleId = res[0][0].id;
            var employeeId = res[1][0].id;

            connection.query('UPDATE employees SET ? WHERE ?',
            [{
                role_id: roleId
            },
            {
                id: employeeId
            }
            ],
            function(err, res) {
                if (err) throw err;
                console.log(res.affectedRows + ' employee role update!\n');
            }
            )
      });
      });
    });
}


  function optionHandler(options) {
    switch(options) {
        case 'View All Departments':
            viewAllDepartments();
            break;
        case 'View All Roles':
            viewAllRoles();
            break;
        case 'View All Employees':
            viewAllEmployees();
            break;
        case 'Add a Department':
            addDepartment();
            break;
        case 'Add a Role':
            addRole();
            break;
        case 'Add an Employee':
            addEmployee();
            break;
        case 'Update an Employee Role':
            updateEmployeeRole();
            break;
    };
  };


