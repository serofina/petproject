DROP DATABASE IF EXISTS pets_db;

CREATE DATABASE pets_db;

USE pets_db;

CREATE TABLE customers (
	id INT AUTO_INCREMENT PRIMARY KEY,
	full_name VARCHAR(255) NOT NULL,
	email_address VARCHAR(255) NOT NULL,
	PASSWORD VARCHAR(255) NOT NULL
);

CREATE TABLE newsletter (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
	email VARCHAR(255) NOT NULL
);

CREATE TABLE pets (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
	dob VARCHAR(255) NOT NULL,
	pet_photo VARCHAR(255) NOT NULL,
	personality VARCHAR(255),
	breed VARCHAR(255) NOT NULL,
	secondary_breed VARCHAR(255),
	rabies_start_date DATE NOT NULL,
	rabies_end_date DATE NOT NULL,
	rabies_pdf VARCHAR(255),
	distemper_start_date DATE NOT NULL,
	distemper_end_date DATE NOT NULL,
	distemper_pdf VARCHAR(255),
	parvo_start_date DATE NOT NULL,
	parvo_end_date DATE NOT NULL,
	parvo_pdf VARCHAR(255),
	microchip VARCHAR(255) NOT NULL,
	notes VARCHAR(255)
);