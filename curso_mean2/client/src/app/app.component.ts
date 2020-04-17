import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';
import { User } from "./models/user";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers:[UserService]
})
export class AppComponent implements OnInit{
  public title = 'MUSIFY';
  public user : User;
  public identity;
  public token;
  public errorMessage; //son los atributos que se pueden llamar desde HTML
  constructor(
    private _userService: UserService
  ){
    this.user = new User("","","","","","ROLE_USER","");
  }

  ngOnInit(){

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

                  console.log(token);
                  console.log(identity);
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
}
