import { MallaService } from './src/services/malla.service.js';

const service = new MallaService();

function renderizarMalla() {
    const container = document.getElementById('malla-vertical');
    const creditosSpan = document.getElementById('total-creditos');
    
    if (!container) return;
    container.innerHTML = '';
    
    if (creditosSpan) {
        creditosSpan.innerText = service.obtenerTotalCreditos();
    }

    // Generamos las 10 columnas de los semestres
    for (let i = 1; i <= 10; i++) {
        const asignaturas = service.obtenerAsignaturasPorSemestre(i);
        
        const seccion = document.createElement('section');
        seccion.className = 'semestre-seccion';
        seccion.innerHTML = `<h2>S${i}</h2>`;

        asignaturas.forEach(asig => {
            const card = document.createElement('div');

            // Limpieza de área para el color CSS
            const areaLimpia = asig.area.toLowerCase()
                .normalize("NFD").replace(/[\u0300-\u036f]/g, "") 
                .replace(/\s+/g, ''); 

            // DETERMINAR ESTADO VISUAL
            const esAprobada = asig.estado.toLowerCase() === 'aprobada';
            
            // Añadimos la clase 'card-aprobada' para el brillo (glow) si está aprobada
            card.className = `card-asignatura area-${areaLimpia} ${esAprobada ? 'card-aprobada' : ''}`;
            
            card.innerHTML = `
                <div class="info-materia">
                    <strong>${asig.nombre}</strong>
                    <small>${asig.codigo} | ${asig.creditos} SCT</small>
                </div>
                <span class="badge badge-${asig.estado.toLowerCase()}">${asig.estado}</span>
            `;

            card.onclick = () => {
                // Quitamos el 'return' que había aquí para que permita desmarcar
                const resultado = service.aprobarAsignatura(asig.codigo);
                
                // Si el servicio devuelve un texto, es un error de requisitos (créditos o pre-requisitos)
                if (typeof resultado === 'string') {
                    alert(`⚠️ ${resultado}`);
                } else {
                    // Si todo sale bien, actualizamos la lógica y refrescamos la pantalla
                    service.actualizarMalla();
                    renderizarMalla();
                }
            };

            seccion.appendChild(card);
        });

        container.appendChild(seccion);
    }
}

window.addEventListener('DOMContentLoaded', renderizarMalla);