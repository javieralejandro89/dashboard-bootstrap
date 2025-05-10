// ===============================
// Variables globales
// ===============================
let consumoChart = null;

// ===============================
// Ejecutar cuando el DOM esté cargado
// ===============================
document.addEventListener('DOMContentLoaded', function () {
  if (document.getElementById('miGrafico')) {
    configurarGraficoDashboard();
  }

  if (document.getElementById('aguaChart')) {
    configurarGraficosHistorial();
  }

  if (document.getElementById('contactForm')) {
    configurarFormularioContacto();
  }

  if (document.getElementById('formulario-consumo')) {
    configurarFormularioConsumo();
  }

  if (document.querySelector("#graficoEnergia")) {
    configurarGraficoTiempoReal();
  }
  if (document.querySelector("#tabla-consumo")) {
    cargarDatosDesdeAPI(); // ✅ Aquí cargas la tabla desde JSON Server
  }
  if (document.getElementById('form-agregar-consumo')) {
    configurarFormularioAgregarConsumo();
  }
  
});

let datosConsumo = []; // Variable global para almacenar los datos

function cargarDatosDesdeAPI(idAResaltar = null) {
  fetch('http://localhost:3001/consumo')
    .then(response => response.json())
    .then(data => {
      datosConsumo = data; // Actualiza la variable global con los datos de la API
      const tbody = document.querySelector('#tabla-consumo tbody');
      tbody.innerHTML = ''; // Limpiar la tabla antes de agregar los nuevos datos

      data.forEach(item => {
        const fila = document.createElement('tr');
        
        fila.innerHTML = `
          <td>${item.id}</td>
          <td>${item.tipo}</td>
          <td>${item.valor}</td>
          <td>${item.unidad}</td>
          <td>${item.fecha}</td>
          <td>
            <button class="btn btn-warning btn-sm editar-btn" data-id="${item.id}">✏️ Editar</button>
            <button class="btn btn-danger btn-sm eliminar-btn" data-id="${item.id}">🗑️ Eliminar</button>
          </td>
        `;

        // Si es el ID editado, resáltalo con el color azul
        if (item.id === idAResaltar) {
          fila.classList.add('table-actualizado');
          setTimeout(() => {
            fila.classList.remove('table-actualizado');
          }, 2000); // Resaltar durante 2 segundos
        }

        tbody.appendChild(fila);
      });

      // ✅ Agregar eventos a botones eliminar
      document.querySelectorAll('.eliminar-btn').forEach(boton => {
        boton.addEventListener('click', function () {
          const id = this.getAttribute('data-id');
          eliminarConsumo(id);
        });
      });

      // ✅ Agregar eventos a botones editar
      document.querySelectorAll('.editar-btn').forEach(boton => {
        boton.addEventListener('click', function () {
          const id = this.getAttribute('data-id');
          const registro = datosConsumo.find(item => item.id == id);

          if (registro) {
            // Rellenar el formulario con los datos existentes
            document.getElementById('nuevo-tipo').value = registro.tipo;
            // Disparar el evento de cambio para que cargue las unidades correctas
            const eventoCambio = new Event('change');
            document.getElementById('nuevo-tipo').dispatchEvent(eventoCambio);

            // Esperar un momento a que se carguen las opciones (por seguridad)
            setTimeout(() => {
              document.getElementById('nueva-unidad').value = registro.unidad;
            }, 100); // 100 ms suele ser suficiente

            document.getElementById('nuevo-valor').value = registro.valor;
            document.getElementById('fecha').value = registro.fecha;

            // Guardar ID temporalmente para actualizar después
            document.getElementById('form-agregar-consumo').dataset.editandoId = id;

            // Cambiar texto del botón de enviar a 'Actualizar'
            document.querySelector('#form-agregar-consumo button[type="submit"]').textContent = 'Actualizar';
          }
        });
      });
    })
    .catch(error => console.error('Error al cargar los datos de la API:', error));
}

function eliminarConsumo(id) {
  if (!confirm('¿Estás seguro de que deseas eliminar este registro?')) return;

  fetch(`http://localhost:3001/consumo/${id}`, {
    method: 'DELETE'
  })
    .then(res => {
      if (!res.ok) throw new Error(`Error al eliminar el registro con ID: ${id}`);
      alert(`Registro con ID ${id} eliminado correctamente`);
      cargarDatosDesdeAPI(); // Recargar los datos y tabla
    })
    .catch(err => console.error('Error al eliminar el consumo:', err));
}

