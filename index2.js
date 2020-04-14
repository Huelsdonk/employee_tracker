const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table")
console.table([
    {
        Employee: "",
        Finder: ""
    }
])
const connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "banana89",
    database: "companyDB"
});

connection.connect(function (err) {
    if (err) throw err;
    Search();
});

function Search() {
    inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: "Welcome to Employee Finder! What would you like to do?",
            choices: [
                "View employees",
                "View departments",
                "View roles",
                "Add an Employee",
                "Add a Role",
                "Add a Department",
                "Quit"

            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View employees":
                    getEmployees();
                    break;

                case "View departments":
                    getDepartments();
                    break;

                case "View roles":
                    getRoles();
                    break;

                case "Add an Employee":
                    addEmployee();
                    break;

                case "Add a Department":
                    addDepartment();
                    break;

                case "Add a Role":
                    addRole();
                    break;

                case "Quit":
                    connection.end();
                    break;


            }
        });
}


function getEmployees() {
    var query = "SELECT DISTINCT E1.id, concat(E1.first_name, ' ', E1.last_name) AS Employee, R1.title AS Job_Title, D1.name AS Department, R1.salary, concat(M1.first_name, ' ', M1.last_name) AS Manager_Name FROM employee E1 JOIN role R1 ON R1.id = E1.role_id JOIN department D1 ON R1.department_id = D1.id LEFT JOIN employee M1 ON E1.manager_id = M1.id JOIN employee E2 ON R1.id = E2.role_id ORDER BY id";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res)
        Search();
    });
}

function getDepartments() {
    var query = "SELECT name, sum(salary) FROM companyDB.employee JOIN companyDB.ROLE ON role.id = employee.role_id AND employee.id IS NOT NULL JOIN companyDB.department ON role.department_id = department.id GROUP BY department.name";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res)
        Search();
    });
}

function getRoles() {
    var query = "SELECT role.title AS Job_Title, name AS Department, role.salary FROM companyDB.department JOIN companyDB.role ON companyDB.department.id = companyDB.role.department_id";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res)
        Search();
    });
}


function addEmployee() {
    var query = "SELECT title FROM companyDB.role;";
    connection.query(query, function (err, res) {
        if (err) throw err;
        let roleList = []
        inquirer
            .prompt([
                {

                    name: "role",
                    type: "rawlist",
                    choices: function () {
                        for (let i = 0; i < res.length; i++) {
                            roleList.push(res[i].title);
                        }
                        return roleList;
                    },
                    message: "What is the Employee's Role"

                },

                {
                    name: "first",
                    type: "input",
                    message: "What is the Employee's First Name?"
                },
                {
                    name: "last",
                    type: "input",
                    message: "What is the Employee's Last Name?"
                },

                {
                    name: "manager",
                    type: "number",
                    message: "What is the Employee's Manager ID? (Nope, not going to retrieve the names here. Did it in employee query)?",

                }


            ])
            .then(function (answer) {
// test this out to see if it works
                var query = "SELECT id FROM companyDB.role where title = '?'";
                connection.query(`SELECT id FROM companyDB.role where title = '${answer.role}'`,
                    
                function (err, res) {
                    if (err) throw err;

                    connection.query(
                        "INSERT INTO employee SET ?",
                        {
                            first_name: answer.first,
                            last_name: answer.last,
                            role_id: res,
                            manager_id: answer.manager
                        },
                        function (err) {
                            if (err) throw err;

                            Search();
                        }
                    );
                });
       })   })
    }


function addDepartment() {
            inquirer
                .prompt({
                    name: "department",
                    type: "input",
                    message: "What Department would you like to add?"
                })
                .then(function (answer) {
                    connection.query(
                        "INSERT INTO department SET ?",
                        {
                            name: answer.department

                        },
                        function (err) {
                            if (err) throw err;
                            Search();
                        }
                    )
                }
                )
        }

function addRole() {
            var query = "SELECT name FROM companyDB.department;";
            connection.query(query, function (err, res) {
                if (err) throw err;
                let departmentList = []
                inquirer
                    .prompt([
                        {

                            name: "department",
                            type: "rawlist",
                            choices: function () {
                                for (let i = 0; i < res.length; i++) {
                                    departmentList.push(res[i].name);
                                }
                                return departmentList;
                            },
                            message: "Which Department?"

                        },

                        {
                            name: "role",
                            type: "input",
                            message: "What is the name of the new role?"
                        },
                        {
                            name: "salary",
                            type: "number",
                            message: "What is the Salary for the new role?"
                        },



                    ])
                    .then(function (answer) {

                        connection.query(
                            "INSERT INTO role SET ?",
                            {
                                title: answer.role,
                                salary: answer.salary,
                                department_id: departmentList.indexOf(answer.department) + 1,
                            },
                            function (err) {
                                if (err) throw err;

                                Search();
                            }
                        );
                    });
            })
        }