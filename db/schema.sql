DROP DATABASE IF EXISTS pets_db;

CREATE DATABASE pets_db;

-- Display customer information
USE pets_db;
select * from customerinfo ci
inner join users u on ci.iduser= u.iduser;

use pets_db;
select * from users;

use pets_db;
select * from booking;

use pets_db;
select * from booking where user_id=225 order by confirmation_time desc limit 1;

CREATE TABLE customerinfo (
  id INT NOT NULL AUTO_INCREMENT,
  iduser VARCHAR(40) DEFAULT NULL,
  firstName VARCHAR(40) DEFAULT NULL,
  lastName VARCHAR(40) DEFAULT NULL,
  phone VARCHAR(12) DEFAULT NULL,
  address VARCHAR(45) DEFAULT NULL,
  address2 VARCHAR(45) DEFAULT NULL,
  city VARCHAR(45) DEFAULT NULL,
  state VARCHAR(45) DEFAULT NULL,
  zip INT DEFAULT NULL,
  emergencyContact VARCHAR(45) DEFAULT NULL,
  emergencyPhone VARCHAR(45) DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY userid_UNIQUE (iduser)
) ENGINE=InnoDB AUTO_INCREMENT=81 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE login (
  id INT NOT NULL AUTO_INCREMENT,
  hash VARCHAR(100) DEFAULT NULL,
  iduser INT DEFAULT NULL,
  PRIMARY KEY (id),
  KEY email_idx (iduser),
  CONSTRAINT iduser FOREIGN KEY (iduser) REFERENCES users (iduser)
) ENGINE=InnoDB AUTO_INCREMENT=109 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE newsletter (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(40) NOT NULL,
  email VARCHAR(40) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE users (
  iduser INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(45) NOT NULL,
  email VARCHAR(45) NOT NULL,
  PRIMARY KEY (iduser),
  UNIQUE KEY email_UNIQUE (email)
) ENGINE=InnoDB AUTO_INCREMENT=222 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DELIMITER $$
CREATE DEFINER=root@localhost PROCEDURE addUser(userName VARCHAR(45), email VARCHAR(45), hash VARCHAR(100))
BEGIN
	DECLARE _rollback BOOL DEFAULT 0;
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET _rollback = 1;
	start transaction;
		INSERT INTO users (name, email) VALUES (userName, email);
        SET @userid = (SELECT iduser FROM users WHERE userName = users.name);
		INSERT INTO login (hash,iduser) VALUES (hash, @userid); 
        INSERT INTO customerinfo (iduser) VALUES (@userid);
    IF _rollback THEN
        ROLLBACK;
        SELECT 'fail';
    ELSE
        COMMIT;
        SELECT * FROM users where users.name = userName;
    END IF;
END$$
DELIMITER ;

use pets_db;
select * from pets;


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
  userId INT NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(iduser)
);

use pets_db;
create table if not exists booking_type (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name varchar(50) not null
);

use pets_db;
insert into booking_type (name) values ('Daycare'),('Boarding'),('Booking');
use pets_db;
select * from booking_type;
select id from booking_type where name='Daycare';

use pets_db;
create table if not exists booking (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  date date not null,
  time time not null,
  type int not null REFERENCES booking_type(id),
  user_id int not null REFERENCES user(id)
);
use pets_db;

-- Display Bookings
use pets_db;
select * from booking b
inner join users u 
on b.user_id = u.iduser;

alter table booking
add column confirmation_time timestamp not null default now();


        INSERT INTO pets (`iduser`) VALUES (@userid);

-- Seed --
INSERT INTO `pets` (`id`, `name`, `dob`, `pet_photo`, `personality`, `breed`, `secondary_breed`, `rabies_start_date`, `rabies_end_date`, `rabies_pdf`, `distemper_start_date`, `distemper_end_date`, `distemper_pdf`, `parvo_start_date`, `parvo_end_date`, `parvo_pdf`, `microchip`, `notes`) VALUES
(1, 'Lucy', '2022-08-25', 'https://res.cloudinary.com/memescloud/image/upload/v1661056590/ffvwehvuoskfufe5xro4.png', 'Psyco', 'Airedale Terrier', 'Am. Staffordshire Terrier', '2022-08-26', '2022-08-25', 'https://res.cloudinary.com/memescloud/image/upload/v1661056591/ercb4lu7egiugp2al1j9.png', '2022-09-02', '2022-08-26', 'https://res.cloudinary.com/memescloud/image/upload/v1661056591/lhv1zfeocurgrkk4drhu.png', '2022-08-26', '2022-09-01', 'https://res.cloudinary.com/memescloud/image/upload/v1661056592/yxejzfotcjkwl1qcsjxj.png', '23', '4');