function configurarFormularioAgregarConsumo() {
  document.getElementById('form-agregar-consumo').addEventListener('submit', async function (e) {
    e.preventDefault();

    const tipo = document.getElementById('nuevo-tipo').value;
    const valor = parseFloat(document.getElementById('nuevo-valor').value);
    const unidad = document.getElementById('nueva-unidad').value;
    const fecha = document.getElementById('fecha').value;
    const editandoId = this.dataset.editandoId;

    if (!tipo || isNaN(valor) || !unidad || !fecha) {
      alert('Por favor, completa todos los campos correctamente.');
      return;
    }

    try {
      if (editandoId) {
        // Modo editar (actualizar un registro existente)
        const res = await fetch(`http://localhost:3001/consumo/${editandoId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: parseInt(editandoId), tipo, valor, unidad, fecha })
        });
        const result = await res.json();
        
        alert('Registro actualizado correctamente.');

        // Esperar un momento antes de recargar los datos
        setTimeout(() => {
          cargarDatosDesdeAPI(parseInt(editandoId)); // Resaltar la fila modificada
        }, 500); // Tiempo de espera de 500ms

        // Limpiar el formulario y restablecerlo
        this.reset();
        delete this.dataset.editandoId;
        document.querySelector('#form-agregar-consumo button[type="submit"]').textContent = 'Agregar';
      } else {
        // Modo agregar (crear nuevo registro)
        // Obtener los datos actuales para calcular el siguiente ID
        const res = await fetch('http://localhost:3001/consumo');
        const data = await res.json();

        // Calcular el nuevo ID
        const maxId = data.length > 0 ? Math.max(...data.map(item => item.id || 0)) : 0;
        const nuevoId = maxId + 1; // Asegura que el ID sea consecutivo

        const nuevoConsumo = {
          id: nuevoId,
          tipo,
          valor,
          unidad,
          fecha
        };

        const response = await fetch('http://localhost:3001/consumo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(nuevoConsumo)
        });

        const resultado = await response.json();

        // Agregar el nuevo consumo a la tabla
        const tbody = document.querySelector('#tabla-consumo tbody');
        const fila = document.createElement('tr');
        fila.innerHTML = `
          <td>${resultado.id}</td>
          <td>${resultado.tipo}</td>
          <td>${resultado.valor}</td>
          <td>${resultado.unidad}</td>
          <td>${resultado.fecha}</td>
        `;
        tbody.appendChild(fila);

        this.reset();
      }
    } catch (err) {
      console.error('Error al agregar o actualizar consumo:', err);
    }
  });

  document.getElementById('nuevo-tipo').addEventListener('change', function () {
    const tipo = this.value;
    const unidadSelect = document.getElementById('nueva-unidad');
    unidadSelect.disabled = false;
    unidadSelect.innerHTML = '';

    if (tipo === 'Agua') {
      unidadSelect.innerHTML = `
        <option value="m³">m³</option>
        <option value="Litros">Litros</option>
      `;
    } else if (tipo === 'Electricidad') {
      unidadSelect.innerHTML = `
        <option value="kWh">kWh</option>
        <option value="Watts">Watts</option>
      `;
    } else if (tipo === 'Internet') {
      unidadSelect.innerHTML = `
        <option value="GB">GB</option>
        <option value="MB">MB</option>
      `;
    } else {
      unidadSelect.innerHTML = `<option value="">Seleccionar unidad</option>`;
      unidadSelect.disabled = true;
    }
  });
}

// Llamar a cargarDatosDesdeAPI para inicializar los datos cuando la página carga
document.addEventListener('DOMContentLoaded', cargarDatosDesdeAPI);

const tipoUnidadMap = {
  Agua: ['m³'],
  Electricidad: ['kWh'],
  Internet: ['GB']
};

const tipoSelect = document.getElementById('nuevo-tipo');
const unidadSelect = document.getElementById('nueva-unidad');

tipoSelect.addEventListener('change', function () {
  const tipoSeleccionado = tipoSelect.value;

  // Limpiar opciones anteriores
  unidadSelect.innerHTML = '';

  if (tipoSeleccionado && tipoUnidadMap[tipoSeleccionado]) {
    unidadSelect.disabled = false;
    tipoUnidadMap[tipoSeleccionado].forEach(unidad => {
      const option = document.createElement('option');
      option.value = unidad;
      option.textContent = unidad;
      unidadSelect.appendChild(option);
    });
  } else {
    unidadSelect.disabled = true;
    unidadSelect.innerHTML = '<option value="">Seleccionar unidad</option>';
  }
});




// ===============================
// Gráfico principal del Dashboard
// ===============================
function configurarGraficoDashboard() {
  const ctx = document.getElementById('miGrafico').getContext('2d');
  consumoChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Agua', 'Electricidad', 'Internet'],
      datasets: [{
        label: 'Consumo Mensual',
        data: [250, 560, 350], // Datos iniciales
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
// Gráficos de historial (línea)
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
// Formulario de contacto
// ===============================
function configurarFormularioContacto() {
  const contactForm = document.getElementById('contactForm');

  // Crear alerta flotante
  const successAlert = document.createElement('div');
  successAlert.className = 'alert alert-success position-fixed top-0 end-0 m-3 fade-alert';
  successAlert.style.zIndex = '9999';
  successAlert.innerText = '¡Datos enviados con éxito!';
  document.body.appendChild(successAlert);

  // Preparar sonido
  const successSound = new Audio('sounds/success.mp3');

  contactForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const contactModal = bootstrap.Modal.getInstance(document.getElementById('contactModal'));
    if (contactModal) {
      contactModal.hide();
    }

    contactForm.reset();

    // Mostrar alerta flotante
    successAlert.classList.add('show');

    // Reproducir sonido
    successSound.play();

    // Ocultar después de 3 segundos
    setTimeout(() => {
      successAlert.classList.remove('show');
    }, 3000);
  });
}

// ===============================
// Formulario para actualizar consumo
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

    // Actualizar tarjetas
    consumoAgua.innerHTML = `${agua} m³`;
    consumoElectricidad.innerHTML = `${electricidad} kWh`;
    consumoInternet.innerHTML = `${internet} GB`;

    // Actualizar gráfico
    if (consumoChart) {
      consumoChart.data.datasets[0].data = [agua, electricidad, internet];
      consumoChart.update();
    }

    alert('¡Dashboard actualizado correctamente!');
    formulario.reset();
  });
}

// ===============================
// Gráfico en tiempo real (ApexCharts)
// ===============================
function configurarGraficoTiempoReal() {
  const chartOptions = {
    chart: {
      type: 'line',
      height: 350,
      animations: {
        enabled: true,
        easing: 'linear',
        dynamicAnimation: {
          speed: 1000
        }
      }
    },
    series: [{
      name: 'kWh',
      data: []
    }],
    xaxis: {
      type: 'datetime',
      range: 60000
    },
    yaxis: {
      max: 1000,
      title: { text: 'Consumo (kWh)' }
    }
  };

  const chart = new ApexCharts(document.querySelector("#graficoEnergia"), chartOptions);
  chart.render();

  const alerta = document.getElementById("alertaEnergia");

  setInterval(() => {
    const now = new Date().getTime();
    const valor = Math.floor(Math.random() * 1000);

    chart.appendData([{
      data: [[now, valor]]
    }]);

    if (valor > 800) {
      alerta.classList.remove("d-none");
    } else {
      alerta.classList.add("d-none");
    }
  }, 1000);
}

function cargarDesdeJSONLocal() {
  fetch('datos.json')
    .then(response => {
      if (!response.ok) throw new Error('No se pudo cargar datos.json');
      return response.json();
    })
    .then(data => {
      console.log('Datos importados desde MATLAB:', data);
      datosConsumo = data; // reemplaza la variable global para editar/eliminar

      const tbody = document.querySelector('#tabla-consumo tbody');
      tbody.innerHTML = ''; // Limpia la tabla

      data.forEach(item => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
          <td>${item.id}</td>
          <td>${item.tipo}</td>
          <td>${item.valor}</td>
          <td>${item.unidad}</td>
          <td>${item.fecha}</td>
          <td>
            <button class="btn btn-warning btn-sm editar-btn" data-id="${item.id}">✏️ Editar</button>
            <button class="btn btn-danger btn-sm eliminar-btn" data-id="${item.id}">🗑️ Eliminar</button>
          </td>
        `;
        tbody.appendChild(fila);
      });

      // Reasignar eventos a botones (como en cargarDatosDesdeAPI)
      document.querySelectorAll('.editar-btn').forEach(boton => {
        boton.addEventListener('click', function () {
          const id = this.getAttribute('data-id');
          const registro = datosConsumo.find(item => item.id == id);
          if (registro) {
            document.getElementById('nuevo-tipo').value = registro.tipo;
            document.getElementById('nuevo-tipo').dispatchEvent(new Event('change'));
            setTimeout(() => {
              document.getElementById('nueva-unidad').value = registro.unidad;
            }, 100);
            document.getElementById('nuevo-valor').value = registro.valor;
            document.getElementById('fecha').value = registro.fecha;
            document.getElementById('form-agregar-consumo').dataset.editandoId = id;
            document.querySelector('#form-agregar-consumo button[type="submit"]').textContent = 'Actualizar';
          }
        });
      });

      document.querySelectorAll('.eliminar-btn').forEach(boton => {
        boton.addEventListener('click', function () {
          alert('Esta opción está deshabilitada para datos cargados localmente.');
        });
      });

    })
    .catch(error => console.error('Error al leer datos desde JSON:', error));
}

document.getElementById('btn-exportar-csv').addEventListener('click', function () {
  if (datosConsumo.length === 0) {
    alert('No hay datos para exportar.');
    return;
  }

  // Encabezados CSV
  const encabezados = ['ID', 'Tipo', 'Valor', 'Unidad', 'Fecha'];
  
  // Filas
  const filas = datosConsumo.map(item => [
    item.id,
    item.tipo,
    item.valor,
    item.unidad,
    item.fecha
  ]);

  // Unir encabezados y filas
  const contenidoCSV = [encabezados, ...filas]
    .map(fila => fila.map(valor => `"${valor}"`).join(','))
    .join('\n');

  // Crear Blob y descargar
  const blob = new Blob([contenidoCSV], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'consumo_exportado.csv';
  a.click();
  URL.revokeObjectURL(url);
});
function marcarError(id, condicion) {
  const campo = document.getElementById(id);
  if (condicion) {
    campo.classList.add('is-invalid');
  } else {
    campo.classList.remove('is-invalid');
  }
}



