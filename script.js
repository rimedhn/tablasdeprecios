// --- Data de Precios Base (siempre en Lempiras HNL) ---
const dataSucursales = [
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

// --- Tasas de Conversión (Base: HNL Lempira) ---
const EXCHANGE_RATES = {
    HNL: { rate: 1, symbol: 'L ', locale: 'es-HN' },
    USD: { rate: 1 / 24.80, symbol: '$ ', locale: 'en-US' }, // 1 HNL ≈ 0.0403 USD
    SVC: { rate: 1 / 2.85, symbol: 'C ', locale: 'es-SV' },   // 1 HNL ≈ 0.35 SVC (1 USD = 8.75 SVC -> 1 HNL = 8.75/24.80 = 0.35 SVC)
    GTQ: { rate: 1 / 3.19, symbol: 'Q ', locale: 'es-GT' }    // 1 HNL ≈ 0.31 GTQ
};

let activePlanType = 'sucursal'; 
let activeCurrency = 'HNL';

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
const currencySelect = document.getElementById('currency-select');


// Función de formato de moneda y conversión
const formatPrice = (priceHNL) => {
    const currencyInfo = EXCHANGE_RATES[activeCurrency];
    // Convertir de HNL a la moneda seleccionada
    const convertedPrice = priceHNL * currencyInfo.rate;
    
    // Formatear el precio con el símbolo y separadores de miles/decimales
    return `${currencyInfo.symbol}${convertedPrice.toLocaleString(currencyInfo.locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// --- Funciones para Tablas Completas ---
function renderFullTables() {
    const renderTable = (data, tableId, keyLabel, otherKeyLabel) => {
        const table = document.getElementById(tableId);
        if (!table) return;

        let html = '<thead><tr>';
        html += `<th>${keyLabel}</th><th>Usuarios Incluidos</th><th>Mensual (${activeCurrency})</th><th>Anual (${activeCurrency}) (Ahorro)</th><th>Implementación (${activeCurrency})</th></tr></thead><tbody>`;

        data.forEach(item => {
            const principal = item[keyLabel.toLowerCase().split(' ')[0]];

            html += `<tr>
                <td>${principal}</td>
                <td>${keyLabel.includes('Sucursal') ? item.users : item.users}</td>
                <td>${formatPrice(item.mens)}</td>
                <td>${formatPrice(item.anual)}</td>
                <td>${formatPrice(item.imp)}</td>
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
window.toggleTables = toggleTables;

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

        if (quantity < 1 || quantity > 10) {
            rangeInput.value = 1;
            quantity = 1;
            data = dataSucursales.find(item => item.suc === 1);
        }

        userQuantityDisplay.textContent = `${data.users} ${otherUnitText}`;
        planQuantityDisplay.textContent = `${quantity} ${unitText}${quantity > 1 ? 'es' : ''}`;
        
    } else { 
        data = dataUsuarios.find(item => item.users === quantity);
        labelText = 'Usuarios';
        unitText = 'Usuario';
        otherUnitText = 'Sucursal';
        iconClass = 'fas fa-user-tag';
        rangeInput.max = 12;
        rangeInput.min = 3;

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
    document.querySelector('.price-card .icon').className = `icon ${iconClass}`;
    
    // Actualizar precios CON conversión
    monthlyDisplay.textContent = formatPrice(data.mens);
    annualDisplay.textContent = formatPrice(data.anual);
    implementacionDisplay.textContent = formatPrice(data.imp);

    // Renderizar tablas completas de nuevo para reflejar el cambio de moneda
    renderFullTables();

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

// 1. Evento de cambio de moneda
currencySelect.addEventListener('change', (e) => {
    activeCurrency = e.target.value;
    updatePriceUI();
});

// 2. Alternar entre Sucursal y Usuario
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

// 3. Evento del Slider (Rango)
rangeInput.addEventListener('input', updatePriceUI);

// 4. Evento del Toggle de Facturación (Mensual/Anual)
billingSwitch.addEventListener('change', updatePriceUI);

// Inicializar la UI al cargar la página
window.onload = updatePriceUI;
