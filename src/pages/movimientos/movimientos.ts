import { Component, ViewChild  } from '@angular/core';
import { IonicPage, ModalController, NavController, ToastController, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Item } from '../../models/item';

import { Contabilidad } from '../../providers/providers';
import { Items } from '../../providers/providers';

import { AppSettings } from '../../app/app.constants';

import { TranslateService } from '@ngx-translate/core';

/**
 * Generated class for the MovimientosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-movimientos',
  templateUrl: 'movimientos.html',
})
export class MovimientosPage {
  @ViewChild('fileInput') fileInput;

  isReadyToSave: boolean;

  item: any;
  operacionesConceptos: any[] = [];

  form: FormGroup;
  header_data:any;
  operaciones: any[] = [];
  operacion: {usuario: string, operacionId: string, access_token:string, fechaMin:Date, fechaMax:Date, cantidadMin:Number, cantidadMax:Number, concepto:string, tipo:string,max:number, skip: number} = {
    usuario: AppSettings.usuario,
    operacionId: '',
    access_token: AppSettings.token,
    fechaMin: new Date(1, 1, 1, 0, 0, 0, 0),
    fechaMax: new Date(),
    cantidadMin: null,
    cantidadMax : null,
    concepto: '',
    tipo: '' ,
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
  private noresultados: string;

  constructor(public viewCtrl: ViewController, formBuilder: FormBuilder, public translateService: TranslateService, public toastCtrl:ToastController, public navCtrl: NavController, public contabilidad: Contabilidad, public items:Items, public modalCtrl: ModalController) {
    this.form = formBuilder.group({
      concepto: [''],
      tipo: [''],
      cantidadMin: [''],
      cantidadMax: [''],
      fechaMin: [''],
      fechaMax:['']
    });

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
    this.header_data={usuario:AppSettings.usuario};
    this.translateService.get('NO_RESULTADOS').subscribe((value) => {
      this.noresultados = value;
    })
    this.translateService.get('OPERACION_ELIMINAR').subscribe((value) => {
      this.OperacionEliminarString = value;
    })
  }
  /**
   * The view loaded, let's query our items for the list
   */
  ionViewDidLoad() {
    this.operacion.skip = 0;
    this.operacion.max = 5;
    
    this.getOperaciones();
  }

  onChange(e) {
    this.translateService.use(e);
  }

  siguiente(){
    //this.operacion.max += AppSettings.increment;
    this.operacion.skip += AppSettings.increment;
    console.log(this.operacion)
    this.contabilidad.busqueda(this.operacion).subscribe(
      (res:any)=> {
        this.operaciones = res; 
        this.resultados.gastos = 0;
        this.resultados.ingresos = 0;
        this.resultados.saldo = 0;
        
        this.resultados.movimientos = this.operaciones['operaciones'].length;
        this.operaciones['operaciones'].forEach(operacion => {
          if(operacion.tipo=='Gasto'){
            this.resultados.gastos+=operacion.cantidad;
          }
          if(operacion.tipo=='Ingreso'){
            this.resultados.ingresos+=operacion.cantidad;
          }
        });
        this.resultados.saldo=this.resultados.ingresos - this.resultados.gastos
        if(this.resultados.movimientos==0){
          let toast = this.toastCtrl.create({
            message: this.noresultados,
            duration: 3000,
            position: 'bottom'
          });
          toast.present();
        }
      }
    );
  }

  atras(){
    //this.operacion.max -= AppSettings.increment;
    this.operacion.skip -= AppSettings.increment;
    this.contabilidad.busqueda(this.operacion).subscribe(
      (res:any)=> {
        this.operaciones = res; 
        this.resultados.gastos = 0;
        this.resultados.ingresos = 0;
        this.resultados.saldo = 0;
        
        this.resultados.movimientos = this.operaciones['operaciones'].length;
        this.operaciones['operaciones'].forEach(operacion => {
          if(operacion.tipo=='Gasto'){
            this.resultados.gastos+=operacion.cantidad;
          }
          if(operacion.tipo=='Ingreso'){
            this.resultados.ingresos+=operacion.cantidad;
          }
        });
        this.resultados.saldo=this.resultados.ingresos - this.resultados.gastos
        if(this.resultados.movimientos==0){
          let toast = this.toastCtrl.create({
            message: this.noresultados,
            duration: 3000,
            position: 'bottom'
          });
          toast.present();
        }
      }
    );
  }

  getOperaciones(){
    this.contabilidad.getOperaciones(this.operacion).subscribe(
      (res:any)=> {
        console.log(res)
        this.operaciones = res; 
        this.resultados.movimientos = this.operaciones['operaciones'].length;
        this.operaciones['operaciones'].forEach(operacion => {
          if(operacion.tipo=='Gasto'){
            this.resultados.gastos+=operacion.cantidad;
          }
          if(operacion.tipo=='Ingreso'){
            this.resultados.ingresos+=operacion.cantidad;
          }
        });
        this.resultados.saldo=this.resultados.ingresos - this.resultados.gastos
        this.getConceptos();
      })
  }
  done() {

    if (!this.form.valid) { return; }
    this.operacion.skip = 0;
    this.operacion.max = 5;
    console.log(this.operacion)
    this.contabilidad.busqueda(this.operacion).subscribe(
      (res:any)=> {
        this.operaciones = res; 
        this.resultados.gastos = 0;
        this.resultados.ingresos = 0;
        this.resultados.saldo = 0;
        
        this.resultados.movimientos = this.operaciones['operaciones'].length;
        this.operaciones['operaciones'].forEach(operacion => {
          if(operacion.tipo=='Gasto'){
            this.resultados.gastos+=operacion.cantidad;
          }
          if(operacion.tipo=='Ingreso'){
            this.resultados.ingresos+=operacion.cantidad;
          }
        });
        this.resultados.saldo=this.resultados.ingresos - this.resultados.gastos
        if(this.resultados.movimientos==0){
          let toast = this.toastCtrl.create({
            message: this.noresultados,
            duration: 3000,
            position: 'bottom'
          });
          toast.present();
        }
      }
    );
  }
  fomatPrice(precio){
    return Number(precio).toLocaleString("es-ES", {minimumFractionDigits: 2}); 
  }

  getConceptos(){
    this.contabilidad.getConceptos(this.operacion).subscribe(
      (res:any)=> {
        this.operacionesConceptos = res;
        console.log(this.operacionesConceptos)
    })
  }

  addItem() {
    let addModal = this.modalCtrl.create('ItemCreatePage', {operaciones: this.operacionesConceptos});
    addModal.onDidDismiss(item => {
      if (item) {
        this.getOperaciones();
      }
    })
    addModal.present();
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

  editItem(item) {
    let addModal = this.modalCtrl.create('ItemCreatePage', {operacion_anterior: item});
    addModal.onDidDismiss(item => {
      if (item) {
        this.getOperaciones();
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
        this.getOperaciones();
      })
  }

  openItem(item: Item) {
    this.navCtrl.push('ItemDetailPage', {
      item: item
    });
  }

  contacto(){
    let addModal = this.modalCtrl.create('ContactPage');
    addModal.onDidDismiss(item => {
    })
    addModal.present();
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  restarDias(dias){
    this.operacion.skip = 0;
    this.operacion.max = 5;
    var d = new Date();
    var fechaFin = new Date();
    fechaFin.setDate(d.getDate() -dias);
    this.operacion.fechaMin = fechaFin;
    this.operacion.fechaMax=new Date();

    this.contabilidad.busqueda(this.operacion).subscribe(
      (res:any)=> {
        this.operaciones = res; 
        this.resultados.gastos = 0;
        this.resultados.ingresos = 0;
        this.resultados.saldo = 0;
        
        this.resultados.movimientos = this.operaciones['operaciones'].length;
        this.operaciones['operaciones'].forEach(operacion => {
          if(operacion.tipo=='Gasto'){
            this.resultados.gastos+=operacion.cantidad;
          }
          if(operacion.tipo=='Ingreso'){
            this.resultados.ingresos+=operacion.cantidad;
          }
        });
        this.resultados.saldo=this.resultados.ingresos - this.resultados.gastos
        if(this.resultados.movimientos==0){
          let toast = this.toastCtrl.create({
            message: this.noresultados,
            duration: 3000,
            position: 'bottom'
          });
          toast.present();
        }
      }
    );
  }
}

