function convertTemperature() {
    const unit = prompt("請輸入溫度單位（C 或 F）：").toUpperCase();
    const value = parseFloat(prompt("請輸入溫度值："));

    if (isNaN(value)) {
        alert("請輸入有效的數字！");
        return;
    }

    let result;
    let resultUnit;
    if (unit === 'C') {
        result = celsiusToFahrenheit(value);
        resultUnit = 'F';
        alert(`${value} C 轉換為 ${result} ${resultUnit}`);
    } else if (unit === 'F') {
        result = fahrenheitToCelsius(value);
        resultUnit = 'C';
        alert(`${value} F 轉換為 ${result} ${resultUnit}`);
    } else {
        alert("無效的單位！請輸入 C 或 F。");
        return;
    }

    displayResult(value, unit, result, resultUnit);
}

function celsiusToFahrenheit(celsius) {
    return (celsius * 9 / 5) + 32;
}

function fahrenheitToCelsius(fahrenheit) {
    return (fahrenheit - 32) * 5 / 9;
}

function displayResult(value, unit, result, resultUnit) {
    const resultElement = document.getElementById("result");
    resultElement.textContent = `${value} ${unit} 轉換為 ${result} ${resultUnit}`;
}