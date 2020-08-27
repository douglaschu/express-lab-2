const { Pool, Client } = require("pg");
const credentials = new Pool({
user: "postgres",
password: "postgres",
host: "localhost", 
port: 5432, 
database: "ExpressShopDB", 
ssl: false
});

module.exports = credentials;