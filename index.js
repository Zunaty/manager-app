const inquirer = require('inquirer');
// const mysql = require('mysql2');
const cTable = require('console.table');

// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'manager_db'
// });

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
        if (listChoice === 'View all departments') {
            
        } else if (listChoice === 'View all roles') {

        } else if (listChoice === 'View all employees') {

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
.catch(err => {
    console.log(err);
})