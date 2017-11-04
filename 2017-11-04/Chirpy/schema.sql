create database chirpy;
use chirpy;

drop table if exists chirpers;
create table chirpers (
	id integer(11) auto_increment not null primary key,
	username varchar(50) not null,
	real_name varchar(100) not null
);

drop table if exists chirps;
create table chirps (
	id integer(11) auto_increment not null primary key,
	author_id integer(11) not null,
	chirp varchar(140) not null,
	created_at timestamp not null,
	foreign key (author_id) references chirpers(id)
);
