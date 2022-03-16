# Storefront Backend Project

## Instructions

### env

The following env vars need to be present in the .env-file, as an example see the file `.example-env`.

| Variable          | Description                                                     | Required value |
|-------------------|-----------------------------------------------------------------|----------------|
| POSTGRES_PASSWORD | The password to connect to postgres                             | postgres       |
| POSTGRES_USER     | The user to connect to postgres                                 | postgres       |
| POSTGRES_DB       | the database used by the project                                | store_front    |
| POSTGRES_HOST     | The host where postgres is running                              | --             |
| BCRYPT_PASSWORD   | The pepper used for encrypting user passwords                   | --             |
| SALT_ROUNDS       | the number of round used for hashing the user passwords         | --             |
| JWT_SECRET        | the secret used to signe the jwt token after a successful login | --             |

### Database

This project uses PostgresQL as it's database and requires a running server to connect to.

#### Docker

##### Installation

Download and install [Docker](https://docs.docker.com/get-docker/) and verify that you can start containers and that
docker-compose is installed.

##### Setup

Simply run `docker-compose up -d`. This will start a PostgresQL container and automatically configures a user, password
and the database used by the app.  
For this to function properly you have to add the following options to the `.env` file

| Parameter name    | Description                                     | Required value |
|-------------------|-------------------------------------------------|----------------|
| POSTGRES_USER     | the user to connect to the database             | postgres       |
| POSTGRES_PASSWORD | the password to connect to the database         | postgres       |
| POSTGRES_DB       | the database used by the storefront application | store_front    |

The resumption container will publish the default postgres port 5432.

##### Connection

To connect against the docker container use any DB-Tool you like and use `127.0.0.1` as the host and `5432` as the port.
The user, password and database will be the values of the configuration mentioned above.

#### Bare metal

#### Installation

Download the [installer](https://www.postgresql.org/) for your system and follow the steps shown or mentioned on the
postgres home page.

##### Setup

Connect to the running PostgresQL server with the user and password you used to install the server.  
Execute the following commands to set up the correct user/password and database:

```sql
CREATE USER postgres WITH PASSWORD 'postgres';
CREATE DATABASE store_front;
GRANT ALL PRIVILEGES ON DATABASE store_front TO postgres;
```

##### Connection

After the user and database is created you can connect to the database using the information.  
For the initial connection you have to use the credential you used in the installation steps.

##### Connect to DB

The Container will be started and excepts connection on port __5432__
To connect to the postgres container following environment variables are important:

### Server

#### Pre Requirement

- Running postgres instance
- valid .env file

To start a postgres instance for this project run `docker-compose up -d` from the root directory in the project.

#### Installing dependencies

Run `npm install` from the root directory of the project to install all necessary dependencies used.

#### Migration

Run `npm run migrate` to initialize the postgres server with the necessary tables. This command will also insert testing
data.

Storefront user which will be created:  
Username: `username`  
Password: `password`

### Build

Building the project use `npm run build` in the project root. The resulting js files will be located in the
folder `dist`

#### tests

To run the test execute following command `npm run test`. For this to run you do not need to have configured anything
prior, as the test do not require any actual database connection. All queries have been mocked.

##### stating

To start the service either:

* build the project useing `npm run build` and run `node build/index.js`
* run the source code directly
  * using `npm run start`
  * or `npm run watch`

Regardless of the option used the server will be started on your local machine on port 3000.

##### Requests

All request provided for this server is listed below.  
An example [Insomnia](https://insomnia.rest/) collection has been provided and can be found in the file `store-front-insomnia.json`.  
An example HTTP Archive file containing the same collection as for insomnia has been provided and can be found in `store-front-insomnia.har`

###### login

Methode: POST URL: `localhost:3000/login`
Body:

```json
{
  "username": "username",
  "password": "password"
}
```

example:

```bash
curl --request POST \
  --url http://localhost:3000/login \
  --header 'Content-Type: application/json' \
  --data '{
	"username": "username",
	"password": "password"
}'
```

###### Get all products

Methode: GET URL: `localhost:3000/products`
example:

```bash
curl --request GET \
  --url http://localhost:3000/products
```

###### Get single product

Methode: GET URL: `localhost:3000/products/:id`
example:

```bash
curl --request GET \
  --url http://localhost:3000/products/1
```

###### create product

Methode: POST URL: `localhost:3000/products`
Body:

```json
{
  "category": "category",
  "price": 50,
  "name": "name"
}
```

Headers: `Authorization: Bearer: authoken from login response`
example:

```bash
curl --request POST \
  --url http://localhost:3000/products \
  --header 'Authorization: Bearer: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjozLCJmaXJzdG5hbWUiOiJmaXJzdE5hbWUiLCJsYXN0bmFtZSI6Imxhc3ROYW1lIiwidXNlcm5hbWUiOiJ1c2VybmFtZSJ9LCJpYXQiOjE2NDcyNzcwOTZ9.5W1QIy5E7krNDg8djDt3tMSkjE7PZIX8t51zPjgSR-c' \
  --header 'Content-Type: application/json' \
  --data '{
		"category": "category",
		"price": 50,
		"name": "name"
}'
```

###### Get all users

Methode: GET URL: `localhost:3000/users`
Headers: `Authorization: Bearer: authoken from login response`
example:

```bash
curl --request GET \
  --url http://localhost:3000/users \
  --header 'Authorization: Bearer: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjozLCJmaXJzdG5hbWUiOiJmaXJzdE5hbWUiLCJsYXN0bmFtZSI6Imxhc3ROYW1lIiwidXNlcm5hbWUiOiJ1c2VybmFtZSJ9LCJpYXQiOjE2NDcyNzcwOTZ9.5W1QIy5E7krNDg8djDt3tMSkjE7PZIX8t51zPjgSR-c'
```

###### Get single user

Methode: GET URL: `localhost:3000/users/:id`
Headers: `Authorization: Bearer: authoken from login response`
example:

```bash
curl --request GET \
  --url http://localhost:3000/users/1 \
  --header 'Authorization: Bearer: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjozLCJmaXJzdG5hbWUiOiJmaXJzdE5hbWUiLCJsYXN0bmFtZSI6Imxhc3ROYW1lIiwidXNlcm5hbWUiOiJ1c2VybmFtZSJ9LCJpYXQiOjE2NDcyNzcwOTZ9.5W1QIy5E7krNDg8djDt3tMSkjE7PZIX8t51zPjgSR-c'
```

###### create user

Methode: POST URL: `localhost:3000/users`
Headers: `Authorization: Bearer: authoken from login response`
Body:

```json
{
  "firstName": "firstName",
  "lastName": "lastName",
  "username": "username",
  "password": "password"
}
```

example:

```bash
curl --request POST \
  --url http://localhost:3000/users \
  --header 'Authorization: Bearer: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjozLCJmaXJzdG5hbWUiOiJmaXJzdE5hbWUiLCJsYXN0bmFtZSI6Imxhc3ROYW1lIiwidXNlcm5hbWUiOiJ1c2VybmFtZSJ9LCJpYXQiOjE2NDcyNzcwOTZ9.5W1QIy5E7krNDg8djDt3tMSkjE7PZIX8t51zPjgSR-c' \
  --header 'Content-Type: application/json' \
  --data '{
	"firstName": "firstName",
	"lastName": "lastName",
	"username": "username",
	"password": "password"
}'
```

###### get active order

Methode: GET URL: `localhost:3000/users/1/orders/active`
Headers: `Authorization: Bearer: authoken from login response`
example:

```bash
curl --request GET \
  --url http://localhost:3000/users/1/orders/active \
  --header 'Authorization: Bearer: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjozLCJmaXJzdG5hbWUiOiJmaXJzdE5hbWUiLCJsYXN0bmFtZSI6Imxhc3ROYW1lIiwidXNlcm5hbWUiOiJ1c2VybmFtZSJ9LCJpYXQiOjE2NDcyNzcwOTZ9.5W1QIy5E7krNDg8djDt3tMSkjE7PZIX8t51zPjgSR-c'
```

###### complete active order

Methode: PUT URL: `localhost:3000/users/1/orders/1`
Headers: `Authorization: Bearer: authoken from login response`
example:

```bash
curl --request PUT \
  --url http://localhost:3000/users/1/orders/1 \
  --header 'Authorization: Bearer: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjozLCJmaXJzdG5hbWUiOiJmaXJzdE5hbWUiLCJsYXN0bmFtZSI6Imxhc3ROYW1lIiwidXNlcm5hbWUiOiJ1c2VybmFtZSJ9LCJpYXQiOjE2NDcyNzcwOTZ9.5W1QIy5E7krNDg8djDt3tMSkjE7PZIX8t51zPjgSR-c'
```

###### create new order

Methode: POST URL: `localhost:3000/users/1/orders`
Headers: `Authorization: Bearer: authoken from login response`
Body:

```json
{
  "products": [
    {
      "productId": 1,
      "quantity": 5
    }
  ],
  "status": "active"
}
```

example:

```bash
curl --request POST \
  --url http://localhost:3000/users/1/orders \
  --header 'Authorization: Bearer: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjozLCJmaXJzdG5hbWUiOiJmaXJzdE5hbWUiLCJsYXN0bmFtZSI6Imxhc3ROYW1lIiwidXNlcm5hbWUiOiJ1c2VybmFtZSJ9LCJpYXQiOjE2NDcyNzcwOTZ9.5W1QIy5E7krNDg8djDt3tMSkjE7PZIX8t51zPjgSR-c' \
  --header 'Content-Type: application/json' \
  --data '{
	"products": [
		{
			"productId": 1,
			"quantity": 5
		}
	],
	"status": "active"
}'
```

___________________

## Required Technologies

Your application must make use of the following libraries:

- Postgres for the database
- Node/Express for the application logic
- dotenv from npm for managing environment variables
- db-migrate from npm for migrations
- jsonwebtoken from npm for working with JWTs
- jasmine from npm for testing

## Steps to Completion

### 1. Plan to Meet Requirements

In this repo there is a `REQUIREMENTS.md` document which outlines what this API needs to supply for the frontend, as
well as the agreed upon data shapes to be passed between front and backend. This is much like a document you might come
across in real life when building or extending an API.

Your first task is to read the requirements and update the document with the following:

- Determine the RESTful route for each endpoint listed. Add the RESTful route and HTTP verb to the document so that the
  frontend developer can begin to build their fetch requests.    
  **Example**: A SHOW route: 'blogs/:id' [GET]

- Design the Postgres database tables based off the data shape requirements. Add to the requirements document the
  database tables and columns being sure to mark foreign keys.   
  **Example**: You can format this however you like but these types of information should be provided Table: Books (id:
  varchar, title:varchar, author:varchar, published_year:varchar, publisher_id:string[foreign key to publishers table],
  pages:number)

**NOTE** It is important to remember that there might not be a one to one ratio between data shapes and database tables.
Data shapes only outline the structure of objects being passed between frontend and API, the database may need multiple
tables to store a single shape.

### 2. DB Creation and Migrations

Now that you have the structure of the databse outlined, it is time to create the database and migrations. Add the npm
packages dotenv and db-migrate that we used in the course and setup your Postgres database. If you get stuck, you can
always revisit the database lesson for a reminder.

You must also ensure that any sensitive information is hashed with bcrypt. If any passwords are found in plain text in
your application it will not pass.

### 3. Models

Create the models for each database table. The methods in each model should map to the endpoints in `REQUIREMENTS.md`.
Remember that these models should all have test suites and mocks.

### 4. Express Handlers

Set up the Express handlers to route incoming requests to the correct model method. Make sure that the endpoints you
create match up with the enpoints listed in `REQUIREMENTS.md`. Endpoints must have tests and be CORS enabled.

### 5. JWTs

Add JWT functionality as shown in the course. Make sure that JWTs are required for the routes listed
in `REQUIUREMENTS.md`.

### 6. QA and `README.md`

Before submitting, make sure that your project is complete with a `README.md`. Your `README.md` must include
instructions for setting up and running your project including how you setup, run, and connect to your database.

Before submitting your project, spin it up and test each endpoint. If each one responds with data that matches the data
shapes from the `REQUIREMENTS.md`, it is ready for submission!
