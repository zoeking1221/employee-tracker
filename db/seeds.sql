INSERT INTO departments (name)
VALUES
 ('Data Management'),
 ('Project Management'),
 ('Clinical Specialists');

INSERT INTO roles (title, salary, department_id)
VALUES
('Associate Data Manager', 60000, 1),
('Data Manager', 90000, 1),
('Senior Data Manager', 100000, 1),
('Director of Data Management', 120000, 1),
('Associate Project Manager', 70000, 2),
('Project Manager', 100000, 2),
('Senior Project Manager', 110000, 2),
('Director of Project Management', 130000, 2),
('Clinical Specialist', 90000, 3),
('Senior Clinical Specialist', 100000, 3),
('Clinical Director', 120000, 3);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
('Anna', 'Ferlanti', 1, 4),
('Zoe', 'King', 2, 4),
('Patrick', 'Burgoyne', 3, 4),
('Susan', 'Payne', 4, NULL),
('Nina', 'Heller', 5, 8),
('David', 'Cutler', 6, 8),
('Amy', 'Genuardi', 7, 8),
('Shaena', 'Kauffman', 8, NULL),
('Katie', 'Delpino', 9, 11),
('Jeremiah', 'Phillips', 10, 11),
('Lisa', 'Boron', 11, NULL);