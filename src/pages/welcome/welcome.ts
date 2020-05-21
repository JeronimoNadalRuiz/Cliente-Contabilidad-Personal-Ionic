import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { User } from '../../providers/providers';
import { AppSettings } from '../../app/app.constants';
/**
 * The Welcome Page is a splash page that quickly describes the app,
 * and then directs the user to create an account or log in.
 * If you'd like to immediately put the user onto a login/signup page,
 * we recommend not using the Welcome page.
*/
@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage {
  
  account: { usuario: string, password: string, activo:string} = {
    usuario: '',
    password: '',
    activo: ''
  };

  // Our translated text strings
  private loginErrorString: string;

  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService) {

    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    })
   }

  login() {
    this.navCtrl.push('LoginPage');
  }

  signup() {
    this.navCtrl.push('SignupPage');
  }
  onChange(e) {
    this.translateService.use(e);
}
    // Attempt to login in through our User service
  doLogin() {
    this.user.login(this.account).subscribe(
      (res:any)=> {
      AppSettings.usuario=this.account.usuario;
      AppSettings.token=res.token;
      AppSettings.email = res.email;
      console.log(res)
      if(res.activo=="no"){
        let toast = this.toastCtrl.create({
          message: "El usuario está desahbilitado, por favor pongase en contacto con el adminstrador del sitio para obtener más información.",
          duration: 3000,
          position: 'top'
        });
        toast.present();
      }else{
        if(this.account.usuario=="admin"){
          this.navCtrl.push('ListadoUsuariosPage');
        }else{
          this.navCtrl.push('ListMasterPage');
        }
      }
    }, (err) => {
      // Unable to log in
      let toast = this.toastCtrl.create({
        message: this.loginErrorString,
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });
  }
}
