'use strict'

var express  = require("express")
var bodyParser = require("body-parser")
var app =  express();


var user_routes = require("./routes/user")
var artist_routes = require("./routes/artist")
var album_routes = require("./routes/album")
var song_routes = require("./routes/song")
// cargar rutas

// es necesario para que funcione bodyparser
app.use(bodyParser.urlencoded({extended:false}))
//para que bodyparser convierta a json
app.use(bodyParser.json())


//configurar cabeceras http

app.use((req,res,next)=>{
    res.header('Access-Control-Allow_Origin','*');
    res.header('Access-Control-Allow_Headers','Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept,Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow_Methods','GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow' , 'GET, POST, OPTIONS, PUT, DELETE');

    next();
});

//rutas base
app.use("/api",user_routes)
app.use("/api",artist_routes)
app.use("/api",album_routes)
app.use("/api",song_routes)

module.exports=app;
//se puede usar express en otros ficheros que tengan "app"
