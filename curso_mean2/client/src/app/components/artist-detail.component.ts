import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Artist } from '../models/artist';
import { Album } from '../models/album';
import{ ArtistService } from '../services/artist.service';
import{ AlbumService } from '../services/album.service';
import{ UserService } from '../services/user.service';
import { GLOBAL } from '../services/global';


@Component({
  selector: 'artist-detail',
  templateUrl : '../views/artist-detail.html',
  providers :  [UserService, ArtistService,AlbumService]
})


export class ArtistDetailComponent implements OnInit{

  public artist: Artist;
  public albums : Album[];
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
    private _artistService: ArtistService
  ){

    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    // this.artist = new Artist('','','','');
  }

  ngOnInit(){
    console.log("artist-detail.component cargado");
    //lalamr al metodo del api para sacar al artita en base a su id
    this.getArtist();
  }
  getArtist(){
    this._route.params.forEach((params : Params) => {
      let id = params['id'];

      this._artistService.getArtist(this.token,id).subscribe(
        response => {
          if(!response.artist){
            this._router.navigate(['/']);
          }else{
            this.artist = response.artist;

            //sacar los albums
            this._albumService.getAlbums(this.token,response.artist._id).subscribe(
              response => {

                if(!response.albums){
                  this.alertMessage = "Este artista no tiene albums";
                }else{
                  this.albums = response.albums;
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
    this.confirmado=id;
  }
  onCancelAlbum(){
    this.confirmado=null;
  }
  onDeleteAlbum(id){
    this._albumService.deleteAlbum(this.token,id).subscribe(
      response =>{
        if(!response.album){
          alert('Error en el servidor');
        }else{
          console.log(response.album)
          this.getArtist()
        }

      },
      error =>{
        var error = <any> error;

        if(error!=null){
          var body = JSON.parse(error._body);
          //this.alertMessage = body.message;
          console.log(error);
        }
      }
    );
  }

}
