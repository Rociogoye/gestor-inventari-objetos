// Gestor d'inventari web

const PRODUCTES_INICIALS = [
    { nom: 'Portàtil', stock: 5, preu: 800 },
    { nom: 'Ratolí', stock: 20, preu: 25 },
    { nom: 'Monitor', stock: 3, preu: 180 },
    { nom: 'Teclat', stock: 12, preu: 45 }
];

const productes = carregarProductes();

const formulariProducte = document.querySelector('#formulariProducte');
const inputNom = document.querySelector('#inputNom');
const inputStock = document.querySelector('#inputStock');
const inputPreu = document.querySelector('#inputPreu');
const inputCerca = document.querySelector('#inputCerca');
const btnStockBaix = document.querySelector('#btnStockBaix');
const formulariDescompte = document.querySelector('#formulariDescompte');
const inputDescompte = document.querySelector('#inputDescompte');
const btnTreureDescompte = document.querySelector('#btnTreureDescompte');
const llistaProductes = document.querySelector('#llistaProductes');
const resumFiltre = document.querySelector('#resumFiltre');
const estadistiques = document.querySelector('#estadistiques');
const missatge = document.querySelector('#missatge');

let mostrarNomesStockBaix = false;
let percentatgeDescompte = 0;

function carregarProductes(){
    try {
        const dades = JSON.parse(localStorage.getItem('inventari-productes'));
        return Array.isArray(dades) ? dades : structuredClone(PRODUCTES_INICIALS);
    } catch {
        return structuredClone(PRODUCTES_INICIALS);
    }
}

function desarProductes(){
    localStorage.setItem('inventari-productes', JSON.stringify(productes));
}

function formatMoneda(valor){
    return new Intl.NumberFormat('ca-ES', {
        style: 'currency',
        currency: 'EUR'
    }).format(valor);
}

function mostrarMissatge(text, tipus){
    missatge.textContent = text;
    missatge.className = `missatge ${tipus}`;
}

function obtenirProductesVisibles(){
    const cerca = inputCerca.value.trim().toLowerCase();

    return productes.filter(producte => {
        const coincideixCerca = producte.nom.toLowerCase().includes(cerca);
        const coincideixStock = !mostrarNomesStockBaix || producte.stock < 5;
        return coincideixCerca && coincideixStock;
    });
}

function crearDetall(etiqueta, valor){
    const element = document.createElement('span');
    element.className = 'detall';
    element.append(`${etiqueta}: `);

    const destacat = document.createElement('strong');
    destacat.textContent = valor;
    element.append(destacat);

    return element;
}

function crearElementProducte(producte){
    const index = productes.indexOf(producte);
    const element = document.createElement('li');
    element.className = `producte${producte.stock < 5 ? ' stock-baix' : ''}`;

    const nom = document.createElement('span');
    nom.className = 'nom-producte';
    nom.textContent = producte.nom;

    const stock = crearDetall('Stock', producte.stock);
    if (producte.stock < 5){
        const etiqueta = document.createElement('span');
        etiqueta.className = 'etiqueta-stock';
        etiqueta.textContent = 'BAIX';
        stock.append(etiqueta);
    }

    const preuFinal = producte.preu * (1 - percentatgeDescompte / 100);
    const preu = crearDetall('Preu', formatMoneda(preuFinal));
    if (percentatgeDescompte > 0){
        const original = document.createElement('span');
        original.className = 'preu-original';
        original.textContent = formatMoneda(producte.preu);
        preu.insertBefore(original, preu.querySelector('strong'));
    }

    const eliminar = document.createElement('button');
    eliminar.type = 'button';
    eliminar.className = 'btn-eliminar';
    eliminar.dataset.index = index;
    eliminar.setAttribute('aria-label', `Eliminar ${producte.nom}`);
    eliminar.textContent = '🗑️';

    element.append(nom, stock, preu, eliminar);
    return element;
}

