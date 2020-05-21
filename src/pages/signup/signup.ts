import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';

import { User } from '../../providers/providers';
import { Contabilidad } from '../../providers/providers';

import { AppSettings } from '../../app/app.constants';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: { nombre: string, usuario: string, password: string, repeatPassword: string, email:string, activo:string } = {
    nombre: '',
    usuario: '',
    password: '',
    repeatPassword: '',
    email: '',
    activo: 'si'
  };

  // Our translated text strings
  private signupErrorString: string;
  private userExists: string;
  private completeFileds: string;
  private passwordEerror: string;

  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
    public contabilidad: Contabilidad) {

    this.translateService.get('SIGNUP_ERROR').subscribe((value) => {
      this.signupErrorString = value;
    })

    this.translateService.get('SIGNUP_ERROR_USER_EXISTS').subscribe((value) => {
      this.userExists = value;
    })

    this.translateService.get('SIGNUP_ERROR_COMPLETE_FIELDS').subscribe((value) => {
      this.completeFileds = value;
    })

    this.translateService.get('SIGNUP_ERROR_PASSWORD').subscribe((value) => {
      this.passwordEerror = value;
    })
  }
  cambiarIdioma(e) {
    this.translateService.use(e);
  }
  doSignup() {
    // Attempt to login in through our User service
    if(this.account.nombre==''||this.account.usuario==''||this.account.password==''){
      let toast = this.toastCtrl.create({
        message: this.completeFileds,
        duration: 3000,
        position: 'top'
      });
      toast.present();
    }else{
      if(this.account.password != this.account.repeatPassword){
        let toast = this.toastCtrl.create({
          message: this.passwordEerror,
          duration: 3000,
          position: 'top'
        });
        toast.present();
      }else{
        if(this.account.nombre!=''||this.account.usuario!=''||this.account.password!=''){
          this.user.signup(this.account).subscribe((resp) => {
            AppSettings.usuario=this.account.usuario;
            AppSettings.email = this.account.email;
            this.navCtrl.push('WelcomePage');
            this.contabilidad.registro(this.account)
          }, (err) => {
    
            // Unable to sign up
            let toast = this.toastCtrl.create({
              message: this.userExists,
              duration: 3000,
              position: 'top'
            });
            toast.present();
          });
        }
      }
    }
  }
}
