const UNITS = {
    celsius: {
        label: 'Celsius',
        symbol: 'C',
    },
    fahrenheit: {
        label: 'Fahrenheit',
        symbol: 'F',
    },
    kelvin: {
        label: 'Kelvin',
        symbol: 'K',
    },
};

const UNIT_OPTIONS = Object.entries(UNITS).map(([value, unit]) => ({
    value,
    label: unit.label,
    symbol: unit.symbol,
}));

const UNIT_ALIASES = {
    c: 'celsius',
    celsius: 'celsius',
    f: 'fahrenheit',
    fahrenheit: 'fahrenheit',
    k: 'kelvin',
    kelvin: 'kelvin',
};

const normalizeUnit = (unit) => {
    if (!unit) {
        return null;
    }

    return UNIT_ALIASES[String(unit).trim().toLowerCase()] || null;
};

const parseValue = (value) => {
    if (value === null || value === undefined || String(value).trim() === '') {
        throw new Error('Informe um valor numerico.');
    }

    const parsedValue = Number(String(value).replace(',', '.'));

    if (!Number.isFinite(parsedValue)) {
        throw new Error('Informe um valor numerico valido.');
    }

    return parsedValue;
};

const parseUnit = (unit, fieldName) => {
    const normalizedUnit = normalizeUnit(unit);

    if (!normalizedUnit) {
        const fieldLabel = fieldName === 'from' ? 'de origem' : 'de destino';
        throw new Error(`Unidade ${fieldLabel} invalida. Use celsius, fahrenheit ou kelvin.`);
    }

    return normalizedUnit;
};

const roundTemperature = (value) => {
    const roundedValue = Number(value.toFixed(2));
    return Object.is(roundedValue, -0) ? 0 : roundedValue;
};

const toCelsius = (value, from) => {
    if (from === 'fahrenheit') {
        return ((value - 32) * 5) / 9;
    }

    if (from === 'kelvin') {
        return value - 273.15;
    }

    return value;
};

const fromCelsius = (value, to) => {
    if (to === 'fahrenheit') {
        return ((value * 9) / 5) + 32;
    }

    if (to === 'kelvin') {
        return value + 273.15;
    }

    return value;
};

const convertTemperature = (value, from, to) => {
    const numericValue = parseValue(value);
    const fromUnit = parseUnit(from, 'from');
    const toUnit = parseUnit(to, 'to');
    const celsiusValue = toCelsius(numericValue, fromUnit);
    const convertedValue = roundTemperature(fromCelsius(celsiusValue, toUnit));

    return {
        input: {
            value: numericValue,
            unit: fromUnit,
            label: UNITS[fromUnit].label,
            symbol: UNITS[fromUnit].symbol,
        },
        output: {
            value: convertedValue,
            unit: toUnit,
            label: UNITS[toUnit].label,
            symbol: UNITS[toUnit].symbol,
        },
    };
};

exports.UNITS = UNITS;
exports.UNIT_OPTIONS = UNIT_OPTIONS;
exports.normalizeUnit = normalizeUnit;
exports.convertTemperature = convertTemperature;
exports.celsiusFahrenheit = (value) => convertTemperature(value, 'celsius', 'fahrenheit').output.value;
exports.fahrenheitCelsius = (value) => convertTemperature(value, 'fahrenheit', 'celsius').output.value;
