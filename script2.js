// --- Data de Precios con Descuento Anual Correcto (Ahorro de 2 Meses) ---
const dataSucursales = [
    // El precio anual es 10 veces el mensual (1250 * 10 = 12500)
    { suc: 1, mens: 1250.00, anual: 12500.00, imp: 6990.00, users: 3 },
    { suc: 2, mens: 2500.00, anual: 25000.00, imp: 10485.00, users: 6 },
    { suc: 3, mens: 3750.00, anual: 37500.00, imp: 15727.50, users: 9 },
    { suc: 4, mens: 5000.00, anual: 50000.00, imp: 20970.00, users: 12 },
    { suc: 5, mens: 6250.00, anual: 62500.00, imp: 26212.50, users: 15 },
    { suc: 6, mens: 7500.00, anual: 75000.00, imp: 31455.00, users: 18 },
    { suc: 7, mens: 8750.00, anual: 87500.00, imp: 36697.50, users: 21 },
    { suc: 8, mens: 10000.00, anual: 100000.00, imp: 41940.00, users: 24 },
    { suc: 9, mens: 11250.00, anual: 112500.00, imp: 47182.50, users: 27 },
    { suc: 10, mens: 12500.00, anual: 125000.00, imp: 52425.00, users: 30 }
];

const dataUsuarios = [
    // El precio anual es 10 veces el mensual 
    { users: 3, mens: 1250.00, anual: 12500.00, imp: 6990.00, suc: 1 },
    { users: 4, mens: 1550.00, anual: 15500.00, imp: 6990.00, suc: 1 },
    { users: 5, mens: 1850.00, anual: 18500.00, imp: 6990.00, suc: 1 },
    { users: 6, mens: 2150.00, anual: 21500.00, imp: 6990.00, suc: 1 },
    { users: 7, mens: 2450.00, anual: 24500.00, imp: 6990.00, suc: 1 },
    { users: 8, mens: 2750.00, anual: 27500.00, imp: 6990.00, suc: 1 },
    { users: 9, mens: 3050.00, anual: 30500.00, imp: 6990.00, suc: 1 },
    { users: 10, mens: 3350.00, anual: 33500.00, imp: 6990.00, suc: 1 },
    { users: 11, mens: 3650.00, anual: 36500.00, imp: 6990.00, suc: 1 },
    { users: 12, mens: 3950.00, anual: 39500.00, imp: 6990.00, suc: 1 }
];

let activePlanType = 'sucursal'; 

// Elementos del DOM
const rangeInput = document.getElementById('quantity-range');
const rangeLabel = document.getElementById('range-label');
const rangeValueSpan = document.getElementById('range-value');
const billingSwitch = document.getElementById('billing-switch');
const monthlyDisplay = document.getElementById('price-mensual');
const annualDisplay = document.getElementById('price-anual');
const annualPriceContainer = document.querySelector('.annual-price-display');
const monthlyPriceContainer = document.querySelector('.base-price:not(.annual-price-display)');
const implementacionDisplay = document.getElementById('price-implementacion');
const planQuantityDisplay = document.getElementById('plan-quantity-display');
const userQuantityDisplay = document.getElementById('user-quantity-display');
const planName = document.getElementById('plan-name');
const annualSaving = document.getElementById('annual-saving');
const ctaButton = document.querySelector('.cta-button');

// Función de formato de moneda (Lempiras)
const formatPrice = (price) => `L ${price.toLocaleString('es-HN', { minimumFractionDigits: 2 })}`;

// --- Funciones para Tablas Completas ---
function renderFullTables() {
    const renderTable = (data, tableId, keyLabel, otherKeyLabel) => {
        const table = document.getElementById(tableId);
        if (!table) return;

        let html = '<thead><tr>';
        html += `<th>${keyLabel}</th><th>Usuarios Incluidos</th><th>Mensual (L)</th><th>Anual (L) (Ahorro)</th><th>Implementación (L)</th></tr></thead><tbody>`;

        data.forEach(item => {
            const principal = item[keyLabel.toLowerCase().split(' ')[0]];
            const other = item[otherKeyLabel.toLowerCase().split(' ')[0]];
            const monthly = formatPrice(item.mens);
            const annual = formatPrice(item.anual);
            const imp = formatPrice(item.imp);

            const principalValue = keyLabel.includes('Sucursal') ? principal : other;
            const secondaryValue = keyLabel.includes('Sucursal') ? other : principal;

            html += `<tr>
                <td>${principal}</td>
                <td>${keyLabel.includes('Sucursal') ? item.users : item.users}</td>
                <td>${monthly}</td>
                <td>${annual}</td>
                <td>${imp}</td>
            </tr>`;
        });

        html += '</tbody>';
        table.innerHTML = html;
    };

    renderTable(dataSucursales, 'sucursal-table', 'Sucursales', 'Usuarios');
    renderTable(dataUsuarios, 'usuario-table', 'Usuarios', 'Sucursales');
}

