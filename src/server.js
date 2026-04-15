const express = require('express');
const os = require('os');
const path = require('path');
const {
    UNIT_OPTIONS,
    convertTemperature,
} = require('./convert');

const app = express();
const PORT = process.env.PORT || 8080;
const APP_NAME = process.env.APP_NAME || 'Conversor de Temperatura 2.0';
const APP_ENV = process.env.APP_ENV || 'development';
const MAX_HISTORY_ITEMS = 6;
const DEFAULT_FORM = {
    value: '',
    from: 'celsius',
    to: 'fahrenheit',
};

let history = [];

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const formatNumber = (value) => new Intl.NumberFormat('pt-BR', {
    maximumFractionDigits: 2,
}).format(value);

const formatTime = (date) => new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
}).format(date);

const createViewConversion = (conversion) => ({
    inputValue: formatNumber(conversion.input.value),
    inputUnit: conversion.input.unit,
    inputLabel: conversion.input.label,
    inputSymbol: conversion.input.symbol,
    outputValue: formatNumber(conversion.output.value),
    outputUnit: conversion.output.unit,
    outputLabel: conversion.output.label,
    outputSymbol: conversion.output.symbol,
});

const addToHistory = (conversion) => {
    const item = {
        ...createViewConversion(conversion),
        createdAt: formatTime(new Date()),
    };

    history = [item, ...history].slice(0, MAX_HISTORY_ITEMS);
    return item;
};

const renderHome = (res, options = {}) => {
    res.render('index', {
        units: UNIT_OPTIONS,
        form: {
            ...DEFAULT_FORM,
            ...options.form,
        },
        result: options.result || null,
        error: options.error || null,
        history,
        maxHistoryItems: MAX_HISTORY_ITEMS,
        machine: os.hostname(),
        appName: APP_NAME,
        appEnv: APP_ENV,
    });
};

const buildApiPayload = (conversion) => ({
    from: conversion.input.unit,
    to: conversion.output.unit,
    value: conversion.input.value,
    result: conversion.output.value,
    input: conversion.input,
    output: conversion.output,
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.get('/api/convert', (req, res) => {
    const { from, to, value } = req.query;

    try {
        const conversion = convertTemperature(value, from, to);
        addToHistory(conversion);

        return res.json({
            status: 'ok',
            data: buildApiPayload(conversion),
        });
    } catch (error) {
        return res.status(400).json({
            status: 'error',
            message: error.message,
            acceptedUnits: UNIT_OPTIONS.map((unit) => unit.value),
        });
    }
});

app.get('/', (req, res) => {
    renderHome(res);
});

app.post('/', (req, res) => {
    const form = {
        value: req.body.value,
        from: req.body.from,
        to: req.body.to,
    };

    try {
        const conversion = convertTemperature(form.value, form.from, form.to);
        addToHistory(conversion);

        return renderHome(res, {
            form,
            result: createViewConversion(conversion),
        });
    } catch (error) {
        return res.status(400).render('index', {
            units: UNIT_OPTIONS,
            form: {
                ...DEFAULT_FORM,
                ...form,
            },
            result: null,
            error: error.message,
            history,
            maxHistoryItems: MAX_HISTORY_ITEMS,
            machine: os.hostname(),
            appName: APP_NAME,
            appEnv: APP_ENV,
        });
    }
});

app.listen(PORT, () => {
    console.log(`${APP_NAME} rodando na porta ${PORT} em ${APP_ENV}`);
});
