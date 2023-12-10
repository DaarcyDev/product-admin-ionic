import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController, ToastOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  loadingCtrl = inject(LoadingController);
  toastCtrl = inject(ToastController);
  router = inject(Router);

  loading(){
    return this.loadingCtrl.create({
      spinner: 'crescent',
    })
  }

  async toast(opts?: ToastOptions){
    const toast = await this.toastCtrl.create(opts);
    toast.present();
  }


  //? redireccionar a una pagina
  routerLink(url: string){
    return this.router.navigateByUrl(url);
  }
  //? guarda un item del local storage
  saveInLocalStorage(key: string, value: any){
    return localStorage.setItem(key, JSON.stringify(value));
  }
  //? obtiene un item del local storage
  getFromLocalStorage(key: string){
    return JSON.parse(localStorage.getItem(key));
  }
}
