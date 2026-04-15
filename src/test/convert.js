const assert = require('assert');
const convert = require('../convert');

const tests = [
    {
        name: 'Fahrenheit para Celsius',
        run: () => {
            assert.strictEqual(convert.fahrenheitCelsius(131), 55);
        },
    },
    {
        name: 'Celsius para Fahrenheit',
        run: () => {
            assert.strictEqual(convert.celsiusFahrenheit(55), 131);
        },
    },
    {
        name: 'Celsius para Kelvin',
        run: () => {
            const result = convert.convertTemperature(25, 'celsius', 'kelvin');
            assert.strictEqual(result.output.value, 298.15);
        },
    },
    {
        name: 'Kelvin para Fahrenheit',
        run: () => {
            const result = convert.convertTemperature(273.15, 'kelvin', 'fahrenheit');
            assert.strictEqual(result.output.value, 32);
        },
    },
    {
        name: 'Unidade invalida',
        run: () => {
            assert.throws(
                () => convert.convertTemperature(10, 'metro', 'kelvin'),
                /Unidade de origem invalida/,
            );
        },
    },
];

tests.forEach((test) => {
    test.run();
    console.log(`OK - ${test.name}`);
});

console.log(`${tests.length} testes passaram`);
