const test = require('node:test');
const assert = require('node:assert/strict');

const {
    productes,
    mostrarInventari,
    mostrarStockBaix
} = require('./app');

test('l\'inventari està format per objectes', () => {
    assert.equal(Array.isArray(productes), true);
    assert.equal(productes.length, 4);

    for (const producte of productes){
        assert.deepEqual(Object.keys(producte), ['nom', 'stock', 'preu']);
    }
});

test('mostrarInventari inclou nom, stock i preu', () => {
    const resultat = mostrarInventari();

    assert.match(resultat, /Portàtil - Stock: 5 - Preu: 800\.00€/);
    assert.match(resultat, /Monitor - Stock: 3 - Preu: 180\.00€/);
});

test('mostrarStockBaix només inclou productes amb menys de cinc unitats', () => {
    const resultat = mostrarStockBaix();

    assert.match(resultat, /Monitor - Stock: 3/);
    assert.doesNotMatch(resultat, /Portàtil/);
});
