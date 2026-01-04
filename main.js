import { MallaService } from './services/malla.service.js';

const service = new MallaService();

// Prueba 1: Ver estado inicial de un ramo con prerrequisitos
console.log("--- ESTADO INICIAL ---");
const calculoDiferencial = service.obtenerAsignaturasPorCodigo("220144");
console.log(`Materia: ${calculoDiferencial.nombre} | Estado: ${calculoDiferencial.estado}`);

// Prueba 2: Intentar aprobarlo sin cumplir el requisito (Álgebra 220143)
console.log("\n--- INTENTO DE APROBACIÓN SIN REQUISITOS ---");
const respuestaError = service.aprobarAsignatura("220144");
console.log("Resultado esperado (Error):", respuestaError);

// Prueba 3: Aprobar el requisito y actualizar la malla
console.log("\n--- APROBANDO REQUISITO (ÁLGEBRA) ---");
service.aprobarAsignatura("220143");
service.actualizarMalla(); // Tu función de mantenimiento
console.log(`Créditos Totales: ${service.obtenerTotalCreditos()}`);

// Prueba 4: Ver si Cálculo Diferencial cambió de NCR a PENDIENTE automáticamente
console.log("Estado de Cálculo Diferencial tras actualizar:", service.obtenerAsignaturasPorCodigo("220144").estado);

// Prueba 5: Aprobar ahora que sí se puede
console.log("\n--- INTENTO DE APROBACIÓN CON REQUISITOS CUMPLIDOS ---");
const exito = service.aprobarAsignatura("220144");
console.log("¡Éxito!", exito.nombre, "ahora está", exito.estado);