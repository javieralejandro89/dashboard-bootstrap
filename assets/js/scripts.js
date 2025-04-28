// script.js
function configurarGraficosDashboard() {
    const ctx = document.getElementById('consumoChart').getContext('2d');
    const consumoChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Agua', 'Electricidad', 'Internet'],
        datasets: [{
          label: 'Consumo Mensual',
          data: [250, 1200, 350],
          backgroundColor: [
            'rgba(13, 110, 253, 0.7)',   // Azul para Agua
            'rgba(255, 193, 7, 0.7)',     // Amarillo para Electricidad
            'rgba(25, 135, 84, 0.7)'      // Verde para Internet
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
          y: {
            beginAtZero: true
          }
        }
      }
    });
}
function configurarGraficosHistorial() {
  const ctxAgua = document.getElementById('aguaChart').getContext('2d');
  const aguaChart = new Chart(ctxAgua, {
    type: 'line', // Gráfico de líneas
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
  const electricidadChart = new Chart(ctxElectricidad, {
    type: 'line', // Gráfico de líneas
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
  const internetChart = new Chart(ctxInternet, {
    type: 'line', // Gráfico de líneas
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

// Detectar la página actual y ejecutar la función correspondiente
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('consumoChart')) {
      configurarGraficosDashboard(); // Página principal
    }
  
    if (document.getElementById('aguaChart')) {
      configurarGraficosHistorial(); // Página de historial
    }
  });