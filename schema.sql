-- DROP DATABASE IF EXISTS companyDB;
CREATE database companyDB;

USE companyDB;





CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name TEXT
  
);

CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title TEXT,
  salary DECIMAL(10, 4),
  department_id INT,
  FOREIGN KEY (department_id) REFERENCES department(id)
  
);


CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  role_id INT,
  manager_id INT,
  FOREIGN KEY (manager_id) REFERENCES employee(id),
  FOREIGN KEY (role_id) REFERENCES role(id)
  
);
