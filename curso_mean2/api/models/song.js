'use strict'


var mongoose = require("mongoose");
var schema = mongoose.Schema; // definir un esquema de BBDD. permitir  u nobjeto de tipo esquema para almacenar datos.


var songSchema = schema({
  number: String,
  name: String,
  duration: String,
  file: String,
  album: {type: schema.ObjectId,ref: "Album"}//referencia a otra entidad
});
module.exports = mongoose.model("Song",songSchema);
