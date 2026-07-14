const prompt = require('prompt-sync')();

// Estructura de dades: cada producte és un objecte.
const productes = [
    { nom: 'Portàtil', stock: 5, preu: 800 },
    { nom: 'Ratolí', stock: 20, preu: 25 },
    { nom: 'Monitor', stock: 3, preu: 180 },
    { nom: 'Teclat', stock: 12, preu: 45 }
];

/**
 * Mostra el menú principal i obté l'opció seleccionada.
 * @returns {number} Opció escollida per l'usuari
 */
function mostrarMenu(){
    console.log('\n==== Menú d\'opcions ====');
    console.log('1. Afegir producte');
    console.log('2. Mostrar inventari');
    console.log('3. Buscar producte');
    console.log('4. Mostrar stock baix');
    console.log('5. Aplicar descompte');
    console.log('6. Eliminar producte');
    console.log('7. Sortir');

    return Number(prompt('Tria una opció: '));
}

/**
 * Afegeix un producte a l'inventari.
 * @returns {string} Missatge de confirmació o error
 */
function afegirProducte(){
    const nom = prompt('Nom del producte: ')?.trim() ?? '';
    const stock = Number(prompt('Stock del producte: ')?.trim() ?? '');
    const preu = Number(prompt('Preu del producte: ')?.trim() ?? '');

    if (nom === '') return 'El nom no pot estar buit';

    const duplicat = productes.find(
        producte => producte.nom.toLowerCase() === nom.toLowerCase()
    );
    if (duplicat) return 'Aquest producte ja existeix';

    if (!Number.isInteger(stock) || stock < 0 || !Number.isFinite(preu) || preu <= 0){
        return 'Stock o preu no vàlids';
    }

    productes.push({ nom, stock, preu });
    return 'Producte afegit correctament!';
}

/**
 * Mostra tots els productes de l'inventari.
 * @returns {string} Llistat de productes
 */
function mostrarInventari(){
    if (productes.length === 0) return 'Inventari buit';

    const llistatProductes = productes
        .map((producte, index) =>
            `${index + 1}. ${producte.nom} - Stock: ${producte.stock} - Preu: ${producte.preu.toFixed(2)}€`
        )
        .join('\n');

    return `==== Llistat de productes ====\n${llistatProductes}`;
}

/**
 * Busca un producte pel nom, sense distingir majúscules i minúscules.
 * @returns {string} Informació del producte o missatge d'error
 */
function buscarProducte(){
    if (productes.length === 0) return 'Inventari buit';

    const nomBuscat = prompt('Nom del producte a buscar: ')?.trim() ?? '';
    const producte = productes.find(
        item => item.nom.toLowerCase() === nomBuscat.toLowerCase()
    );

    if (!producte) return 'Producte no trobat';

    return `Producte trobat: ${producte.nom} - Stock: ${producte.stock} - Preu: ${producte.preu.toFixed(2)}€`;
}

/**
 * Mostra els productes amb menys de cinc unitats.
 * @returns {string} Llistat de productes amb stock baix
 */
function mostrarStockBaix(){
    if (productes.length === 0) return 'Inventari buit';

    const productesStockBaix = productes
        .filter(producte => producte.stock < 5)
        .map(producte => `${producte.nom} - Stock: ${producte.stock}`)
        .join('\n');

    if (!productesStockBaix) return 'No hi ha productes amb stock baix';

    return `==== Productes amb stock baix ====\n${productesStockBaix}`;
}

/**
 * Calcula els preus amb un descompte sense modificar els preus originals.
 * @returns {string} Llistat de productes amb el descompte aplicat
 */
function aplicarDescompte(){
    if (productes.length === 0) return 'Inventari buit';

    const percentatge = Number(prompt('Percentatge de descompte: ')?.trim() ?? '');

    if (!Number.isFinite(percentatge) || percentatge <= 0 || percentatge >= 100){
        return 'Percentatge no vàlid!';
    }

    const llistatDescompte = productes
        .map((producte, index) => {
            const preuAmbDescompte = producte.preu * (1 - percentatge / 100);
            return `${index + 1}. ${producte.nom} - Stock: ${producte.stock} - Preu: ${preuAmbDescompte.toFixed(2)}€`;
        })
        .join('\n');

    return `==== Productes amb un ${percentatge}% de descompte ====\n${llistatDescompte}`;
}

/**
 * Elimina un producte per la seva posició al llistat.
 * @returns {string} Missatge de confirmació o error
 */
function eliminarProducte(){
    if (productes.length === 0) return 'Inventari buit';

    console.log(mostrarInventari());
    const posicio = Number(prompt('Posició del producte a eliminar: ')?.trim() ?? '');
    const index = posicio - 1;

    if (!Number.isInteger(posicio) || index < 0 || index >= productes.length){
        return 'Posició no vàlida!';
    }

    productes.splice(index, 1);
    return 'Producte eliminat!';
}

/**
 * Executa el bucle principal del programa.
 */
function main(){
    while (true){
        const opcio = mostrarMenu();

        switch (opcio){
            case 1:
                console.log(afegirProducte());
                break;
            case 2:
                console.log(mostrarInventari());
                break;
            case 3:
                console.log(buscarProducte());
                break;
            case 4:
                console.log(mostrarStockBaix());
                break;
            case 5:
                console.log(aplicarDescompte());
                break;
            case 6:
                console.log(eliminarProducte());
                break;
            case 7:
                console.log('Sortint del programa...');
                return;
            default:
                console.log('Opció no vàlida!');
        }
    }
}

if (require.main === module){
    main();
}

module.exports = {
    productes,
    mostrarInventari,
    mostrarStockBaix,
    main
};
