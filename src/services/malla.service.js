import { Asignatura, ESTADOS } from "../entities/asignatura.entity.js";
import data from "../../data/malla.json" with { type: "json" };

export class MallaService {
  constructor() {
    this.asignaturas = data.map((asig) => {
        // 1. Obtenemos el valor guardado
        const guardado = localStorage.getItem(asig.codigo);
        
        // 2. IMPORTANTE: Validamos que el estado sea el valor exacto de la entidad
        // Si en localStorage dice "APROBADA", usamos ESTADOS.APROBADA
        const estadoInicial = (guardado === ESTADOS.APROBADA) ? ESTADOS.APROBADA : ESTADOS.PENDIENTE;

        return new Asignatura(
          asig.codigo,
          asig.nombre,
          asig.creditos,
          asig.area,
          asig.semestre,
          estadoInicial, 
          asig.prerrequisitos || [],
          asig.creditos_necesarios || 0
        );
    });
    
    // Ejecutamos una actualización inicial
    this.actualizarMalla();
  }

  async cargarDatos() {
      return Promise.resolve(); 
  }

  obtenerTotalCreditos() {
    return this.asignaturas
      .filter((asig) => asig.estado === ESTADOS.APROBADA)
      .reduce((total, asig) => total + asig.creditos, 0);
  }

  obtenerAsignaturasPorCodigo(code) {
    return this.asignaturas.find((asig) => asig.codigo === code);
  }

  obtenerAsignaturasPorSemestre(nroSemestre) {
    return this.asignaturas.filter((asig) => asig.semestre === nroSemestre);
  }

  aprobarAsignatura(code) {
    const materia = this.obtenerAsignaturasPorCodigo(code);
    if (!materia) return "La asignatura no se encuentra.";

    // LÓGICA TOGGLE (Desaprobar)
    if (materia.estado === ESTADOS.APROBADA) {
        materia.estado = ESTADOS.PENDIENTE;
        localStorage.removeItem(code);
        this.actualizarMalla(); // Re-evaluar requisitos
        return materia;
    }

    // REQUISITOS DE CRÉDITOS
    const totalCreditos = this.obtenerTotalCreditos();
    if (materia.creditos_necesarios > totalCreditos) {
      alert(`Necesitas ${materia.creditos_necesarios} créditos. Tienes ${totalCreditos}.`);
      return "Créditos insuficientes.";
    }

    // REQUISITOS DE RAMOS
    if (materia.prerrequisitos?.length > 0) {
      const requisitosCumplidos = materia.prerrequisitos.every((codigoPre) => {
        const pre = this.obtenerAsignaturasPorCodigo(codigoPre);
        return pre && pre.estado === ESTADOS.APROBADA;
      });

      if (!requisitosCumplidos) {
        alert("No cumples con los prerrequisitos necesarios.");
        return "Faltan prerrequisitos.";
      }
    }

    // APROBAR Y GUARDAR
    materia.estado = ESTADOS.APROBADA;
    localStorage.setItem(code, ESTADOS.APROBADA);
    this.actualizarMalla(); // Desbloquear siguientes ramos visualmente
    
    return materia;
  }

  actualizarMalla() {
    const creditosActuales = this.obtenerTotalCreditos();

    this.asignaturas.forEach((asig) => {
      if (asig.estado === ESTADOS.APROBADA) return;

      const tieneCreditos = creditosActuales >= asig.creditos_necesarios;
      const tieneRamos = asig.prerrequisitos.every((cod) => {
        const p = this.obtenerAsignaturasPorCodigo(cod);
        return p && p.estado === ESTADOS.APROBADA;
      });

      // Si no cumple, puedes usar ESTADOS.BLOQUEADA o similar si tu entidad lo permite
      if (!(tieneCreditos && tieneRamos)) {
          // Aquí puedes decidir si dejarlo PENDIENTE o cambiarle el color con una clase CSS
      }
    });
  }
}