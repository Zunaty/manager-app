const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'manager_db'
});

// Function to wait the number of seconds put into the function
const wait = (time) => {
    const x = time * 1000;
    setTimeout(()=>{}, x);
};

// Function to wait 1 sec and re prompt
const waitPrompt = () => {
    setTimeout(()=>{ promptUser() }, 1000);
};

// Function to view department table
const depoView = () => {
    db.query('SELECT department.id AS ID, department.name AS `Department Name` FROM department;', (err, results) => {
        console.table('Viewing Departments', results);
    });
};

// Function to view roles table
const rolesView = () => {
    db.query('SELECT roles.id AS ID, roles.title AS Title, roles.salary AS Salary, department.name AS `Department Name` FROM roles JOIN department ON roles.department_id = department.id;', (err, results) => {
        console.table('Viewing Employee Roles', results);
    });
};

// Function to view employee table
const employeeView = () => {
    db.query('SELECT employee.id AS ID, employee.first_name AS `First Name`, employee.last_name AS `Last Name`, roles.title AS Title, roles.salary AS Salary, department.name AS `Department Name` FROM employee JOIN roles ON employee.role_id = roles.id JOIN department ON roles.department_id = department.id;', (err, results) => {
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
            choices: ['View all departments', 'View all roles', 'View all employees', new inquirer.Separator(), 'Add a department', 'Add a role', 'Add an employee', new inquirer.Separator(),'Update an employee role', 'Done', new inquirer.Separator()]
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

                wait(1);

                depoView();
                waitPrompt();
            });

        // Adding a role to the roles table
        } else if (listChoice === 'Add a role') {

            // This array will hold the department names currently in the department table
            const roleChoices = [];

            // Grabing the department names and pushing into the array
            db.query('SELECT name FROM department;', (err, results) => {
                for(let i = 0; i < results.length; i++) {
                    roleChoices.push(results[i].name);
                };
            });

            wait();

            // Asking for role requirements
            return inquirer.prompt([
                {
                    type: 'input',
                    message: 'What is your roles title?',
                    name: 'roleTitle',
                    validate: roleTitleInput => {
                        if (roleTitleInput) {
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
                        if (roleSalaryInput) {
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

                wait(1);

                rolesView();
                waitPrompt();
            });

        // Adding an employee
        } else if (listChoice === 'Add an employee') {

            // This array will hold the role table titles
            const employeeChoices = [];

            // Grabing titles from the roles table and pushing to array
            db.query('SELECT title FROM roles;', (err, results) => {
                for (let i = 0; i < results.length; i++) {
                    employeeChoices.push(results[i].title);
                };
            });

            wait(1);

            // Asking for employee information
            return inquirer.prompt([
                {
                    type: 'input',
                    message: 'What is the employees first name?',
                    name: 'firstName',
                    validate: firstNameInput => {
                        if(firstNameInput) {
                            return true;
                        } else {
                            console.log('Please enter employees first name!');
                            return false;
                        }
                    }
                },
                {
                    type: 'input',
                    message: 'What is the employees last name?',
                    name: 'lastName',
                    validate: lastNameInput => {
                        if(lastNameInput) {
                            return true;
                        } else {
                            console.log('Please enter employees last name!');
                            return false;
                        }
                    }
                },
                {
                    type: 'list',
                    message: 'What role is the employee?',
                    name: 'emChoice',
                    choices: employeeChoices
                }

            // Inserting data into employee data table
            ]).then((data) => {
                const emRoleID = employeeChoices.indexOf(data.emChoice, 0) + 1;
                db.query(`INSERT INTO employee (first_name, last_name, role_id) VALUES ("${data.firstName}", "${data.lastName}", ${emRoleID});`, (err, result) => {});

                wait(1);

                employeeView();
                waitPrompt();
            });

        // Update the employees role
        } else if (listChoice === 'Update an employee role') {

            // These arrays will hold the table data to choose from
            const employeePick = [];
            const emRolePick = [];

            // This get the first and last name of an employee and combines them into one string, then pushed into the array
            db.query('SELECT CONCAT(id, " ", first_name," ", last_name) AS fullname FROM employee;', (err, results) => {       
                for (let i = 0; i < results.length; i++) {
                    employeePick.push(results[i].fullname);
                };
            });
            
            wait(1);

            // Grabing titles from the roles table and pushing to array
            db.query('SELECT title FROM roles;', (err, results) => {
                for (let i = 0; i < results.length; i++) {
                    emRolePick.push(results[i].title);
                };
            });

            // In order for the list ones to work properly, I've had to inplement a dumby question at the start
            return inquirer.prompt([
                {
                    type: 'input',
                    message: 'Press "ENTER" to continue!',
                    name: 'emcon',
                },
                {
                    type: 'list',
                    message: 'Which employee would you like to update the role on?',
                    name: 'emPick',
                    choices: employeePick
                },
                {
                    type: 'list',
                    message: 'Which new role is the employee?',
                    name: 'emRolePick',
                    choices: emRolePick
                }
            ]).then((data) => {
                // Pulling the name and ID into a variable, and spliting it up for ID, first name, and last name
                const x = data.emPick;
                const firstLast = x.split(' ');
                const emID = firstLast[0];
                const emRoleID = emRolePick.indexOf(data.emRolePick, 0) + 1;

                db.query(`UPDATE employee SET role_id = ${emRoleID} WHERE employee.id = ${emID};`, (err, results) => {});

                wait(1);

                employeeView();
                waitPrompt();
            });

        // Chosen to exit the app
        } else if (listChoice === 'Done') {
            return console.log('Exiting App');
        };
    });
};

promptUser()
.catch(err => {
    console.log(err);
})