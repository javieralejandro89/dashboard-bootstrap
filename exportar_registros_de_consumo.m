% Crear un arreglo de estructuras con datos de consumo
datos = [
    struct('id', 1, 'tipo', 'Electricidad', 'valor', 320, 'unidad', 'kWh', 'fecha', '2025-05-09');
    struct('id', 2, 'tipo', 'Agua', 'valor', 100, 'unidad', 'm³', 'fecha', '2025-05-09');
    struct('id', 3, 'tipo', 'Internet', 'valor', 50, 'unidad', 'GB', 'fecha', '2025-05-09')
];

% Convertir a formato JSON
jsonStr = jsonencode(datos);

% Guardar en un archivo JSON
fid = fopen('datos.json', 'w');
fwrite(fid, jsonStr, 'char');
fclose(fid);
exportar_json
