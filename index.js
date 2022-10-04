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
    console.log(table);
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
    name: "member",
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
        () => {}
    ]
};

async function VAE() {
    db.query(`select 
    employee.id, 
    employee.first_name, 
    employee.last_name, 
    title, 
    department.name as department, 
    salary, 
    CONCAT(manager.first_name, ' ', manager.last_name) as manager 
    from employee 
    CROSS JOIN role on employee.role_id = role.id
    CROSS JOIN department on role.department_id = department.id
    CROSS JOIN employee as manager on employee.manager_id = manager.id;`, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            // console.log(result);
            displayTable(result);
        }
    });
}

async function AE() { // do this
    db.query(`select 
    employee.id, 
    employee.first_name, 
    employee.last_name, 
    title, 
    department.name as department, 
    salary, 
    CONCAT(manager.first_name, ' ', manager.last_name) as manager 
    from employee 
    CROSS JOIN role on employee.role_id = role.id
    CROSS JOIN department on role.department_id = department.id
    CROSS JOIN employee as manager on employee.manager_id = manager.id;`, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            // console.log(result);
            displayTable(result);
        }
    });
}

async function UER() { // do this
    db.query(`select 
    employee.id, 
    employee.first_name, 
    employee.last_name, 
    title, 
    department.name as department, 
    salary, 
    CONCAT(manager.first_name, ' ', manager.last_name) as manager 
    from employee 
    CROSS JOIN role on employee.role_id = role.id
    CROSS JOIN department on role.department_id = department.id
    CROSS JOIN employee as manager on employee.manager_id = manager.id;`, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            // console.log(result);
            displayTable(result);
        }
    });
}

async function VAR() { // do this
    db.query(`select 
    employee.id, 
    employee.first_name, 
    employee.last_name, 
    title, 
    department.name as department, 
    salary, 
    CONCAT(manager.first_name, ' ', manager.last_name) as manager 
    from employee 
    CROSS JOIN role on employee.role_id = role.id
    CROSS JOIN department on role.department_id = department.id
    CROSS JOIN employee as manager on employee.manager_id = manager.id;`, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            // console.log(result);
            displayTable(result);
        }
    });
}

async function AR() { // do this
    let res = await iq.prompt({
        type: "input",
        message: "What is the name of the role?",
        name: "role"
    });

    // console.log(res);
    db.query(`INSERT INTO role (name) 
    VALUE ( "${res.role}" );`, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            // console.log(result);
            console.log(`Added ${res.role} to the database`);
        }
    });
}

async function VAD() {
    db.query(`select 
    id, 
    name
    from department;`, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            // console.log(result);
            displayTable(result);
        }
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
    });
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

const sleep = ms => new Promise(r => setTimeout(r, ms));

VAE();
sleep(100);
// AE();
sleep(100);
// UER();
sleep(100);
// VAR();
sleep(100);
AR();
sleep(100);
VAD();
sleep(100);
AD();

// // Query database

// let deletedRow = 2;

// db.query(`DELETE FROM favorite_books WHERE id = ?`, deletedRow, (err, result) => {
//   if (err) {
//     console.log(err);
//   }
//   console.log(result);
// });

// // Query database
// db.query('SELECT * FROM favorite_books', function (err, results) {
//   console.log(results);
// });

// app.get("/api/movies", (req, res) => {
//   db.query('SELECT movie_name FROM movies', (err, results) => {
//     if (!err) {
//       res.json(results);
//       console.log("successfully returned movies list")
//     } else {
//       console.log("ERROR:", err);
//       res.send(`ERROR: ${err}`);
//     }
//   });
// });

// app.post("/api/movies", (req, res) => {
//   db.query('SELECT movie_name FROM movies', (err, results) => {
//     if (!err) {
//       res.json(results);
//       console.log("successfully returned movies list")
//     } else {
//       console.log("ERROR:", err);
//       res.send(`ERROR: ${err}`);
//     }
//   });
// });