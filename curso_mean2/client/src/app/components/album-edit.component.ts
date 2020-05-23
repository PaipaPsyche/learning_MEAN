import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Artist } from '../models/artist';
import { Album } from '../models/album';
import{ UploadService } from '../services/upload.service';
import{ UserService } from '../services/user.service';
import{ AlbumService } from '../services/album.service';
import { GLOBAL } from '../services/global';


@Component({
  selector: 'album-edit',
  templateUrl : '../views/album-add.html',
  providers :  [UserService,AlbumService,UploadService]
})


export class AlbumEditComponent implements OnInit{
  public titulo: string;
  public album: Album;
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
    private _albumService:AlbumService
  ){
    this.titulo = "Editar Album";
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.album = new Album('','',2017,'','');

    this.is_edit = true;

  }

  ngOnInit(){
    console.log("album-add.component cargado");
    //cosneguir el album
    this.getAlbum()

  }
  getAlbum(){
    this._route.params.forEach((params:Params) => {
      let album_id = params['id']
      this._albumService.getAlbum(this.token,album_id).subscribe(
        response => {

          if(!response.album){
            //this.alertMessage='Error en el servidor';
            this._router.navigate(['/']);
          }else{
            //this.alertMessage='Album editado correctamente';
            this.album = response.album;
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
      this._albumService.editAlbum(this.token,id,this.album).subscribe(
        response => {

          if(!response.album){
            this.alertMessage='Error en el servidor';
          }else{
            this.alertMessage='Album editado correctamente';
            if(!this.filesToUpload){
              //redirigir
              this._router.navigate(['/artista',response.album.artist]);
            }else{
              //subir img de artista
              this._uploadService.makeFileRequest(this.url+'upload-image-album/'+id,[],this.filesToUpload,this.token,'image')
                  .then(
                    (result) => {
                        this._router.navigate(['/artista',response.album.artist]);
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
