CREATE TABLE cakes (
    id serial PRIMARY KEY,
    name varchar,
    price integer,
    image varchar,
    description text
)

CREATE TABLE clients (
    id serial PRIMARY KEY,
    name varchar,
    address varchar,
    phone varchar
)

CREATE TABLE orders (
    id serial PRIMARY KEY,
    clientId integer REFERENCES clients(id),
    cakeId integer REFERENCES cakes(id),
    quantity integer,
    createdAt timestamp DEFAULT NOW(),
    totalPrice integer
)