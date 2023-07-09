USE employees_db;

-- Insert sample departments
INSERT INTO department (name) VALUES
  ('Finance'),
  ('Sales'),
  ('Marketing'),
  ('Human Resources');

-- Insert sample roles
INSERT INTO roles (title, salary, department_id) VALUES
  ('Accountant', 50000.00, 1),
  ('Financial Analyst', 60000.00, 1),
  ('Sales Representative', 45000.00, 2),
  ('Sales Manager', 80000.00, 2),
  ('Marketing Specialist', 55000.00, 3),
  ('HR Coordinator', 40000.00, 4);

-- Insert sample employees
INSERT INTO employee (first_name, last_name, roles_id, manager_id) VALUES
  ('John', 'Doe', 1, NULL),
  ('Jane', 'Smith', 2, NULL),
  ('Mike', 'Johnson', 3, 5),
  ('Sarah', 'Williams', 4, 5),
  ('David', 'Brown', 5, NULL),
  ('Emily', 'Davis', 6, 6);
