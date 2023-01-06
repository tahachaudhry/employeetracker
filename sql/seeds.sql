INSERT INTO department(name)
VALUES
('IT'),
('HR'),
('Sales');

INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES
("Damina", "Garzia", 1,NULL),
("John", "Doe", 2,1),
("Harry", "Kim" , 3,NULL),
("Doni", "Kimchi" , 4, 3);

INSERT INTO role (title, salary, department_id)
VALUES
("Manager", 380,1),
("SEO Expert", 480, 2),
("Full Stack Dev", 580,2),
("Director", 680,1);

