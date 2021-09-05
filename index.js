const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'manager_db'
});

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
            db.query('SELECT name FROM department', function(err, results) {
                console.table('Viewing Departments', results);
            })
            setTimeout(()=>{ promptUser() }, 1000)

        // Grabbing Roles from the database to view
        } else if (listChoice === 'View all roles') {
            db.query('SELECT title, salary FROM roles', function(err, results) {
                console.table('Viewing Employee Roles', results);
            })
            setTimeout(()=>{ promptUser() }, 1000)

        // Grabbing Employees from the database to view
        } else if (listChoice === 'View all employees') {
            db.query('SELECT employee.first_name AS first_name, employee.last_name AS last_name, roles.title AS title, roles.salary AS salary FROM employee JOIN roles ON employee.role_id = roles.id;', function(err, results) {
                console.table('Viewing All Employees', results);
            })
            setTimeout(()=>{ promptUser() }, 1000)
        } else if (listChoice === 'Add a department') {

        } else if (listChoice === 'Add a role') {

        } else if (listChoice === 'Add a employee') {

        } else if (listChoice === 'Update an employee role') {

        } else if (listChoice === 'Done') {
            return console.log('Exiting App');
        }
    });
};

promptUser()