function toggleTables() {
    const content = document.getElementById('full-tables-content');
    content.classList.toggle('expanded');
    const button = document.querySelector('.expand-btn');

    if (content.classList.contains('expanded')) {
        button.innerHTML = '<i class="fas fa-times-circle"></i> Ocultar Tablas de Precios';
    } else {
        button.innerHTML = '<i class="fas fa-table"></i> Ver Tablas de Precios Completas (Detalle)';
    }
}
window.toggleTables = toggleTables; // Hacer la función accesible desde el HTML

// --- Función Principal de Actualización de UI ---
function updatePriceUI() {
    let quantity = parseInt(rangeInput.value);
    let data;
    let labelText;
    let unitText;
    let otherUnitText;
    let iconClass;

    if (activePlanType === 'sucursal') {
        data = dataSucursales.find(item => item.suc === quantity);
        labelText = 'Sucursales';
        unitText = 'Sucursal';
        otherUnitText = 'Usuarios';
        iconClass = 'fas fa-building';
        rangeInput.max = 10;
        rangeInput.min = 1;

        // Asegurar que el slider esté en un valor válido al cambiar el tipo de plan
        if (quantity < 1 || quantity > 10) {
            rangeInput.value = 1;
            quantity = 1;
            data = dataSucursales.find(item => item.suc === 1);
        }

        userQuantityDisplay.textContent = `${data.users} ${otherUnitText}`;
        planQuantityDisplay.textContent = `${quantity} ${unitText}${quantity > 1 ? 'es' : ''}`;
        
    } else { // activePlanType === 'usuario'
        data = dataUsuarios.find(item => item.users === quantity);
        labelText = 'Usuarios';
        unitText = 'Usuario';
        otherUnitText = 'Sucursal';
        iconClass = 'fas fa-user-tag';
        rangeInput.max = 12;
        rangeInput.min = 3;

        // Asegurar que el slider esté en un valor válido al cambiar el tipo de plan
        if (quantity < 3 || quantity > 12) {
            rangeInput.value = 3;
            quantity = 3;
            data = dataUsuarios.find(item => item.users === 3);
        }

        userQuantityDisplay.textContent = `${quantity} ${unitText}${quantity > 1 ? 's' : ''}`;
        planQuantityDisplay.textContent = `${data.suc} ${otherUnitText}${data.suc > 1 ? 'es' : ''}`;
    }

    // Actualizar elementos dinámicos
    rangeValueSpan.textContent = quantity;
    rangeLabel.textContent = `${labelText} (${quantity}):`;
    planName.textContent = `Plan ${quantity} ${labelText}`;
    
    // Icono del plan (solo para ejemplo, no cambia)
    document.querySelector('.price-card .icon').className = `icon ${iconClass}`;
    
    monthlyDisplay.textContent = formatPrice(data.mens);
    annualDisplay.textContent = formatPrice(data.anual);
    implementacionDisplay.textContent = formatPrice(data.imp);

    // Ajustar la visibilidad de los precios
    if (billingSwitch.checked) {
        monthlyPriceContainer.style.display = 'none';
        annualPriceContainer.style.display = 'block';
    } else {
        monthlyPriceContainer.style.display = 'block';
        annualPriceContainer.style.display = 'none';
    }
}

// --- Manejo de Eventos ---

// 1. Alternar entre Sucursal y Usuario
document.getElementById('toggle-sucursal').addEventListener('click', () => {
    activePlanType = 'sucursal';
    document.getElementById('toggle-sucursal').classList.add('active');
    document.getElementById('toggle-usuario').classList.remove('active');
    rangeInput.min = 1;
    rangeInput.max = 10;
    rangeInput.value = 1; 
    updatePriceUI();
});

document.getElementById('toggle-usuario').addEventListener('click', () => {
    activePlanType = 'usuario';
    document.getElementById('toggle-sucursal').classList.remove('active');
    document.getElementById('toggle-usuario').classList.add('active');
    rangeInput.min = 3; 
    rangeInput.max = 12;
    rangeInput.value = 3; 
    updatePriceUI();
});

// 2. Evento del Slider (Rango)
rangeInput.addEventListener('input', updatePriceUI);

// 3. Evento del Toggle de Facturación (Mensual/Anual)
billingSwitch.addEventListener('change', updatePriceUI);

// Inicializar la UI al cargar la página
window.onload = () => {
    renderFullTables(); // Cargar los datos en las tablas completas
    updatePriceUI();    // Cargar el plan interactivo por defecto
};
