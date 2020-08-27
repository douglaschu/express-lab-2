'use strict';
// require the Express module
const express = require("express");
// creates an instance of an Express server 
const app = express();
//const routes = require("./pg-connection-pool");
const routes = require('./routes');
// define the port  
const port = 3000;
const cors = require('cors');
app.use(express.json()) //allows for body parsing
//app.use(express.urlencoded({ extended: false })); 
  //for handling form submissions? idk I got it from a youtube tutorial
app.use(cors());
app.use('/', routes);

app.get('*',(req, res) => {
  res.status(201);
  res.json('yes, the server is running')
})



// run the server
app.listen(port, () => console.log(`Listening on port: ${port}.`));

