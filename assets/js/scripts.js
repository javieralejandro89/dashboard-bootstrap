// script.js
// ===============================
// Variables globales
// ===============================
let consumoChart = null;

// ===============================
// Inicializar gráficos según la página
// ===============================
document.addEventListener('DOMContentLoaded', function () {
  // Si estamos en la página de Dashboard (que tiene el gráfico principal)
  if (document.getElementById('miGrafico')) {
    configurarGraficoDashboard();
  }

  // Si estamos en la página de Historial (con gráficos de línea)
  if (document.getElementById('aguaChart')) {
    configurarGraficosHistorial();
  }

  // Configurar el formulario de contacto si existe
  if (document.getElementById('contactForm')) {
    configurarFormularioContacto();
  }

  // Configurar el formulario de actualización de consumo
  if (document.getElementById('formulario-consumo')) {
    configurarFormularioConsumo();
  }
});

// ===============================
// Función: Configurar gráfico principal del Dashboard
// ===============================
function configurarGraficoDashboard() {
  const ctx = document.getElementById('miGrafico').getContext('2d');
  consumoChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Agua', 'Electricidad', 'Internet'],
      datasets: [{
        label: 'Consumo Mensual',
        data: [250, 560, 350], // Valores iniciales
        backgroundColor: [
          'rgba(13, 110, 253, 0.7)',
          'rgba(255, 193, 7, 0.7)',
          'rgba(25, 135, 84, 0.7)'
        ],
        borderColor: [
          'rgba(13, 110, 253, 1)',
          'rgba(255, 193, 7, 1)',
          'rgba(25, 135, 84, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: true }
      },
      animation: {
        duration: 2000,
        easing: 'easeOutBounce'
      }
    }
  });
}

// ===============================
// Función: Configurar gráficos de historial
// ===============================
function configurarGraficosHistorial() {
  const ctxAgua = document.getElementById('aguaChart').getContext('2d');
  new Chart(ctxAgua, {
    type: 'line',
    data: {
      labels: ['Enero', 'Febrero', 'Marzo', 'Abril'],
      datasets: [{
        label: 'Consumo de Agua',
        data: [200, 250, 270, 300],
        borderColor: 'rgba(13, 110, 253, 1)',
        fill: false
      }]
    }
  });

  const ctxElectricidad = document.getElementById('electricidadChart').getContext('2d');
  new Chart(ctxElectricidad, {
    type: 'line',
    data: {
      labels: ['Enero', 'Febrero', 'Marzo', 'Abril'],
      datasets: [{
        label: 'Consumo de Electricidad',
        data: [1000, 1200, 1300, 1500],
        borderColor: 'rgba(255, 193, 7, 1)',
        fill: false
      }]
    }
  });

  const ctxInternet = document.getElementById('internetChart').getContext('2d');
  new Chart(ctxInternet, {
    type: 'line',
    data: {
      labels: ['Enero', 'Febrero', 'Marzo', 'Abril'],
      datasets: [{
        label: 'Consumo de Internet',
        data: [300, 350, 400, 450],
        borderColor: 'rgba(25, 135, 84, 1)',
        fill: false
      }]
    }
  });
}

// ===============================
// Función: Configurar formulario de contacto
// ===============================
function configurarFormularioContacto() {
  const contactForm = document.getElementById('contactForm');

  contactForm.addEventListener('submit', function (event) {
    event.preventDefault();

    // Mostrar mensaje de éxito
    document.getElementById('successMessage').style.display = 'block';

    // Ocultar el mensaje de éxito después de 3 segundos y cerrar el modal
    setTimeout(function () {
      document.getElementById('successMessage').style.display = 'none';
      const modal = bootstrap.Modal.getInstance(document.getElementById('contactModal'));
      if (modal) {
        modal.hide();
      }
    }, 3000);
  });
}

// ===============================
// Función: Configurar formulario para actualizar consumo
// ===============================
function configurarFormularioConsumo() {
  const formulario = document.getElementById('formulario-consumo');
  
  const consumoAgua = document.getElementById('consumo-agua');
  const consumoElectricidad = document.getElementById('consumo-electricidad');
  const consumoInternet = document.getElementById('consumo-internet');

  formulario.addEventListener('submit', function (e) {
    e.preventDefault();

    const agua = parseFloat(document.getElementById('agua').value);
    const electricidad = parseFloat(document.getElementById('electricidad').value);
    const internet = parseFloat(document.getElementById('internet').value);

    if (isNaN(agua) || agua < 0 || isNaN(electricidad) || electricidad < 0 || isNaN(internet) || internet < 0) {
      alert('Por favor, ingrese valores válidos y positivos.');
      return;
    }

    // Actualizar las tarjetas
    consumoAgua.innerHTML = `${agua} m³`;
    consumoElectricidad.innerHTML = `${electricidad} kWh`;
    consumoInternet.innerHTML = `${internet} GB`;

    // Actualizar el gráfico principal
    if (consumoChart) {
      consumoChart.data.datasets[0].data = [agua, electricidad, internet];
      consumoChart.update();
    }

    alert('¡Dashboard actualizado correctamente!');
    formulario.reset();
  });
}
document.addEventListener('DOMContentLoaded', function () {
  const contactForm = document.getElementById('contactForm');

  // Crear alerta flotante
  const successAlert = document.createElement('div');
  successAlert.className = 'alert alert-success position-fixed top-0 end-0 m-3 fade-alert';
  successAlert.style.zIndex = '9999';
  successAlert.innerText = '¡Datos enviados con éxito!';
  document.body.appendChild(successAlert);

  // Preparar sonido
  const successSound = new Audio('assets/sounds/success.mp3');

  contactForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const contactModal = bootstrap.Modal.getInstance(document.getElementById('contactModal'));
    contactModal.hide();
    contactForm.reset();

    // Mostrar alerta
    successAlert.classList.add('show');

    // Reproducir sonido
    successSound.play();

    // Ocultar después de 3 segundos
    setTimeout(() => {
      successAlert.classList.remove('show');
    }, 3000);
  });
});
