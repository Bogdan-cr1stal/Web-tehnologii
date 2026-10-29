//Створення масиву з п'ятьма товарами (код, найменування, ціна за одиницю, кількість)
const products = [
    { code: "№-001", name: "Ноутбук Acer", price: 50000, quantity: 2 },
    { code: "№-002", name: "Мишка бездротова", price: 750, quantity: 5 },
    { code: "№-003", name: "Клавіатура механічна", price: 2500, quantity: 3 },
    { code: "№-004", name: "Монітор 27\" IPS", price: 15000, quantity: 2 },
    { code: "№-005", name: "Ігрові навушники", price: 2500, quantity: 4 }
];

let tableHTML = `
    <table>
        <thead>
            <tr>
                <th>Код</th>
                <th>Найменування</th>
                <th class="text-right">Ціна за од. (грн)</th>
                <th class="text-right">Кількість</th>
                <th class="text-right">Сума (грн)</th>
            </tr>
        </thead>
        <tbody>
`;

let grandTotal = 0; // Змінна для підрахунку загальної суми усіх товарів

for (let i = 0; i < products.length; i++) {
    let item = products[i];
    let itemTotal = item.price * item.quantity;
    grandTotal += itemTotal;

    tableHTML += `
        <tr>
            <td>${item.code}</td>
            <td>${item.name}</td>
            <td class="text-right">${item.price.toLocaleString()}</td>
            <td class="text-right">${item.quantity}</td>
            <td class="text-right">${itemTotal.toLocaleString()}</td>
        </tr>
    `;
}

//Додавання рядка "Всього" у кінець таблиці
tableHTML += `
        <tr class="total-row">
            <td colspan="4" class="text-right">Всього до сплати:</td>
            <td class="text-right">${grandTotal.toLocaleString()} грн</td>
        </tr>
    </tbody>
</table>
`;

//Виведення готової таблиці у відповідний блок на вебсторінці
document.getElementById('table-container').innerHTML = tableHTML;