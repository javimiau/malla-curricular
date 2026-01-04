/**
 * Servicio para gestionar las operaciones relacionadas con la malla curricular.
 */
import { Asignatura, ESTADOS } from "../entities/asignatura.entity.js";
import data from "../data/malla.json" with { type: "json" };

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
          ESTADOS.PENDIENTE, //estado por defecto
          asig.prerrequisitos || [],
          asig.creditos_necesarios || 0
        )
    );
  }

  obtenerTotalCreditos() {
    const aprobadas = this.Asignatura.filter(
      (asig) => asig.estado === ESTADOS.APROBADA
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
    const materia = this.obtenerAsignaturasPorCodigo(code); // buscar la asignatura por código

    if (!materia) {
      // si no existe la asignatura
      return "La asignatura no se encuentra en la malla curricular.";
    }

    const totalCreditos = this.obtenerTotalCreditos(); // obtener créditos aprobados
    if (materia.creditos_necesarios > totalCreditos) {
      // verificar créditos necesarios
      return "No ha aprobado créditos suficientes para inscribir la asignatura.";
    }

    if (materia.prerrequisitos && materia.prerrequisitos.length > 0) {
      // verificar prerrequisitos
      // verificar cada prerrequisito con .every que devuelve true si todos cumplen la condición
      const requisitosCumplidos = materia.prerrequisitos.every((codigoPre) => {
        const pre = this.obtenerAsignaturasPorCodigo(codigoPre);
        // si no existe la asignatura prerequisito o no está aprobada -> requisito no cumplido
        return pre && pre.estado === ESTADOS.APROBADA;
      });

      if (!requisitosCumplidos) {
        // si no se cumplen los prerrequisitos
        return "No se cumplen los prerrequisitos necesarios.";
      }
    }

    // Todas las validaciones pasaron: marcar como aprobada
    materia.aprobar();
    return materia; // devuelve la asignatura actualizada
  }

  obtenerAsignaturasDisponibles() {
    const creditosActuales = this.obtenerTotalCreditos();

    return this.Asignatura.filter((asig) => {
      const esTomable =
        asig.estado === ESTADOS.PENDIENTE || asig.estado === ESTADOS.NCR;
      const tieneCreditos = creditosActuales >= asig.creditos_necesarios;
      const tieneRamos = asig.prerrequisitos.every((cod) => {
        const p = this.obtenerAsignaturasPorCodigo(cod);
        return p && p.estado === ESTADOS.APROBADA;
      });
      return esTomable && tieneCreditos && tieneRamos;
    });
  }

  actualizarMalla() {
    const creditosActuales = this.obtenerTotalCreditos();

    this.Asignatura.forEach((asig) => {
      if (asig.estado === ESTADOS.APROBADA) return;

      const tieneCreditos = creditosActuales >= asig.creditos_necesarios;

      const tieneRamos = asig.prerrequisitos.every((cod) => {
        const p = this.obtenerAsignaturasPorCodigo(cod);
        return p && p.estado === ESTADOS.APROBADA;
      });

      if (tieneCreditos && tieneRamos) {
        asig.estado = ESTADOS.PENDIENTE;
      } else {
        asig.bloquear();
      }
    });
  }
}
