INSERT INTO users(firstname, lastname, password, username)
VALUES ('firstName', 'lastName', '$2b$10$l6A.r.Sn1qJ9G9lkwRoNH.w8.WJU9CUQ36Rlmi.baLLMxfujpY666', 'username');

INSERT INTO products(name, price, category)
VALUES ('name', 50.05, 'category');

INSERT INTO orders(user_id, status) VALUES (1, 'active');
INSERT INTO product_orders(product_id, order_id, quantity) VALUES (1, 1, 50);
