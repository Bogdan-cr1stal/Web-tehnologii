document.getElementById('checkBtn').addEventListener('click', function() {
    //Зчитування значень з полів HTML
    let xMin = parseFloat(document.getElementById('xMin').value);
    let xMax = parseFloat(document.getElementById('xMax').value);
    let yMin = parseFloat(document.getElementById('yMin').value);
    let yMax = parseFloat(document.getElementById('yMax').value);

    let x = parseFloat(document.getElementById('pointX').value);
    let y = parseFloat(document.getElementById('pointY').value);

    let outputDiv = document.getElementById('output');

    //Перевірка чи всі поля заповнені числами
    if (isNaN(xMin) || isNaN(xMax) || isNaN(yMin) || isNaN(yMax) || isNaN(x) || isNaN(y)) {
        outputDiv.innerHTML = `<span style="color: red;">Помилка: заповніть усі поля числами!</span>`;
        return;
    }

    //Автоматичне коригування меж (якщо користувач переплутав місцями min і max)
    let realXMin = Math.min(xMin, xMax);
    let realXMax = Math.max(xMin, xMax);
    let realYMin = Math.min(yMin, yMax);
    let realYMax = Math.max(yMin, yMax);

    //Перевірка потрапляння точки в прямокутник
    let isInside = (x >= realXMin && x <= realXMax) && (y >= realYMin && y <= realYMax);

    //Форматування та виведення результату на сторінку
    let resultClass = isInside ? "true" : "false";

    outputDiv.innerHTML = `
        <div style="margin-bottom: 8px; font-size: 13px; color: #666;">
            Область: X[${realXMin}...${realXMax}], Y[${realYMin}...${realYMax}]<br>
            Точка: A(${x}; ${y})
        </div>
        Результат: <span class="${resultClass}">${isInside}</span>
    `;
});