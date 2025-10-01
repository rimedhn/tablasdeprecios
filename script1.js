// Definición de las Tablas de Precios (Data de la imagen)
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

let activePlanType = 'sucursal'; // Estado inicial: 'sucursal' o 'usuario'

// Obtener elementos del DOM
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
const planName = document.getElementById('plan-name');
const userFeature = document.querySelector('.features li:nth-child(4)'); // El 4to li es el de usuarios

// Función de formato de moneda (Lempiras)
const formatPrice = (price) => `L ${price.toLocaleString('es-HN', { minimumFractionDigits: 2 })}`;

// --- Función Principal de Actualización de UI ---
function updatePriceUI() {
    let quantity = parseInt(rangeInput.value);
    let data;
    let labelText;
    let quantityKey;
    let unitText;

    if (activePlanType === 'sucursal') {
        // Encontrar los datos de sucursal. Los valores del slider van del 1 al 10.
        data = dataSucursales.find(item => item.suc === quantity);
        labelText = 'Sucursales';
        quantityKey = 'suc';
        unitText = 'Sucursal';
        rangeInput.max = 10;
        
        // Actualizar la característica de usuarios para el plan de Sucursales
        userFeature.innerHTML = `<i class="fas fa-users"></i> Incluye hasta **${data.users} Usuarios**`;

    } else { // activePlanType === 'usuario'
        // Encontrar los datos de usuario. Los valores del slider van del 3 al 12.
        data = dataUsuarios.find(item => item.users === quantity);
        labelText = 'Usuarios';
        quantityKey = 'users';
        unitText = 'Usuario';
        rangeInput.max = 12;
        rangeInput.min = 3; 

        // Actualizar la característica de usuarios para el plan de Usuarios
        userFeature.innerHTML = `<i class="fas fa-users"></i> Licencia para **${data.users} Usuarios**`;
    }

    // Actualizar todos los elementos
    rangeValueSpan.textContent = quantity;
    rangeLabel.textContent = `${labelText} (${quantity}):`;
    planName.textContent = `Plan ${quantity} ${labelText}`;
    planQuantityDisplay.textContent = `${quantity} ${unitText}${quantity > 1 ? 'es' : ''}`;
    
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
    rangeInput.value = 1; // Resetear a un valor inicial válido
    updatePriceUI();
});

document.getElementById('toggle-usuario').addEventListener('click', () => {
    activePlanType = 'usuario';
    document.getElementById('toggle-sucursal').classList.remove('active');
    document.getElementById('toggle-usuario').classList.add('active');
    rangeInput.min = 3; 
    rangeInput.value = 3; // Resetear a un valor inicial válido
    updatePriceUI();
});

// 2. Evento del Slider (Rango)
rangeInput.addEventListener('input', updatePriceUI);

// 3. Evento del Toggle de Facturación (Mensual/Anual)
billingSwitch.addEventListener('change', updatePriceUI);

// Inicializar la UI con los valores por defecto
updatePriceUI();
