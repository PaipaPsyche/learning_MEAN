'use strict'


var mongoose = require("mongoose");
var schema = mongoose.Schema; // definir un esquema de BBDD. permitir  u nobjeto de tipo esquema para almacenar datos.


var artistSchema = schema({
  name: String,
  description: String,
  image: String
});
module.exports = mongoose.model("Artist",artistSchema);
