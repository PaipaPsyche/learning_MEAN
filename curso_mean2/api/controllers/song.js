'use strict'

var path = require("path");
var fs = require("fs");
var mongoosePaginate = require("mongoose-pagination")

var Artist = require("../models/artist")
var Album = require("../models/album")
var Song = require("../models/song")








function saveSong(req,res){
  var song = new Song();
  var params = req.body;

  song.number = params.number;
  song.name = params.name;
  song.duration = params.duration;
  song.album = params.album;
  song.file = null;



song.save((err,songStored) =>{
    if(err){
      res.status(500).send({message: "Error en la petición"})
    }else {
      if(!songStored){
        res.status(404).send({message: "No se ha guardado la canción"})
      }else {
        res.status(200).send({song:songStored})
      }
    }
  });

}

function getSong(req,res){
  var songId = req.params.id;

  Song.findById(songId).populate({path : "album"}).exec((err,song)=>{
    if(err){
      res.status(500).send({message: "Error en la petición"})
    }else {
      if(!song){
        res.status(404).send({message: "No existe la canción"})
      }else {
        res.status(200).send({song})
      }
    }
  }) ;
  //el path es la propiedad donde se van acargar los datos del objeto asociado


}



function getSongs(req,res){
  var albumId = req.params.album;

  if(!albumId){
    //sacar todos las canciones de la BBDD
    var find = Song.find({}).sort("name");
  }else {
    //sacar los albums de ese artista
    var find = Song.find({album : albumId}).sort("number");
  }

  find.populate({
    path:"album",
    populate: {
      path: "artist",
      model: 'Artist'
    }
  }).exec((err,songs)=>{
    if(err){
      res.status(500).send({message: "Error en la petición"})
    }else {
      if(!songs){
        res.status(404).send({message: "No existen canciones"})
      }else {
        res.status(200).send({songs});
      }
    }
  });
}



function updateSong(req,res){
  var songId = req.params.id;
  var update = req.body;

  Song.findByIdAndUpdate(songId,update,(err,songUpdated)=>{
    if(err){
      res.status(500).send({message: "Error en la petición"});
    }else {
      if(!songUpdated){
        res.status(404).send({message: "No existe la cancion"});
      }else {
        res.status(200).send({song : songUpdated});
      }
    }
  });

}

function deleteSong(req,res){
  var songId = req.params.id;
  Song.findByIdAndRemove(songId,(err,songRemoved)=>{
    if(err){
      res.status(500).send({message:"Error al eliminar la cancion."})
    }else{
      if(!songRemoved){
        res.status(404).send({message:"La canción no ha sido eliminada."})
      }else{
        res.status(200).send({song:songRemoved});
      }
    }
  });


}


function uploadFile(req,res){
  var songId = req.params.id;
  var file_name = "No subido"

  if(req.files){
    var file_path = req.files.file.path;

    var file_split = file_path.split('/');
    var file_name = file_split[2];

    var name_split = file_name.split(".");
    var file_ext = name_split[1];


    if(file_ext == 'mp3' || file_ext == 'ogg'){
      Song.findByIdAndUpdate(songId,{file:file_name},(err,songUpdated) => {
        if(err){
          res.status(500).send({message:"Error al actualizar la cancion"})
        }else{
          if(!songUpdated){
            res.status(404).send({message:"No se ha podido actualizar la cancion"})
          }else{
            res.status(200).send({song:songUpdated})
          }

        }
      })
    }else{
      res.status(200).send({message: "Extensión del archivo invalida."})
    }

  }else{
    res.status(200).send({message: "No has subido ningun archivo"})
  }

}


function getSongFile(req,res){
  var file = req.params.songFile;
  var path_file = './uploads/songs/'+file

  fs.exists(path_file,function(exists){
    if(exists){
      res.sendFile(path.resolve(path_file));
    }else{
      res.status(200).send({message: "No existe el audio"})
    }
  })
}


module.exports = {

  getSong,
  saveSong,
  getSongs,
  updateSong,
  deleteSong,
  uploadFile,
  getSongFile

}
