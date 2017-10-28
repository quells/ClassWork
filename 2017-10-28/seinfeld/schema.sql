create database seinfeld_db;
use seinfeld_db;

create table actors (
	id integer(11) auto_increment primary key,
	actor_name varchar(100) not null,
	character_name varchar(100) not null,
	coolness_points integer(11) not null default 0,
	attitude varchar(50) not null
);

insert into actors
(actor_name, character_name, coolness_points, attitude)
values
("Jerry Seinfeld", "Jerry Seinfeld", 60, "Jaded"),
("Julia Louis-Dreyfus", "Elaine Benes", 70, "Jaded"),
("Jason Alexander", "George Costanza", 20, "Lazy"),
("Michael Richards", "Cosmo Kramer", 50, "Crazy"),
("Larry Thomas", "Soup Nazi", 40, "Angry");
