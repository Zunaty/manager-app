INSERT INTO department (name)
VALUES ("Engineering"),
    ("Sales"),
    ("Legal"),
    ("Finance");

INSERT INTO roles (title, salary, department_id) 
VALUES ("Software Engineer", 60000, 1),
    ("QA Engineer", 45000, 1),
    ("Salesperson", 50000, 2),
    ("Sales Lead", 75000, 2),
    ("Lawyer", 100000, 3),
    ("Lead Lawyer", 200000, 3),
    ("Accountant", 70000, 4);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Ashley", "Smith", 5),
    ("John", "Doe", 4),
    ("Austen", "Willes", 1),
    ("Kim", "Howard", 2),
    ("Shaun", "Barn", 3),
    ("Dylan", "Payne", 6),
    ("Cami", "Niemi", 7);