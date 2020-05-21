import { Component, ViewChild  } from '@angular/core';
import { IonicPage, ModalController, NavController, ToastController, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Item } from '../../models/item';

import { Contabilidad } from '../../providers/providers';
import { Items } from '../../providers/providers';

import { AppSettings } from '../../app/app.constants';

import { TranslateService } from '@ngx-translate/core';
import { Chart } from 'chart.js';
/**
 * Generated class for the EstadisticasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-estadisticas',
  templateUrl: 'estadisticas.html',
})
export class EstadisticasPage {
  @ViewChild('fileInput') fileInput;
  @ViewChild('barCanvas') barCanvas;
  @ViewChild('doughnutCanvas') doughnutCanvas; 
  @ViewChild('lineCanvas') lineCanvas;
 
  barChart: any;
  doughnutChart: any;
  lineChart: any;
  isReadyToSave: boolean;

  item: any;
  operacionesConceptos: any[] = [];

  form: FormGroup;
  header_data:any;
  operaciones: any[] = [];
  operacion: {usuario: string, operacionId: string, access_token:string, fechaMin:Date, fechaMax:Date, cantidadMin:Number, cantidadMax:Number, concepto:string, tipo:string} = {
    usuario: AppSettings.usuario,
    operacionId: '',
    access_token: AppSettings.token,
    fechaMin: new Date(1, 1, 1, 0, 0, 0, 0),
    fechaMax: new Date(),
    cantidadMin: null,
    cantidadMax : null,
    concepto: '',
    tipo: ''  
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
    this.translateService.get('OPERACION_ELIMINAR').subscribe((value) => {
      this.OperacionEliminarString = value;
    })
    this.translateService.get('NO_RESULTADOS').subscribe((value) => {
      this.noresultados = value;
    })
  }
  /**
   * The view loaded, let's query our items for the list
   */
  ngAfterViewInit() {
    console.log("afterinit");
    setTimeout(() => {
      console.log(this.barCanvas.nativeElement.innerText);
      //console.log(this.doughnutCanvas.nativeElement.innerText);
      //console.log(this.lineCanvas.nativeElement.innerText);

    }, 1000);
  }

  ionViewDidLoad() {
    this.getOperaciones();
    this.getConceptos();
  }
  onChange(e) {
    this.translateService.use(e);
}
  getOperaciones(){
    this.contabilidad.getOperaciones(this.operacion).subscribe(
      (res:any)=> {
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
        this.barChart = new Chart(this.barCanvas.nativeElement, {
 
          type: 'bar',
          data: {
              labels: ["Gastos", "Ingresos"],
              datasets: [{
                  label: 'Gráfica',
                  data: [this.resultados.gastos, this.resultados.ingresos],
                  backgroundColor: [
                      'rgba(255, 99, 132, 0.2)',
                      'rgba(54, 206, 86, 0.2)'
                  ],
                  borderColor: [
                      'rgba(255,99,132,1)',
                      'rgba(75, 192, 192, 1)',
                      'rgba(255, 206, 86, 1)'
                  ],
                  borderWidth: 1
              }]
          },
          options: {
              scales: {
                  yAxes: [{
                      ticks: {
                          beginAtZero:true
                      }
                  }]
              }
          }
      });
      /*this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
 
        type: 'doughnut',
        data: {
          labels: ["Gastos", "Ingresos"],
          datasets: [{
            label: 'Resumen',
            data: [this.resultados.gastos, this.resultados.ingresos],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 206, 86, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(75, 192, 192, 1)',
                'rgba(255, 206, 86, 1)'
            ],
            borderWidth: 1
        }]
        }
    
    });*/
    
    /*this.lineChart = new Chart(this.lineCanvas.nativeElement, {
    
        type: 'line',
        data: {
          labels: ["Gastos", "Ingresos"],
            datasets: [
                {
                  label: 'Resumen saldo',
                  fill: false,
                    lineTension: 0.1,
                    backgroundColor: "rgba(75,192,192,0.4)",
                    borderColor: "rgba(75,192,192,1)",
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: "rgba(75,192,192,1)",
                    pointBackgroundColor: "#fff",
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgba(75,192,192,1)",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: [65, 59, 80, 81, 56, 55, 40],
                    spanGaps: false,
                }
            ]
        }
    
    });*/
      })
  }
  fomatPrice(precio){
    return Number(precio).toLocaleString("es-ES", {minimumFractionDigits: 2}); 
  }
  /**
   * Prompt the user to add a new item. This shows our ItemCreatePage in a
   * modal and then adds the new item to our data source if the user created one.
   */
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
        this.getOperaciones();
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

  contacto(){
    let addModal = this.modalCtrl.create('ContactPage');
    addModal.onDidDismiss(item => {
    })
    addModal.present();
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

    /*if(this.navParams.get('operacion_anterior')){
      
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
          console.log(res)
        }
      });
    }*/
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
        this.barChart.clear();

        if(this.resultados.movimientos==0){
          let toast = this.toastCtrl.create({
            message: this.noresultados,
            duration: 3000,
            position: 'bottom'
          });
          toast.present();
        }else{
          this.barChart = new Chart(this.barCanvas.nativeElement, {
 
            type: 'bar',
            data: {
                labels: ["Gastos", "Ingresos"],
                datasets: [{
                    label: 'Gráfica',
                    data: [this.resultados.gastos, this.resultados.ingresos],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 206, 86, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(255, 206, 86, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
            }
        });  
        }
      }
    );
  }
  restarDias(dias){
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
        this.barChart.clear();
        if(this.resultados.movimientos==0){
          let toast = this.toastCtrl.create({
            message: this.noresultados,
            duration: 3000,
            position: 'bottom'
          });
          toast.present();
        }else{
          this.barChart = new Chart(this.barCanvas.nativeElement, {
 
            type: 'bar',
            data: {
                labels: ["Gastos", "Ingresos"],
                datasets: [{
                    label: 'Gráfica',
                    data: [this.resultados.gastos, this.resultados.ingresos],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 206, 86, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(255, 206, 86, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
            }
        });  
        }
        //this.doughnutCanvas.update();    
    }
    );
  }
}
