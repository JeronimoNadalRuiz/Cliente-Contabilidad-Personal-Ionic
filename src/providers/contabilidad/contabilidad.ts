import { Injectable } from '@angular/core';
import { Api } from '../api/api';

@Injectable()
export class Contabilidad {

  constructor(public api: Api) { }
  eliminarUsuario(params?: any){
    return this.api.post('usuario/eliminar', params);
  }
  desactivarUsuario(params?: any){
    return this.api.put('usuario', params);
  }
  getUsuarios(params?: any){
    return this.api.post('usuarios', params);
  }
  getOperacion(params?: any) {
    return this.api.post('operacion/id', params);
  }
  getOperaciones(params?: any) {
    return this.api.post('operacion/busqueda', params);
  }
  getConceptos(params?: any) {
    return this.api.post('operacion/conceptos', params);
  }
  deleteOperacion(params?: any) {
    return this.api.post('operacion/eliminar', params);
  }
  crear(params?: any) {
    return this.api.post('operacion', params);
  }
  updateOperacion(params?: any) {
    return this.api.put('operacion', params);
  }
  busqueda(params?: any) {
    return this.api.post('operacion/busquedaPersonal', params);
  }
  enviarMail(params?: any){
    return this.api.post('enviarMail', params);
  }
  registro(params?: any){
    return this.api.post('registro', params);
  }
}