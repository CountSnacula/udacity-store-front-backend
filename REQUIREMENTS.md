# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### Products
- Index `/products [GET]`
- Show `/products/{id} [GET]`
- Create [token required] `/products [POST]`
- [OPTIONAL] Top 5 most popular products `/products?limit=5&sort_by=popularity [GET]`
- [OPTIONAL] Products by category (args: product category)  `/products&limit=5&offset=0&category={category} [POST]`

#### Users
- Index [token required] `/users [GET]`
- Show [token required] `/users/{id} [GET]`
- Create [token required] `/users [POST]`

#### Orders
- Current Order by user (args: user id)[token required] `/user/{id}/orders [GET]`
- [OPTIONAL] Completed Orders by user (args: user id)[token required] `/user/{userId}/orders/:orderId [PUT]`
- [self made] create order for a user (args: user id)[token required] `/user/{userId}/orders [POST]`

## Data Shapes
#### Product
- id
- name
- price
- [OPTIONAL] category

```
Product (id:serial[primary key], name:text, price:decimal, category:bigint[foreign key to category table])
Category (id:serial[primary key], name:text)
```

#### User
- id
- firstName
- lastName
- password
- username

```
User (id: serial[primary key], firstname:text, lastname:text, password:text[not null], username:[not null])
```

#### Orders
- id
- id of each product in the order
- quantity of each product in the order
- user_id
- status of order (active or complete)

```
Order (id:serial[primary key], user_id:bigint[foreign key tp user table)
Product_Order (produc_id:bigint[foreign key to product table], order_id:bitint[foreign key to order table], quantity:integer)
```
