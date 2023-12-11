import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update-product',
  templateUrl: './add-update-product.component.html',
  styleUrls: ['./add-update-product.component.scss'],
})
export class AddUpdateProductComponent  implements OnInit {

  form = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    image: new FormControl('', [Validators.required]),
    price: new FormControl('', [Validators.required, Validators.min(0)]),
    soldUnits: new FormControl('', [Validators.required, Validators.min(0)]),
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
