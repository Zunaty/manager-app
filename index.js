const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'manager_db'
});

// Function to wait 1 sec
const wait = () => {
    setTimeout(()=>{}, 1000);
};

// Function to wait 1 sec and re prompt
const waitPrompt = () => {
    setTimeout(()=>{ promptUser() }, 1000);
};

// Function to view department table
const depoView = () => {
    db.query('SELECT department.name AS DepartmentName FROM department', (err, results) => {
        console.table('Viewing Departments', results);
    });
};

// Function to view roles table
const rolesView = () => {
    db.query('SELECT roles.title AS Title, roles.salary AS Salary, department.name AS Department FROM roles JOIN department ON roles.department_id = department.id;', (err, results) => {
        console.table('Viewing Employee Roles', results);
    });
};

// Function to view employee table
const employeeView = () => {
    db.query('SELECT employee.first_name AS FirstName, employee.last_name AS LastName, roles.title AS Title, roles.salary AS Salary, department.name AS DepartmentName FROM employee JOIN roles ON employee.role_id = roles.id JOIN department ON roles.department_id = department.id;', (err, results) => {
        console.table('Viewing All Employees', results);
    });
};

// Asking the user to select an option
const promptUser = () => {
    return inquirer.prompt(
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'listChoice',
            choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Done']
        }
    ).then(({ listChoice }) => {

        // Grabbing Departments from the database to view
        if (listChoice === 'View all departments') {
            depoView();
            waitPrompt();

        // Grabbing Roles from the database to view
        } else if (listChoice === 'View all roles') {
            rolesView();
            waitPrompt();

        // Grabbing Employees from the database to view
        } else if (listChoice === 'View all employees') {
            employeeView();
            waitPrompt();

        // Adding a department to the department table
        } else if (listChoice === 'Add a department') {
            return inquirer.prompt(
                {
                    type: 'input',
                    message: 'What is your new department name?',
                    name: 'depoName',
                    validate: depoNameInput => {
                        if(depoNameInput) {
                            return true;
                        } else {
                            console.log('Please enter a department name!');
                            return false;
                        }
                    }
                }

            // Taking the answer and inserting into table and then showing the change
            ).then(({ depoName }) => {
                db.query(`INSERT INTO department (name) VALUES ("${depoName}");`, (err, result) => {});

                wait();

                depoView();
                waitPrompt();
            });

        // Adding a role to the roles table
        } else if (listChoice === 'Add a role') {
            const roleChoices = [];

            db.query('SELECT name FROM department', (err, results) => {
                for(let i = 0; i < results.length; i++) {
                    roleChoices.push(results[i].name);
                };
            });

            wait();

            return inquirer.prompt([
                {
                    type: 'input',
                    message: 'What is your roles title?',
                    name: 'roleTitle',
                    validate: roleTitleInput => {
                        if(roleTitleInput) {
                            return true;
                        } else {
                            console.log('Please enter a roles title!');
                            return false;
                        }
                    }
                },
                {
                    type: 'input',
                    message: 'What is your roles salary?',
                    name: 'roleSalary',
                    validate: roleSalaryInput => {
                        if(roleSalaryInput) {
                            return true;
                        } else {
                            console.log('Please enter a roles salary!');
                            return false;
                        }
                    }
                },
                {
                    type: 'list',
                    message: 'Which department is this role in?',
                    name: 'roleDepo',
                    choices: roleChoices
                }
               
            // Taking title, salary, and department id and inserting into roles table
            ]).then((data) => {
                const roleDepoID = roleChoices.indexOf(data.roleDepo, 0) + 1;
                db.query(`INSERT INTO roles (title, salary, department_id) VALUES ("${data.roleTitle}", ${data.roleSalary}, ${roleDepoID});`, (err, result) => {});

                wait();

                rolesView();
                waitPrompt();
            });

        
        } else if (listChoice === 'Add a employee') {

        } else if (listChoice === 'Update an employee role') {

        } else if (listChoice === 'Done') {
            return console.log('Exiting App');
        }
    });
};

promptUser()