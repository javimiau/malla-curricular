/**
 *  Entidad para una asignatura de la malla curricular
 */

export const ESTADOS = {
  APROBADA: "aprobada",
  PENDIENTE: "pendiente",
  REPROBADA: "reprobada",
  RENUNCIADA: "renunciada",
  NCR: "ncr",
  INSCRITA: "inscrita"
};

export class Asignatura {
  constructor(
    codigo,
    nombre,
    creditos,
    area, // ciencias, matematicas, ingenieria, etc
    semestre,
    estado = ESTADOS.PENDIENTE, //por defecto es pendiente
    prerrequisitos = [], //lo que se debe cumplir para tomar la asignatura
    creditos_necesarios = 0 //creditos aprobados en la asignatura
  ) {
    this.codigo = codigo;
    this.nombre = nombre;
    this.creditos = creditos;
    this.area = area;
    this.semestre = semestre;
    this.prerrequisitos = prerrequisitos;
    this.estado = estado;
    this.creditos_necesarios = creditos_necesarios;
  }

  aprobar() {
    this.estado = ESTADOS.APROBADA; //se usa solo 1 = porque a this.estado se le asigna 'Aprobada'
  }

  reprobar() {
    this.estado = ESTADOS.REPROBADA;
  }

  bloquear() {
    this.estado = ESTADOS.NCR;
  }

  esDeArea(nombreArea) {
    return this.area === nombreArea;
  }

  esDeSemestre(nroSemestre) {
    return this.semestre === nroSemestre;
  }
}
