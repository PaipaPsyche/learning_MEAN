import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Artist } from '../models/artist';
import { Album } from '../models/album';
import { Song } from '../models/song';
import{ UserService } from '../services/user.service';
//import{ ArtistService } from '../services/artist.service';
import{ AlbumService } from '../services/album.service';
import{ SongService } from '../services/song.service';
import { GLOBAL } from '../services/global';


@Component({
  selector: 'song-add',
  templateUrl : '../views/song-add.html',
  providers :  [UserService, SongService,AlbumService]
})


export class SongAddComponent implements OnInit{
  public titulo: string;
  public song: Song;
  public album: Album;
  public identity;
  public token;
  public url: string;
  public alertMessage: String;


  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _songService:SongService,
    private _albumService:AlbumService
  ){
    this.titulo = "Crear Canción";
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.song = new Song('',0,'','','');

  }

  ngOnInit(){
    console.log("song-add.component cargado");

  }
  onSubmit(){


    this._route.params.forEach((params:Params) => {
      let album_id = params['album']
      this.song.album  = album_id
      this._songService.addSong(this.token,this.song).subscribe(
        response => {

          if(!response.song){
            this.alertMessage='Error en el servidor';
          }else{
            this.alertMessage='Canción creada correctamente';
            this.song = response.song;
            this._router.navigate(['/editar-tema',response.song._id]);
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
    })
  }
}
