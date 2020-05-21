import { Component  } from '@angular/core';
import { IonicPage, ModalController, NavController, ToastController } from 'ionic-angular';

import { Item } from '../../models/item';

import { Contabilidad } from '../../providers/providers';
import { Items } from '../../providers/providers';

import { AppSettings } from '../../app/app.constants';

import { TranslateService } from '@ngx-translate/core';

/**
 * Generated class for the ListadoUsuariosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-listado-usuarios',
  templateUrl: 'listado-usuarios.html',
})
export class ListadoUsuariosPage {

  header_data:any;
  operaciones: any[] = [];
  operacionesConceptos: any[] = [];
  operacion: { usuario: string, operacionId: string, access_token: string, max:number, skip: number} = {
    usuario: AppSettings.usuario,
    operacionId: '',
    access_token: AppSettings.token,
    max: 5,
    skip: 0 
  };
  usuario:{ usuario: string} = {
    usuario:AppSettings.usuario
  };
  resultados: {saldo: number, ingresos: number, gastos:number, movimientos: number}={
    saldo: 0,
    ingresos:  0,
    gastos: 0,
    movimientos: 0
  };

  /*operacion: { fecha: Date, tipo: string, concepto: String, cantidad: number, usuario: string, predefinido: boolean } = {
    fecha: new Date(),
    tipo: '',
    concepto: '',
    cantidad: 0,
    usuario: '',
    predefinido: false

  };*/
  private OperacionEliminarString: string;

  constructor(public translateService: TranslateService, public toastCtrl:ToastController, public navCtrl: NavController, public contabilidad: Contabilidad, public items:Items, public modalCtrl: ModalController) {
    this.header_data={usuario:AppSettings.usuario};
    this.translateService.get('OPERACION_ELIMINAR').subscribe((value) => {
      this.OperacionEliminarString = value;
    })
  }
  onChange(e) {
    this.translateService.use(e);
}
  /**
   * The view loaded, let's query our items for the list
   */
  ionViewDidLoad() {
    this.operacion.skip = 0;
    this.operacion.max = 5;
    this.getUsuarios();
  }
  getUsuarios(){
    this.contabilidad.getUsuarios(this.operacion).subscribe(
      (res:any)=> {
        console.log(res)
        this.operaciones = res; 
      })
  }
  siguiente(){
    //this.operacion.max += AppSettings.increment;
    this.operacion.skip += AppSettings.increment;
    this.getUsuarios();
  }
  atras(){
    //this.operacion.max -= AppSettings.increment;
    this.operacion.skip -= AppSettings.increment;
    this.getUsuarios();
  }
  desactivarUsuario(item){
    if(item.activo=="si"){
      item.activo="no";
    }else{
      item.activo="si";
    }
    this.contabilidad.desactivarUsuario(item).subscribe(
      (res:any)=> {
        this.getUsuarios();
      })
  }
  eliminarUsuario(item){
    this.contabilidad.eliminarUsuario(item).subscribe(
      (res:any)=> {
        this.getUsuarios();
      })
  }
  /**
   * Prompt the user to add a new item. This shows our ItemCreatePage in a
   * modal and then adds the new item to our data source if the user created one.
   */
  addItem() {
    let addModal = this.modalCtrl.create('ItemCreatePage', {operaciones: this.operacionesConceptos});
    addModal.onDidDismiss(item => {
      if (item) {
        this.getUsuarios();
      }
    })
    addModal.present();
  }
  openResumen() {
    this.navCtrl.setRoot(this.navCtrl.getActive().component);
  }
  editItem(item) {
    let addModal = this.modalCtrl.create('ItemCreatePage', {operacion_anterior: item,operaciones: this.operacionesConceptos});
    addModal.onDidDismiss(item => {
      if (item) {
        this.getUsuarios();
      }
    })
    addModal.present();
  }
  searchItem(){
    let addModal = this.modalCtrl.create('ItemSearchPage');
    addModal.onDidDismiss(item => {
      if (item) {
        console.log(item)
        this.operaciones=item;
      }
    })
    addModal.present();
  }
  cerrarSesion(){
    AppSettings.usuario=''
    this.navCtrl.push('WelcomePage')
  }
  /**
   * Delete an item from the list of items.
   */
  deleteItem(item) {
    this.operacion.operacionId=item._id;
    this.contabilidad.deleteOperacion(this.operacion).subscribe(
      (res:any)=> {
        let toast = this.toastCtrl.create({
          message: this.OperacionEliminarString,
          duration: 3000,
          position: 'top'
        });
        toast.present();
        this.getUsuarios();
      })
  }

  /**
   * Navigate to the detail page for this item.
   */
  openItem(item: Item) {
    this.navCtrl.push('ItemDetailPage', {
      item: item
    });
  }
  openMovimientos(item: Item) {
    this.navCtrl.push('MovimientosPage', {
      item: item
    });
  }
  openEstadisticas(item: Item) {
    this.navCtrl.push('EstadisticasPage', {
      item: item
    });
  }
  contacto(){
    let addModal = this.modalCtrl.create('ContactPage');
    addModal.onDidDismiss(item => {
    })
    addModal.present();
  }
}

