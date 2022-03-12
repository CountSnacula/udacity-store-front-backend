CREATE TABLE IF NOT EXISTS orders
(
    id      SERIAL  NOT NULL,
    user_id BIGINT  NOT NULL,
    status  VARCHAR NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS product_orders
(
    product_id BIGINT NOT NULL,
    order_id BIGINT not null,
    quantity INTEGER,
    PRIMARY KEY (product_id, order_id),
    CONSTRAINT fk_product_orders_product FOREIGN KEY (product_id) REFERENCES products (id),
    CONSTRAINT fk_product_orders_user FOREIGN KEY (product_id) REFERENCES products (id)
);
