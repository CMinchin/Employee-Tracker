// Import and require mysql2
const iq = require("inquirer");
const mysql = require('mysql2');

// import database details from .env file to avoid putting passwords on github
require('dotenv').config();

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    },
    console.log(`Connected to the movies database.`)
);

function displayTable(table) {
    // console.log(table);
    if (table == []) {
        console.log("This table is empty...");
        return; 
    }

    let columns = Object.keys(table[0]);
    let widths = []
    for (let x = 0; x < columns.length; x++) {
        let entry = columns[x];
        widths.push(entry.length);
        table.forEach(row => {
            if (String(row[entry]).length > widths[x]) {
                widths[x] = String(row[entry]).length;
            }
        });
    }
    // console.log(columns, widths);
    let out = "\n";
    for (let column = 0; column < columns.length; column++) {
        // console.log(columns[column], widths[column], columns[column].length);
        out += columns[column] + " ".repeat(widths[column] - columns[column].length + 1);
    }
    out += "\n";
    for (let column = 0; column < columns.length; column++) {
        out += "-".repeat(widths[column]) + " ";
    }
    out += "\n";
    for (let row = 0; row < table.length; row ++) {
        for (let column = 0; column < columns.length; column++) {
            // console.log(row, columns, column);
            out += String(table[row][columns[column]]) + " ".repeat(widths[column] - String(table[row][columns[column]]).length + 1);
        }
        out += "\n";
    }
    console.log(out);
}

const questionTree = {
    type: "list",
    message: "What would you like to do?",
    name: "action",
    choices: [
        "View All Employees",
        "Add Employee",
        "Update Employee Role",
        "View All Roles",
        "Add Role",
        "View All Departments",
        "Add Department",
        "Quit"
    ],
    outcomes: [
        VAE,
        AE,
        UER,
        VAR,
        AR,
        VAD,
        AD,
        ()=>{
            db.end(()=>{console.log("db closed")})
        }
    ]
};

async function VAE() {
    db.query(`SELECT 
    employee.id, 
    employee.first_name, 
    employee.last_name, 
    title, 
    department.name as department, 
    salary, 
    CONCAT(manager.first_name, ' ', manager.last_name) as manager 
    from employee 
    LEFT JOIN role on employee.role_id = role.id
    LEFT JOIN department on role.department_id = department.id
    LEFT JOIN employee as manager on employee.manager_id = manager.id;`, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            // console.log(result);
            displayTable(result);
        }
        main();
    });
}

