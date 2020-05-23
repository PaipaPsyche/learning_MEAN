import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Artist } from '../models/artist';
import { Album } from '../models/album';
import { Song } from '../models/song';
import{ AlbumService } from '../services/album.service';
import{ UserService } from '../services/user.service';
import { GLOBAL } from '../services/global';


@Component({
  selector: 'album-detail',
  templateUrl : '../views/album-detail.html',
  providers :  [UserService, AlbumService]
})


export class AlbumDetailComponent implements OnInit{

  public album : Album;
  public songs : Song[];
  public identity;
  public token;
  public url: string;
  public alertMessage;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _albumService: AlbumService,
    //private _songService: SongService,

  ){

    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
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
      console.log(id)

      this._albumService.getAlbum(this.token,id).subscribe(
        response => {
          if(!response.album){
            this._router.navigate(['/']);
          }else{
            this.album = response.album;


            //sacar los albums
            // this._songService.getSongs(this.token,response.album._id).subscribe(
            //   response => {
            //
            //     if(!response.songs){
            //       this.alertMessage = "Este album no tiene caonciones";
            //     }else{
            //       this.songs = response.songs;
            //     }
            //   },
            //   error => {
            //     var error = <any> error;
            //
            //     if(error!=null){
            //       var body = JSON.parse(error._body);
            //       this.alertMessage = body.message;
            //       console.log(error);
            //     }
            //   }
            // );
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


}
