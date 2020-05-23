'use strict'

var mongoose = require('mongoose');
var app = require("./app")
var port = process.env.PORT || 3977; //servidor del backend de node

mongoose.Promise = global.Promise; //apagar texto de mongoose



// mongoDB corre en el puerto 27017, la base de dato see llama curse_node_angular2
mongoose.connect('mongodb://localhost:27017/curse_node_angular2',(err,res)=>{


  if(err){ //si hay error lanzar la excepcion err, de lo contrario imprimir mensaje.
    throw err;
  }
  else{
    console.log("La conexión al a base de datos esa corriendo correctamente.")

    app.listen(port,function(){
      console.log("servidr del API rest escuchando en http//:localhost:"+port)
    })
  }

});
