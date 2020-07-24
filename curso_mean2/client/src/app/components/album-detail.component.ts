import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Artist } from '../models/artist';
import { Album } from '../models/album';
import { Song } from '../models/song';
import{ AlbumService } from '../services/album.service';
import{ UserService } from '../services/user.service';
import{ SongService } from '../services/song.service';
import { GLOBAL } from '../services/global';


@Component({
  selector: 'album-detail',
  templateUrl : '../views/album-detail.html',
  providers :  [UserService, AlbumService,SongService]
})


export class AlbumDetailComponent implements OnInit{

  public album : Album;
  public songs : Song[];
  public identity;
  public token;
  public url: string;
  public alertMessage;
  public confirmado;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _albumService: AlbumService,
    private _songService: SongService,

  ){

    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.confirmado = null;
    //this.album = new Album('','',0,'','');
  }

  ngOnInit(){
    console.log("album-detail.component cargado");
    //acar album
    this.getAlbum();
  }
  getAlbum(){
    this._route.params.forEach((params : Params) => {
      let id = params['id'];

      this._albumService.getAlbum(this.token,id).subscribe(
        response => {
          if(!response.album){
            this._router.navigate(['/']);
          }else{
            this.album = response.album;


            //sacar los albums
            this._songService.getSongs(this.token,response.album._id).subscribe(
              response => {

                if(!response.songs){
                  this.alertMessage = "Este album no tiene caonciones";
                }else{
                  this.songs = response.songs;
                }
              },
              error => {
                var error = <any> error;

                if(error!=null){
                  var body = JSON.parse(error._body);
                  this.alertMessage = body.message;
                  console.log(error);
                }
              }
            );
          }

        },
        error => {
          var error = <any> error;

          if(error!=null){
            var body = JSON.parse(error._body);
            this.alertMessage = body.message;
            console.log(error);
          }
        }
      );
    });
  }

  onDeleteConfirm(id){
    this.confirmado = id;
  }
  onDeleteCancel(){
    this.confirmado=null;
  }
  onDeleteSong(id){
    this._songService.deleteSong(this.token,id).subscribe(
      response =>{
        if(!response.song){
          this.alertMessage = "Error en el servidor";
        }
        this.getAlbum()
      },
      error =>{
        var error = <any> error;

        if(error!=null){
          var body = JSON.parse(error._body);
          this.alertMessage = body.message;
          console.log(error);
        }
      }
    );
  }
  startPlayer(song){
    let songplayer = JSON.stringify(song);
    let file_path = this.url + "get-song-file/" + song.file;

    let image_path  = this.url + "get-image-album/"+song.album.image;
    console.log(file_path,songplayer,image_path)
    localStorage.setItem('sound_song',songplayer);
    document.getElementById("mp3-source").setAttribute("src",file_path);
    let docp = (document.getElementById("player-player") as any);
    docp.load();
    let docpp = (document.getElementById("player-player") as any);
    docpp.play();

  }
}
