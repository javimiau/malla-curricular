import { MallaService } from './services/MallaService.js';

// 1. Inicializamos el servicio
const malla = new MallaService();

console.log("--- INICIO DE LA PRUEBA ---");
console.log(`Créditos iniciales: ${malla.obtenerTotalCreditos()}`);

// 2. Intento aprobar un ramo con prerrequisitos (debería fallar)
// Código 220144 es Cálculo Diferencial (pide Álgebra 220143)
console.log("\nIntentando aprobar Cálculo Diferencial sin requisitos...");
const resultadoFallo = malla.aprobarAsignatura("220144");
console.log(`Respuesta: ${resultadoFallo}`); 

// 3. Apruebo el requisito
console.log("\nAprobando Álgebra y Trigonometría...");
malla.aprobarAsignatura("220143");
malla.actualizarMalla(); // Actualizamos los estados NCR a PENDIENTE
console.log(`Créditos actuales: ${malla.obtenerTotalCreditos()}`);

// 4. Intento de nuevo el ramo anterior (ahora debería funcionar)
console.log("\nIntentando aprobar Cálculo Diferencial nuevamente...");
const resultadoExito = malla.aprobarAsignatura("220144");
console.log(`Respuesta: ${resultadoExito.nombre} ahora está ${resultadoExito.estado}`);

// 5. Ver qué ramos tengo disponibles ahora
console.log("\nAsignaturas disponibles para cursar ahora:");
const disponibles = malla.obtenerAsignaturasDisponibles();
disponibles.forEach(asig => console.log(`- ${asig.nombre} (Semestre ${asig.semestre})`));