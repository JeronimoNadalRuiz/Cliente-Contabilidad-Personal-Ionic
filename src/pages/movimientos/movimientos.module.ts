import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { MovimientosPage } from './movimientos';

@NgModule({
  declarations: [
    MovimientosPage,
  ],
  imports: [
    IonicPageModule.forChild(MovimientosPage),
    TranslateModule.forChild()
  ],
  exports: [
    MovimientosPage
  ]
})
export class MovimientosPageModule {}
