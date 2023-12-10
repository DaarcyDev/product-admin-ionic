import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
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

      this.firebaseSvc.sendRecoveryEmail(this.form.value.email)
      .then(res => {
        this.utilsSvc.toast({
          message: 'The mail was sent successfully.',
          duration: 2000,
          color: 'primary',
          position: 'top',
          icon: 'mail-outline'
        });
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