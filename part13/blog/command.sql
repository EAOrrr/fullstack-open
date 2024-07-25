CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author TEXT,
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    likes INT DEFAULT 0
);

insert into blogs (author, title, url) values ('Dan Abramov', 'On let vs const', 'https://overreacted.io/on-let-vs-const/');
insert into blogs (author, title, url) values ('Laurenz Albe', 'Gaps in sequences in PostgreSQL', 'https://www.cybertec-postgresql.com/en/gaps-in-sequences-postgresql/');