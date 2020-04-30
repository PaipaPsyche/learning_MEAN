import { Router, ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';
import { User } from "./models/user";
import{ GLOBAL } from './services/global';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers:[UserService]
})
export class AppComponent implements OnInit{
  public title = 'MUSIFY';
  public user : User;
  public user_register : User;
  public identity;
  public token;
  public url:string;

  public alertRegister;
  public errorMessage; //son los atributos que se pueden llamar desde HTML
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService
  ){
    this.user = new User("","","","","","ROLE_USER","");
    this.user_register = new User("","","","","","ROLE_USER","");
    this.url=GLOBAL.url;
  }

  ngOnInit(){
    this.identity=this._userService.getIdentity();
    this.token=this._userService.getToken();

    //console.log(this.identity,this.token);

  }



  public onSubmit(){

    this._userService.signup(this.user).subscribe(
      response => {
        let identity = response.user;
        this.identity = identity;

        if(!this.identity._id){

          alert("El usuario no está correctamente identificado");
        }else{
          // crear elemento en el local storage (sesion de ususario)
          localStorage.setItem('identity', JSON.stringify(identity));

          // conseguir el token para cada peticion
          this._userService.signup(this.user,true).subscribe(
            response => {
              let token = response.token;
              this.token = token;

              if(this.token.length<=0){
                alert("El token no se ha generado.");
              }

              if(!this.identity._id){
                alert("El usuario no está correctamente identificado");
              }else{

                // crear elemento en el local storage para tener token disponible
                  localStorage.setItem('token', token);
                  this.user = new User("","","","","","ROLE_USER","");
                // conseguir el token para cada peticion

              }


            },
            error =>{

              var error = <any>error;

              if(error!=null){
                var body = JSON.parse(error._body);
                this.errorMessage = body.message;
                console.log(error);
              }
            }
          );

        }


      },
      error =>{
        var error = <any>error;

        if(error!=null){
          var body = JSON.parse(error._body);
          this.errorMessage = body.message;
          console.log(error);
        }
      }
    );
  }
  logout(){
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    localStorage.clear();

    this.identity=null;
    this.token=null;
    this._router.navigate(['/']);

  }

  onSubmitRegister(){
    this._userService.register(this.user_register).subscribe(
      response =>{
        let user = response.user;
        this.user_register = user;

        if(!user._id){
          this.alertRegister = "Error al registrarse";
        }else{
          this.alertRegister = "El registro se ha realizado correctamente, identificate con " + this.user_register.email;
          this.user_register = new User("","","","","","ROLE_USER","");
        }
      },
      error => {
        var error = <any>error;

        if(error!=null){
          var body = JSON.parse(error._body);
          this.alertRegister = body.message;
          console.log(error);
        }
      }
    );
  }
}
