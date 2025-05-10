const API_URL = 'http://localhost:3001/consumo';

// Obtener datos
export async function obtenerConsumo() {
  const res = await fetch(API_URL);
  return await res.json();
}

// Agregar nuevo registro
export async function agregarConsumo(nuevoDato) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(nuevoDato)
  });
  return await res.json();
}
