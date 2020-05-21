import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//import { Camera } from '@ionic-native/camera';
import { IonicPage, NavController, ViewController, NavParams,ToastController} from 'ionic-angular';
import { Contabilidad } from '../../providers/providers';
import { AppSettings } from '../../app/app.constants';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: 'page-item-create',
  templateUrl: 'item-create.html'
})
export class ItemCreatePage {
  @ViewChild('fileInput') fileInput;

  isReadyToSave: boolean;
  private OperacionInsertarString: string;

  item: any;
  operaciones: any[] = [];
  operaciones2 = {
    "concepto": []
  }

  form: FormGroup;

  operacion: { fecha: Date, tipo: string, concepto: string, cantidad: number, usuario: string, predefinido: boolean, _id: string, access_token: string } = {
    fecha: new Date(),
    tipo: 'Gasto',
    concepto: '',
    cantidad: null,
    usuario: AppSettings.usuario,
    predefinido: false,
    _id: '',
    access_token: AppSettings.token

  };

  constructor(public translateService: TranslateService, public toastCtrl:ToastController, public navParams: NavParams, public contabilidad:Contabilidad, public navCtrl: NavController, public viewCtrl: ViewController, formBuilder: FormBuilder/*, public camera: Camera*/) {
    this.translateService.get('OPERACION_EDITAR').subscribe((value) => {
      this.OperacionInsertarString = value;
    })
    if(this.navParams.get('operacion_anterior')){
      this.operacion.fecha= this.navParams.get('operacion_anterior').fecha
      this.operacion.tipo= this.navParams.get('operacion_anterior').tipo
      this.operacion.concepto= this.navParams.get('operacion_anterior').concepto
      this.operacion.cantidad= this.navParams.get('operacion_anterior').cantidad
      this.operacion.usuario= AppSettings.usuario
      this.operacion.predefinido= this.navParams.get('operacion_anterior').predefinido
      this.operacion._id= this.navParams.get('operacion_anterior')._id
    }
    this.form = formBuilder.group({
      //profilePic: [''],
      concepto: [''],
      tipo: ['', Validators.required],
      cantidad: ['', Validators.required],
      fecha: ['', Validators.required],
      predefinido: ['']
    });

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }
  onChange(e) {
    this.translateService.use(e);
}

  ionViewDidLoad() {  
    this.contabilidad.getConceptos(this.operacion).subscribe(
      (res:any)=> {
        this.operaciones=res;
        this.operaciones['concepto'].forEach(element => {
          if( this.operaciones2['concepto'].length==0){
            this.operaciones2['concepto'].push(element);
          }else{
            if(this.search(element.concepto, this.operaciones2['concepto'])==false){
              this.operaciones2['concepto'].push(element);
            }
          }
        });
    })  

  }
  search(nameKey, myArray){
    var boolean=true;
    myArray.forEach(element => {
      if (element.concepto == nameKey) {
          boolean = true;
      }else{
        console.log(false)
        boolean = false;
      }
  });
  return boolean;
}
  

  /**
   * The user cancelled, so we dismiss without sending data back.
   */
  cancel() {
    this.viewCtrl.dismiss();
  }

  /**
   * The user is done and wants to create the item, so return it
   * back to the presenter.
   */
  done() {
    if (!this.form.valid) { return; }

    if(this.navParams.get('operacion_anterior')){
      
      this.operacion._id=this.navParams.get('operacion_anterior')._id;
      console.log(this.operacion);
      this.contabilidad.updateOperacion(this.operacion).subscribe((resp) => {
        (res:any)=> {

          console.log(res)
        }
      });
    }else{
      this.contabilidad.crear(this.operacion).subscribe((resp) => {
        (res:any)=> {
          let toast = this.toastCtrl.create({
            message: this.OperacionInsertarString,
            duration: 3000,
            position: 'bottom'
          });
          toast.present();
          console.log(res)
        }
      });
    }
    this.viewCtrl.dismiss(this.form.value);
  }
}
