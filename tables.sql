CREATE TABLE cakes (
    id serial PRIMARY KEY,
    name varchar NOT NULL CHECK (length(name) >= 2),
    price integer NOT NULL CHECK (price > 0),
    image varchar,
    description text
)

CREATE TABLE clients (
    id serial PRIMARY KEY,
    name varchar NOT NULL,
    address varchar NOT NULL,
    phone varchar(11) NOT NULL CHECK (phone ~ '^[0-9]{10,11}$')
)

CREATE TABLE orders (
    id serial PRIMARY KEY,
    "clientId" integer REFERENCES clients(id),
    "cakeId" integer REFERENCES cakes(id),
    quantity integer CHECK (quantity > 0 AND quantity < 5),
    "createdAt" timestamp DEFAULT NOW(),
    "totalPrice" integer
)