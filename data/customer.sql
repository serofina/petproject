use pets_db;

-- Creates the table on our database, only needs to be run once.
-- Statement begin
create table customer (
    id int primary key auto_increment,
    first_name varchar(25) not null,
    last_name varchar(50) not null,
    email varchar(50) not null,
    phone varchar(10) not null,
    address1 varchar(50) not null,
    address2 varchar(50),
    city varchar(25) not null,
    address_state varchar(2) not null,
    zip varchar(5) not null,
    emergency_contact varchar(30) not null,
    emergency_phone varchar(10) not null
);
-- Statement ends


use pets_db;
-- Adds a single customer to the database
-- Statement begin
insert into customer 
(
    first_name,
    last_name,
    email,
    phone,
    address1,
    address2,
    city,
    address_state,
    zip,
    emergency_contact,
    emergency_phone
)
values 
(
    'Alex',
    'Farrell',
    'a@a.com',
    '9999999999',
    '123 main road',
    'apt 3',
    'gotham',
    'ca',
    '12345',
    'Joe Dirt',
    '1234567890'
);
-- Statement end

use pets_db;
-- Gets all the customer data from our database
select * from customer;

-- ,
    --