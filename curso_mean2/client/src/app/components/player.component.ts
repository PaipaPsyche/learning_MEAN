import { Component, OnInit } from '@angular/core';
//import { Router, ActivatedRoute, Params } from '@angular/router';

import { Song } from '../models/song';
//import { Album } from '../models/album';
//import{ UploadService } from '../services/upload.service';
//import{ UserService } from '../services/user.service';
import{ SongService } from '../services/song.service';
import { GLOBAL } from '../services/global';


@Component({
  selector: 'player',
  template:`
  <div class="album-image">
    <span *ngIf="song.album">
      <img id="play-image-album" src="{{url + 'get-image-album/' + song.album.image}}"/>
    </span>
    <span *ngIf="!song.album">
      <img id="play-image-album" src="assets/images/default.jpg"/>
    </span>
  </div>

  <div class="audio-file">

    <p>Reproduciendo</p>

    <div id="play-song-title" class="column">
      <div class="names-player row">
        <span id="play-song-title">
        {{song.name}}
        </span>
        |
        <span *ngIf="song.album.artist">
          <span id="play-song-artist">
          {{song.album.artist.name}}
          </span>
        </span>
      </div>
      <audio controls id="player-player">
        <source id="mp3-source" src="{{url + 'get-song-file/' + song.file}}" type="audio/mpeg">
        Tu navegador no es compatible.
      </audio>
  </div>`
})


export class PlayerComponent implements OnInit{

  public url : string;
  public song: Song;


  constructor(){
    this.url = GLOBAL.url;
    this.song = new Song("",1,"","","");
  }

  ngOnInit(){
    console.log("player cargado")
  }

}