function renderitzarProductes(){
    const productesVisibles = obtenirProductesVisibles();
    llistaProductes.replaceChildren();

    if (productesVisibles.length === 0){
        const buit = document.createElement('li');
        buit.className = 'buit';
        buit.textContent = productes.length === 0
            ? 'Encara no hi ha cap producte. Afegeix el primer!'
            : 'No hi ha productes que coincideixin amb el filtre.';
        llistaProductes.append(buit);
    } else {
        const fragment = document.createDocumentFragment();
        productesVisibles.forEach(producte => fragment.append(crearElementProducte(producte)));
        llistaProductes.append(fragment);
    }

    const parts = [`${productesVisibles.length} de ${productes.length} productes`];
    if (mostrarNomesStockBaix) parts.push('només stock inferior a 5');
    if (percentatgeDescompte > 0) parts.push(`${percentatgeDescompte}% de descompte aplicat`);
    resumFiltre.textContent = parts.join(' · ');

    renderitzarEstadistiques();
}

function renderitzarEstadistiques(){
    const totalUnitats = productes.reduce((total, producte) => total + producte.stock, 0);
    const valorTotal = productes.reduce(
        (total, producte) => total + producte.stock * producte.preu,
        0
    );

    estadistiques.innerHTML = `
        <p><span>Productes</span><strong>${productes.length}</strong></p>
        <p><span>Unitats</span><strong>${totalUnitats}</strong></p>
        <p><span>Valor total</span><strong>${formatMoneda(valorTotal)}</strong></p>
    `;
}

function afegirProducte(event){
    event.preventDefault();

    const nom = inputNom.value.trim();
    const stock = Number(inputStock.value);
    const preu = Number(inputPreu.value);

    if (!nom){
        mostrarMissatge('El nom no pot estar buit.', 'error');
        inputNom.focus();
        return;
    }

    const duplicat = productes.some(
        producte => producte.nom.toLowerCase() === nom.toLowerCase()
    );
    if (duplicat){
        mostrarMissatge('Aquest producte ja existeix.', 'error');
        inputNom.focus();
        return;
    }

    if (!Number.isInteger(stock) || stock < 0 || !Number.isFinite(preu) || preu <= 0){
        mostrarMissatge('Introdueix un stock i un preu vàlids.', 'error');
        return;
    }

    productes.push({ nom, stock, preu });
    desarProductes();
    formulariProducte.reset();
    mostrarMissatge('Producte afegit correctament!', 'exit');
    inputNom.focus();
    renderitzarProductes();
}

function eliminarProducte(index){
    if (!Number.isInteger(index) || index < 0 || index >= productes.length) return;

    const [producteEliminat] = productes.splice(index, 1);
    desarProductes();
    mostrarMissatge(`${producteEliminat.nom} s'ha eliminat de l'inventari.`, 'exit');
    renderitzarProductes();
}

formulariProducte.addEventListener('submit', afegirProducte);

llistaProductes.addEventListener('click', event => {
    const boto = event.target.closest('.btn-eliminar');
    if (boto) eliminarProducte(Number(boto.dataset.index));
});

inputCerca.addEventListener('input', renderitzarProductes);

btnStockBaix.addEventListener('click', () => {
    mostrarNomesStockBaix = !mostrarNomesStockBaix;
    btnStockBaix.classList.toggle('actiu', mostrarNomesStockBaix);
    btnStockBaix.textContent = mostrarNomesStockBaix
        ? '📦 Mostrar tots'
        : '📌 Stock baix';
    renderitzarProductes();
});

formulariDescompte.addEventListener('submit', event => {
    event.preventDefault();
    const percentatge = Number(inputDescompte.value);

    if (!Number.isFinite(percentatge) || percentatge <= 0 || percentatge >= 100){
        mostrarMissatge('El descompte ha de ser entre 1 i 99.', 'error');
        inputDescompte.focus();
        return;
    }

    percentatgeDescompte = percentatge;
    btnTreureDescompte.hidden = false;
    mostrarMissatge(`Descompte del ${percentatge}% aplicat a la vista.`, 'exit');
    renderitzarProductes();
});

btnTreureDescompte.addEventListener('click', () => {
    percentatgeDescompte = 0;
    inputDescompte.value = '';
    btnTreureDescompte.hidden = true;
    mostrarMissatge('Descompte eliminat.', 'exit');
    renderitzarProductes();
});

renderitzarProductes();
