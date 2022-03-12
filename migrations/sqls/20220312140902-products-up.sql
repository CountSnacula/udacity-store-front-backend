CREATE TABLE IF NOT EXISTS products
(
    id          SERIAL  NOT NULL,
    name        VARCHAR NOT NULL,
    price       DECIMAL NOT NULL,
    category varchar,
    PRIMARY KEY (id)
);
