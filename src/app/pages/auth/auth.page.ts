import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  constructor() { }

  ngOnInit() {
  }

  async submit() {
    if(this.form.valid){
      const loading = await this.utilsSvc.loading();
      await loading.present();

      this.firebaseSvc.signIn(this.form.value as User)
      .then(res => {
        //? mandamos a llamar la funcion que obtiene los datos del usuario
        this.getUserInfo(res.user.uid);
      })
      .catch(err => {
        console.log(err);
        this.utilsSvc.toast({
          message: 'The password is invalid or the user does not have a password.',
          duration: 2000,
          color: 'danger',
          position: 'top',
          icon: 'close-circle-outline'
        });
      })
      .finally(() => {
        loading.dismiss();
      });
    }
  }

  async getUserInfo(uid: string) {
    if (this.form.valid) {
      const loading = await this.utilsSvc.loading();
      await loading.present();
      //? asignar el uid al documento del usuario
      let path = `users/${uid}`;
      console.log(this.firebaseSvc.getDocument(path))
      //? obtener los datos del usuario
      this.firebaseSvc.getDocument(path)
      
        .then( (user: User) => {
          //? guardar el usuario en el local storage
          this.utilsSvc.saveInLocalStorage('user', user);
          //? redireccionar a la pagina home
          this.utilsSvc.routerLink('/main/home');
          //? resetear el formulario
          this.form.reset();
          //? mostrar un mensaje de bienvenida
          this.utilsSvc.toast({
            message: `Welcome ${user.name}!`,
            duration: 2000,
            color: 'primary',
            position: 'top',
            icon: 'person-circle-outline'
          });
        })
        .catch(err => {
          console.log(err);
          this.utilsSvc.toast({
            message: err.message,
            duration: 2000,
            color: 'danger',
            position: 'top',
            icon: 'close-circle-outline'
          });
        })
        .finally(() => {
          loading.dismiss();
        });
    }
  }
}
