'use strict'

var mongoose = require("mongoose");
var schema = mongoose.Schema; // definir un esquema de BBDD. permitir  u nobjeto de tipo esquema para almacenar datos.


var userSchema = schema({
  name: String,
  surname: String,
  email: String,
  password: String,
  image: String,
  role: String
});

module.exports = mongoose.model("User",userSchema);
