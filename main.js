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

            // Dentro de asignaturas.forEach(asig => { ... })
            const areaLimpia = asig.area.toLowerCase()
                .normalize("NFD").replace(/[\u0300-\u036f]/g, "") 
                .replace(/\s+/g, ''); // Solo quitamos espacios y tildes

            card.className = `card-asignatura area-${areaLimpia}`;
            
            card.innerHTML = `
                <div class="info-materia">
                    <strong>${asig.nombre}</strong>
                    <small>${asig.codigo} | ${asig.creditos} SCT</small>
                </div>
                <span class="badge badge-${asig.estado.toLowerCase()}">${asig.estado}</span>
            `;

            card.onclick = () => {
                if (asig.estado.toLowerCase() === 'aprobada') return;

                const resultado = service.aprobarAsignatura(asig.codigo);
                
                if (typeof resultado === 'string') {
                    alert(`⚠️ ${resultado}`);
                } else {
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