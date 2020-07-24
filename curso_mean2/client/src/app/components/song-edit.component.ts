import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Song } from '../models/song';
import { Album } from '../models/album';
import{ UploadService } from '../services/upload.service';
import{ UserService } from '../services/user.service';
import{ SongService } from '../services/song.service';
import { GLOBAL } from '../services/global';


@Component({
  selector: 'song-edit',
  templateUrl : '../views/song-add.html',
  providers :  [UserService,SongService,UploadService]
})


export class SongEditComponent implements OnInit{
  public titulo: string;
  public song: Song;
  public identity;
  public token;
  public url: string;
  public is_edit;
  public alertMessage: String;
  public filesToUpload:Array<File>;


  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _uploadService: UploadService,
    private _songService:SongService
  ){
    this.titulo = "Editar Tema";
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.song = new Song('',0,'','','');

    this.is_edit = true;

  }

  ngOnInit(){
    console.log("song-edit.component cargado");
    //cosneguir el album
    this.getSong()

  }
  getSong(){
    this._route.params.forEach((params:Params) => {
      let album_id = params['id']
      this._songService.getSong(this.token,album_id).subscribe(
        response => {

          if(!response.song){
            //this.alertMessage='Error en el servidor';
            this._router.navigate(['/']);
          }else{
            //this.alertMessage='Album editado correctamente';
            this.song = response.song;
          }
        },
        error => {
          var error = <any> error;

          if(error!=null){
            var body = JSON.parse(error._body);
            console.log(error);
          }
        }
      );
    });
  }
  onSubmit(){


    this._route.params.forEach((params:Params) => {
      let id = params['id']
      this._songService.editSong(this.token,id,this.song).subscribe(
        response => {

          if(!response.song){
            this.alertMessage='Error en el servidor';
          }else{
            this.alertMessage='Tema editado correctamente';
            if(!this.filesToUpload){
              //redirigir
              this._router.navigate(['/album',response.song.album]);
            }else{
              //subir img de artista
              this._uploadService.makeFileRequest(this.url+'upload-song-file/'+id,[],this.filesToUpload,this.token,'file')
                  .then(
                    (result) => {
                        this._router.navigate(['/album',response.song.album]);
                    },
                    (error) => {
                        console.log(error);
                    }
                  );
            }

            //this._router.navigate(['crear-album/',response.artist._id]);
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
  fileChangeEvent(fileInput:any){
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }
}
