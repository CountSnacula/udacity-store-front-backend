CREATE TABLE IF NOT EXISTS users
(
    id        SERIAL,
    firstName VARCHAR,
    lastName  VARCHAR,
    password  VARCHAR NOT NULL,
    username  VARCHAR NOT NULL,
    PRIMARY KEY (id)
);
