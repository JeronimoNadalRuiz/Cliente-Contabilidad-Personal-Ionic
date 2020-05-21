export interface IOperacion {
    fecha: Date;
    tipo: string;
    concepto: string;
    cantidad: number;
    usuario: string;
    predefinido: boolean;
}

export class Operacion {
    public fecha: Date;
    public tipo: string;
    public concepto: string;
    public cantidad: number;
    public usuario: string;
    public predefinido: boolean;

    constructor(operaion: Operacion) {
        this.fecha = operaion.fecha;
        this.tipo = operaion.tipo;
        this.concepto = operaion.concepto;
        this.cantidad = operaion.cantidad;
        this.usuario = operaion.usuario;
        this.predefinido = operaion.predefinido;
    }
}