import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, ToastController, NavParams,AlertController } from 'ionic-angular';
import { AppSettings } from '../../app/app.constants';

import { Items } from '../../providers/providers';
import { TranslateService } from '@ngx-translate/core';
import { Contabilidad } from '../../providers/providers';
import { MainPage } from '../pages';
import { Item } from '../../models/item';

@IonicPage()
@Component({
  selector: 'page-item-detail',
  templateUrl: 'item-detail.html'
})
export class ItemDetailPage {
  item: any;
  private OperacionEliminarString: string;
  private OperacionEditarString: string;

  header_data:any;
  operacionesConceptos: any[] = [];

  operacion: { usuario: string, operacionId: string, access_token: string} = {
    usuario: AppSettings.usuario,
    operacionId: '',
    access_token: AppSettings.token
  };
  ionViewDidLoad() {
    this.getConceptos();
  }
  constructor(private alertCtrl: AlertController, public translateService: TranslateService, public toastCtrl:ToastController,  public contabilidad: Contabilidad,  public modalCtrl: ModalController, public navCtrl: NavController, navParams: NavParams, items: Items) {
    this.item = navParams.get('item') || items.defaultItem;
    this.header_data={usuario:AppSettings.usuario};
    this.translateService.get('OPERACION_ELIMINAR').subscribe((value) => {
      this.OperacionEliminarString = value;
    })
    this.translateService.get('OPERACION_EDITAR').subscribe((value) => {
      this.OperacionEditarString = value;
    })
  }
  getConceptos(){
    this.contabilidad.getConceptos(this.operacion).subscribe(
      (res:any)=> {
        this.operacionesConceptos = res;
        console.log(this.operacionesConceptos)
    })
  }
  fomatPrice(precio){
    return Number(precio).toLocaleString("es-ES", {minimumFractionDigits: 2}); 
  }
  editItem(item) {
    let addModal = this.modalCtrl.create('ItemCreatePage', {operacion_anterior: item});
    addModal.onDidDismiss(item => {
      if (item) {
        let toast = this.toastCtrl.create({
          message: this.OperacionEditarString,
          duration: 3000,
          position: 'bottom'
        });
        toast.present();
        this.navCtrl.push(MainPage);
      }
    })
    addModal.present();
  }
  deleteItem(item) {
    this.operacion.operacionId=item._id;
    let alert = this.alertCtrl.create({
      title: 'Eliminar movimiento?',
      message: '¿Esta seguro que desea eliminar este movimiento?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'OK',
          handler: () => {
            this.contabilidad.deleteOperacion(this.operacion).subscribe(
              (res:any)=> {
                let toast = this.toastCtrl.create({
                  message: this.OperacionEliminarString,
                  duration: 3000,
                  position: 'bottom'
                });
                toast.present();
                this.navCtrl.push(MainPage);
              })          
            }
        }
      ]
    });
    alert.present();

  }
  onChange(e) {
    this.translateService.use(e);
}
  openResumen() {
    this.navCtrl.push('ListMasterPage')
  }
  openEstadisticas(item: Item) {
    this.navCtrl.push('EstadisticasPage', {
      item: item
    });
  }
  openMovimientos(item: Item) {
    this.navCtrl.push('MovimientosPage', {
      item: item
    });
  }
  cerrarSesion(){
    AppSettings.usuario=''
    this.navCtrl.push('WelcomePage')
  }
  addItem() {
    let addModal = this.modalCtrl.create('ItemCreatePage');
    addModal.onDidDismiss(item => {
      if (item) {
        this.navCtrl.push(MainPage);
      }
    })
    addModal.present();
  }
  contacto(){
    let addModal = this.modalCtrl.create('ContactPage');
    addModal.onDidDismiss(item => {
    })
    addModal.present();
  }
}
