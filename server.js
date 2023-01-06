const express = require('express');
const connection = require('./config/connections')
const mysql = require('mysql2');
const inquirer = require("inquirer");
const table = require("console.table");

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


console.log(`
        ███████╗███╗░░░███╗██████╗░██╗░░░░░░█████╗░██╗░░░██╗███████╗███████╗
        ██╔════╝████╗░████║██╔══██╗██║░░░░░██╔══██╗╚██╗░██╔╝██╔════╝██╔════╝
        █████╗░░██╔████╔██║██████╔╝██║░░░░░██║░░██║░╚████╔╝░██╔══╝░░██╔══╝░░
        ███████╗██║░╚═╝░██║██║░░░░░███████╗╚█████╔╝░░░██║░░░███████╗███████╗
        ╚══════╝╚═╝░░░░░╚═╝╚═╝░░░░░╚══════╝░╚════╝░░░░╚═╝░░░╚══════╝╚══════╝
        
        ████████╗██████╗░░█████╗░░█████╗░██╗░░██╗███████╗██████╗░
        ╚══██╔══╝██╔══██╗██╔══██╗██╔══██╗██║░██╔╝██╔════╝██╔══██╗
        ░░░██║░░░██████╔╝███████║██║░░╚═╝█████═╝░█████╗░░██████╔╝
        ░░░██║░░░██╔══██╗██╔══██║██║░░██╗██╔═██╗░██╔══╝░░██╔══██╗
        ░░░██║░░░██║░░██║██║░░██║╚█████╔╝██║░╚██╗███████╗██║░░██║
        ░░░╚═╝░░░╚═╝░░╚═╝╚═╝░░╚═╝░╚════╝░╚═╝░░╚═╝╚══════╝╚═╝░░╚═╝
    `)

viewAllEmployees()

function main() {
    inquirer.prompt([
        {
            type: "list",
            message: "Main Menu",
            name: "choice",
            choices: [
                "Add Employee",
                "Update Employee Role",
                "View All Employees",
                "Add New Role",
                "View All Roles",
                "Add New Department",
                "View All Departements",
                "Exit"
            ],
        },
    ]).then((answers) => {
        switch (answers.choice) {
            case "Add Employee":
                addNewEmp();
                break;
            case "Update Employee Role":
                updateEmpRole();
                break;
            case "View All Employees":
                viewAllEmployees();
                break;
            case "Add New Role":
                addNewRole();
                break;
            case "View All Roles":
                viewAllRoles();
                break;
            case "Add New Department":
                addNewDept();
                break;
            case "View All Departements":
                viewAllDept();
                break;
            case "Exit":
                break;
            default:
                connection.end()
        }
    })
}

function addNewEmp() {
    inquirer.prompt([
        {
            name: "first_name",
            type: "input",
            message: "Enter employee first name"
        },
        {
            name: "last_name",
            type: "input",
            message: "Enter employee last name"
        },
        {
            name: "role_id",
            type: "input",
            message: "Enter employee role"
        },
        {
            name: "manager_id",
            type: "input",
            message: "Enter manager id"
        }
    ]).then((answers) => {
        connection.query('INSERT INTO employee SET ?', {
            first_name: answers.first_name,
            last_name: answers.last_name,
            role_id: answers.role_id,
            manager_id: answers.manager_id
        }, (err, res) => {
            if (err) throw err;
            console.log("New employee added")
            main();
        })
    })
    return;
}

function updateEmpRole() {
    inquirer.prompt([
        {
            name: "employee_id",
            type: "input",
            message: "Enter employee id"
        },
        {
            name: "role_id",
            type: "input",
            message: "Enter employee role id"
        }
    ]).then((answers) => {
        connection.query(`UPDATE employee SET role_id =${answers.role_id} WHERE id=${answers.employee_id}`
        )
    })
    console.log("Employee updated")
    main();
}

function viewAllEmployees() {
    const sql = `
    SELECT employee.first_name, 
    employee.last_name, 
    role.title, 
    role.salary, 
    department.name, 
    manager.first_name AS 'manager_firstname', 
    manager.last_name AS 'manager_lastname' FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON employee.manager_id = manager.id`
    connection.query(
        sql,
        (err, rows) => {
            if (err) throw err;
            console.table(rows);
            main();
        }
    );
    return;
}

function addNewRole() {
    inquirer.prompt([
        {
            name: "title",
            type: "input",
            message: "Enter role title"
        },
        {
            name: "salary",
            type: "input",
            message: "Enter role salary"
        },
        {
            name: "department_id",
            type: "input",
            message: "Enter department id"
        }
    ]).then((answers) => {
        connection.query('INSERT INTO role SET ?', {
            title: answers.title,
            salary: answers.salary,
            department_id: answers.department_id
        }, (err, res) => {
            if (err) throw err;
            console.log("New role added")
            main();
        })
    })
    return;
}


function viewAllRoles() {
    const sql = `SELECT role.title, role.salary, department.name FROM role LEFT JOIN department ON role.department_id = department.id`
    connection.query(
        sql,
        (err, rows) => {
            if (err) throw err;
            console.table(rows);
            main();
        }
    );
    return;
}

function addNewDept() {
    inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: "Enter department name"
        }
    ]).then((answers) => {
        connection.query('INSERT INTO department SET ?', {
            name: answers.name
        }, (err, res) => {
            if (err) throw err;
            console.log("New department added")
            main();
        })
    })
    return;
}


function viewAllDept() {
    const sql = `SELECT * FROM department`
    connection.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        main();
    });

}


