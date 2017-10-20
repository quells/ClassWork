create table if not exists top_song (
	id int not null auto_increment primary key,
	artist varchar(100) not null,
	song varchar(100) not null,
	year_released smallint unsigned not null,
	raw_popularity decimal(10,4),
	usa_popularity decimal(10,4),
	uk_popularity decimal(10,4),
	europe_popularity decimal(10,4),
	other_popularity decimal(10,4)
);

alter table top_songs modify other_popularity decimal(10,4);

insert into top_songs values
(1,'Bing Crosby','White Christmas',1942,39.903,23.929,5.7,2.185,0.54),
(2,'Bill Haley & his Comets','Rock Around the Clock',1955,36.503,19.961,7.458,5.663,0.76);

delete from top_songs where 1=1;

select count(1) as count from top_songs;

-- group by... was throwing an error
SET sql_mode = '';

-- all songs by specific artist
select * from top_songs where `artist` = 'Madonna' order by raw_popularity desc;

-- all artists with more than 1 song
select t1.artist, t2.c from top_songs t1
join (
	select id, count(*) as c from top_songs
	group by artist
	having count(*) > 1
) t2
on t1.id = t2.id
order by c desc;

-- data constrained by a range (only from 1960s)
select * from top_songs where `year_released` >= 1960 and `year_released` < 1970;

-- specific song
select * from top_songs where `song` = 'All You Need is Love';
select * from top_songs where `id` = 5;

-- by total popularity (sales?)
select id, artist,
sum(raw_popularity) as total_popularity
from top_songs
group by artist
order by total_popularity desc;