async function AE() { // do this
    db.query(`SELECT id, title from role;`, async(err, roles) => {
        if (err) {
            console.log(err);
        } else {
            db.query(`SELECT id, CONCAT(first_name, ' ', last_name) as name from employee;`, async(err, managers) => {
                if (err) {
                    console.log(err);
                } else {
                    let Roles = roles.map( i => i.title );
                    let Managers = ["None"].concat(managers.map( i => i.name ));
                    // console.log(result, choices);
                    let res = await iq.prompt([
                        {
                            type: "input",
                            message: "What is the employee's first name?",
                            name: "first_name"
                        },
                        {
                            type: "input",
                            message: "What is the employee's last name?",
                            name: "last_name"
                        },
                        {
                            type: "list",
                            message: "What is the employee's role?",
                            name: "role",
                            choices: Roles
                        },
                        {
                            type: "list",
                            message: "Who is the employee's manager?",
                            name: "manager",
                            choices: Managers
                        }
                    ]);
                    
                    // console.log([{first_name:"None", last_name:"", id: "NONE"}].concat(managers).filter(i => i.first_name+" "+i.last_name == res.manager)[0].id);
                    db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
                    VALUE ( "${res.first_name}", "${res.last_name}", ${roles.filter(i => i.title == res.role)[0].id}, ${[{name:"None", id: "NULL"}].concat(managers).filter(i => i.name == res.manager)[0].id} );`, (err, response) => {
                        if (err) {
                            console.log(err);
                        } else {
                            // console.log(result);
                            console.log(`Added ${res.role} to the database`);
                        }
                        main();
                    });
                }
            });
        }
    });
}

async function UER() {
    db.query(`SELECT id, CONCAT(first_name, ' ', last_name) as name
    from employee;`, (err, employees) => {
        if (err) {
            console.log(err);
        } else {
            // console.log(result);
            db.query(`SELECT id, title
            from role;`, async (err, roles) => {
                if (err) {
                    console.log(err);
                } else {
                    let res = await iq.prompt([
                        {
                            type: "list",
                            message: "Which employee's role do you want to update?",
                            name: "employee",
                            choices: employees.map(i=>i.name)
                        },
                        {
                            type: "list",
                            message: "Which role do you want to assign to the selected employee?",
                            name: "role",
                            choices: roles.map(i=>i.title)
                        }
                    ]);
                    db.query(`UPDATE employee
                    SET role_id = ${roles.filter(i => i.title == res.role)[0].id}
                    WHERE id = ${employees.filter(i => i.name == res.employee)[0].id};`, async (err, roles) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("Updated employee's role");
                        }
                        main();
                    });
                }
            });
        }
    });
}

async function VAR() { // do this
    db.query(`SELECT role.id, title, department.name as department, salary
    from role 
    CROSS JOIN department on role.department_id = department.id;`, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            // console.log(result);
            displayTable(result);
        }
        main();
    });
}

async function AR() {
    db.query(`SELECT name
    from department;`, async(err, result) => {
        if (err) {
            console.log(err);
        } else {
            let choices = result.map( i => i.name )
            // console.log(result, choices);
            let res = await iq.prompt([
                {
                    type: "input",
                    message: "What is the name of the role?",
                    name: "role"
                },
                {
                    type: "input",
                    message: "What is the salary of the role?",
                    name: "salary"
                },
                {
                    type: "list",
                    message: "Which department does the role belong to?",
                    name: "department",
                    choices: choices
                }
            ]);
            db.query(`SELECT id from department where name = "${res.department}";`, (err, department) => {
                if (err) {
                    console.log(err);
                } else {
                    // console.log(res);
                    db.query(`INSERT INTO role (title, salary, department_id) 
                    VALUE ( "${res.role}", ${res.salary}, ${department[0].id} );`, (err, response) => {
                        if (err) {
                            console.log(err);
                        } else {
                            // console.log(result);
                            console.log(`Added ${res.role} to the database`);
                        }
                        main();
                    });
                }
            });
        }
    });
}

async function VAD() {
    db.query(`SELECT 
    id, 
    name
    from department;`, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            // console.log(result);
            displayTable(result);
        }
        main();
    });
}

async function AD() {
    let res = await iq.prompt({
        type: "input",
        message: "What is the name of the department?",
        name: "department"
    });

    // console.log(res);
    db.query(`INSERT INTO department (name) 
    VALUE ( "${res.department}" );`, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            // console.log(result);
            console.log(`Added ${res.department} to the database`);
        }
        main();
    });
}

async function main() { // this definitely introduces the risk of a number of issues including stack overflow but it would work after restart anyway
    let answer = await iq.prompt(questionTree)
    let outcome = questionTree.outcomes[questionTree.choices.indexOf(answer.action)]
    // console.log(outcome);
    outcome();
}

//display Text Splash

console.log(` ______                 _                       
|  ____|               | |                      
| |__   _ __ ___  _ __ | | ___  _   _  ___  ___ 
|  __| | '_ \` _ \\| '_ \\| |/ _ \\| | | |/ _ \\/ _ \\
| |____| | | | | | |_) | | (_) | |_| |  __/  __/
|______|_| |_| |_| .__/|_|\\___/ \\__, |\\___|\\___|
|  \\/  |         | |             __/ |          
| \\  / | __ _ _ _|_| __ _  __ _ |___/_ __       
| |\\/| |/ _\` | '_ \\ / _\` |/ _\` |/ _ \\ '__|      
| |  | | (_| | | | | (_| | (_| |  __/ |         
|_|  |_|\\__,_|_| |_|\\__,_|\\__, |\\___|_|         
                           __/ |                
                          |___/                 
`);

main();