'use strict';

console.log(`
3.
---

We need to create a route that downloads the entire database to a .csv file.
The endpoint must be set to: GET /users

Make sure to have an instance of MongoDB running at: mongodb://localhost

Run the database seed with:
$ node utils/seed.js

-> Warning: It contains hundreds of entities and our production server is quite small
`);

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
//const { AsyncParser } = require('json2csv');
const { parseAsync } = require('json2csv');

// Setup database
mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/mediastream-challenge');
const User = require('./models/User');

// Setup Express.js app
const app = express();

// TODO
app.get("/users", (req, res) => {
  User.find().exec((err, users) => {
    if (err) {
      return res.status(400).json(err)
    }

    const fields = [ 'name', 'email']
    const opts = { fields };

    parseAsync(users, opts)
      .then(csv => {
        res.set('Content-Type', 'text/csv');
        res.status(200).send(csv);
      })
      .catch(err => res.status(400).json({
        ok: false,
        message: "Download failed!"
      }));
  });
});

app.listen(3000);