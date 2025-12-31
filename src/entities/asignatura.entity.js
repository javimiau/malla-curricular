/**
 *  Entidad para una asignatura de la malla curricular
 */

export class Asignatura {
  constructor(
    codigo, 
    nombre,
    creditos,
    area, // ciencias, matematicas, ingenieria, etc
    semestre,
    estado = "Pendiente", //por defecto es pendiente
    prerrequisitos = [] //lo que se debe cumplir para tomar la asignatura
  ) {
    this.codigo = codigo;
    this.nombre = nombre;
    this.creditos = creditos;
    this.area = area;
    this.semestre = semestre;
    this.prerrequisitos = prerrequisitos;
    this.estado = estado;
  }

  aprobar() {
    this.estado = 'Aprobada'; //se usa solo 1 = porque a this.estado se le asigna 'Aprobada'
};

esDeArea(nombreArea) {
    return this.area === nombreArea;
};

esDeSemestre(nroSemestre) {
    return this.semestre === nroSemestre;
}

};



