INSERT INTO department (name)
VALUES ("Accounting"),
       ("Human Resources"),
       ("Marketing"),
       ("Quality Control"),
       ("Executive"),
       ("Engineering"),
       ("Janitorial");

INSERT INTO role (title, salary, department_id)
VALUES ("CEO", 70.5, 5),
       ("HR Manager", 41.0, 2),
       ("Executive Accountant", 43.5, 1),
       ("Chief Engineer", 47.5, 6),
       ("Janitor", 25.5, 7),
       ("Strategic Analyst", 46.0, 3),
       ("Product Inspector", 23.0, 4);
       
-- I can't be bothered changing these

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Chad", "Davies", 1, NULL),
       ("Huckleberry", "Finn", 5, 3),
       ("Ann", "Yeletz", 2, 1),
       ("Joe", "Biden", 7, 1),
       ("Beth", "Smith", 3, 1),
       ("Rick", "Sanchez", 4, 1),
       ("Damien", "Ly", 7, 2),
       ("Dwayne", "Johnson", 6, 1),