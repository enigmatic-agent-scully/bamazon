drop database if exists bamazon;

CREATE DATABASE bamazon;

use bamazon;

CREATE TABLE products (
  id integer not null auto_increment,
  itemname varchar(100) not null,
  dept varchar(100) not null,
  price decimal(10,2) not null,
  quant int not null,
  primary key (id)
);



