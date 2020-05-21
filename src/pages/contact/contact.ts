import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, ViewController, NavParams } from 'ionic-angular';
import { Contabilidad } from '../../providers/providers';
import { AppSettings } from '../../app/app.constants';
/**
 * Generated class for the ContactPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
})
export class ContactPage {
  @ViewChild('fileInput') fileInput;
  form: FormGroup;
  isReadyToSave: boolean;
  contacto: { nombre: string, texto: string, email:string, access_token: string} = {
    nombre: '',
    texto: '',
    email: AppSettings.email,
    access_token: AppSettings.token

  };
  constructor(public navParams: NavParams, public contabilidad:Contabilidad, public navCtrl: NavController, public viewCtrl: ViewController, formBuilder: FormBuilder) {
    this.form = formBuilder.group({
      nombre: ['', Validators.required],
      texto: ['', Validators.required]
    });

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    })
  }

  ionViewDidLoad() {
  }
  cancel() {
    this.viewCtrl.dismiss();
  }

  /**
   * The user is done and wants to create the item, so return it
   * back to the presenter.
   */
  done() {
    if (!this.form.valid) { return; }
    this.contabilidad.enviarMail(this.contacto).subscribe((resp) => {
      (res:any)=> {
        console.log(res)
      }
    });
    this.viewCtrl.dismiss(this.form.value);
  }
}
