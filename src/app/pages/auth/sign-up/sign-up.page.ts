import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  form = new FormGroup({
    uid: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
  });

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  constructor() { }

  ngOnInit() {
  }

  async submit() {
    if (this.form.valid) {
      const loading = await this.utilsSvc.loading();
      await loading.present();

      //? crear el usuario
      this.firebaseSvc.signUp(this.form.value as User)
        .then(async res => {
          //? actualizar el nombre del usuario
          await this.firebaseSvc.updateUser(this.form.value.name);
          let uid = res.user.uid;
          //? asignar el uid al documento del usuario
          this.form.controls.uid.setValue(uid);

          this.setUserInfo(uid);

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

  async setUserInfo(uid: string) {
    if (this.form.valid) {
      const loading = await this.utilsSvc.loading();
      await loading.present();
      //? asignar el uid al documento del usuario
      let path = `users/${uid}`;
      //? eliminar el campo password del formulario
      delete this.form.value.password;
      //? crear el documento del usuario
      this.firebaseSvc.setDocument(path, this.form.value)
        .then(async res => {
          //? guardar el usuario en el local storage
          this.utilsSvc.saveInLocalStorage('user', this.form.value);
          //? redireccionar a la pagina home
          this.utilsSvc.routerLink('/main/home');
          //? resetear el formulario
          this.form.reset();
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

}
