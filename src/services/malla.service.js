/**
 * Servicio para gestionar las operaciones relacionadas con la malla curricular.
 */
import { Asignatura } from "../entities/asignatura.entity.js";
import data from "../data/malla.json" assert { type: "json" };

export class MallaService {
  constructor() {
    //Usando datos importados para crear instancias de Asignatura
    this.Asignatura = data.map(
      (asig) =>
        new Asignatura(
          asig.codigo,
          asig.nombre,
          asig.creditos,
          asig.area,
          asig.semestre,
          "Pendiente", //estado por defecto
          asig.prerrequisitos || [],
          asig.creditos_necesarios || 0
        )
    );
  }

  obtenerTotalCreditos() {
    const aprobadas = this.Asignatura.filter(
      (asig) => asig.estado === "Aprobada"
    ); // filtrar asignaturas aprobadas
    return aprobadas.reduce((total, asig) => total + asig.creditos, 0); // sumar los créditos
  }

  obtenerAsignaturasPorArea(nombreArea) {
    return this.Asignatura.filter((asig) => asig.area === nombreArea); //devuelve una lista
  }

  obtenerAsignaturasPorCodigo(code) {
    return this.Asignatura.find((asig) => asig.codigo === code); //devuelve un solo elemento
  }

  obtenerAsignaturasPorNombre(name) {
    return this.Asignatura.find((asig) => asig.nombre === name);
  }

  obtenerAsignaturasPorSemestre(nroSemestre) {
    return this.Asignatura.filter((asig) => asig.semestre === nroSemestre);
  }

  aprobarAsignatura(code) {
    materia = obtenerAsignaturaPorCodigo(code);
    if (!materia) {
        return "La asignatura no se encuentra en la malla curricular.";
    } else {
        if (materia.creditos_necesarios <= this.obtenerTotalCreditos() ) {
            return "No ha aprobado créditos suficientes para inscribir la asignatura.";
        } else {
            //if (materia.prerrequisitos.length > 0) {
            //    for (let i=0; i< materia.prerrequisitos.length; i++){
//
            //    }
            //}
        }
    }


  }
}
