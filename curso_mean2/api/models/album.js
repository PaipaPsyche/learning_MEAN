'use strict'


var mongoose = require("mongoose");
var schema = mongoose.Schema; // definir un esquema de BBDD. permitir  u nobjeto de tipo esquema para almacenar datos.


var albumSchema = schema({
  title: String,
  description: String,
  year:Number,
  image: String,
  artist: {type: schema.ObjectId,ref: "Artist"}//referencia a otra entidad
});
module.exports = mongoose.model("Album",albumSchema);
