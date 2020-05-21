import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EstadisticasPage } from './estadisticas';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    EstadisticasPage,
  ],
  imports: [
    IonicPageModule.forChild(EstadisticasPage),
    TranslateModule.forChild()
  ],
  exports: [
    EstadisticasPage
  ]
})
export class EstadisticasPageModule {}
