/* ==========================================================
   Gestor d'Inventari
   Desenvolupament Front-end amb JavaScript
========================================================== */


/* ==========================================================
   Estructura de dades
========================================================== */
const inventari = [
    { nom: "Portàtil", stock: 5, preu: 800 },
    { nom: "Ratolí", stock: 20, preu: 25 },
    { nom: "Monitor", stock: 3, preu: 180 },
    { nom: "Teclat", stock: 12, preu: 45 }
];


/* ==========================================================
   Referències al DOM
========================================================== */
const inputNom = document.querySelector("#inputNom");
const inputStock = document.querySelector("#inputStock");
const inputPreu = document.querySelector("#inputPreu");
const inputBuscar = document.querySelector("#inputBuscar");
const btnAfegir = document.querySelector("#btnAfegir");
const btnBuscar = document.querySelector("#btnBuscar");
const btnStockBaix = document.querySelector("#btnStockBaix");
const llistaInventari = document.querySelector("#llistaInventari");
const estadistiques = document.querySelector("#estadistiques");


/* ==========================================================
   Variables d'estat
========================================================== */
let mostrarNomesStockBaix = false;

/* ==========================================================
   Renderitzar inventari
========================================================== */

/**
 * Mostra els productes de l'inventari a la pàgina.
 */
function renderitzarInventari() {
    let productesMostrar = inventari;

    // Si el filtre està activat, només mostrem els productes amb stock baix
    if (mostrarNomesStockBaix) {
        productesMostrar = inventari.filter(producte => producte.stock < 5);
    }

    // Si no hi ha productes, mostrem un missatge
    if (productesMostrar.length === 0) {
        const missatge = mostrarNomesStockBaix
            ? "No hi ha productes amb stock baix. 🎉"
            : "L'inventari està buit.<br>Afegiu el primer producte! 😊";

        llistaInventari.innerHTML = `<li class="buit">${missatge}</li>`;

        return;
    }

    /*  Generem el llistat de productes
        Usando data-index="${inventari.indexOf(producte)}". 
        Así siempre obtenemos la posición real del objeto dentro del inventario, 
        independientemente de si estamos mostrando todos los productos o sólo los de stock bajo. 
    */

    const html = productesMostrar
        .map((producte) => `
            <li class="producte">
                <div class="info">
                    <span class="nom">${producte.nom}</span>
                    <span class="stock">Stock: ${producte.stock}</span>
                    <span class="preu">${producte.preu.toFixed(2)} €</span>
                </div>

                <div class="accions">
                    <button class="btn-descompte" data-index="${inventari.indexOf(producte)}">🏷 Descompte</button>
                    <button class="btn-eliminar" data-index="${inventari.indexOf(producte)}">🗑</button>
                </div>
            </li>
        `)
        .join("");
    llistaInventari.innerHTML = html;

    /* // Botons d'eliminar
    document.querySelectorAll(".btn-eliminar").forEach(boto => {
        boto.addEventListener("click", () => {
            const index = Number(boto.dataset.index);
            eliminarProducte(index);
        });
    });

    // Botons d'aplicar descompte
    document.querySelectorAll(".btn-descompte").forEach(boto=>{
        boto.addEventListener("click",()=>{
            aplicarDescompte(Number(boto.dataset.index));
        });
    });  */

    // document.querySelector('#llistaInventari').addEventListener('click', (event) => {
    //     const boto = event.target.closest(".btn-eliminar");
    //     if (boto) eliminarProducte(+boto.dataset.index); // + operador unary, per convertir a número
    // });
   
   
    
}

/* ==========================================================
   Renderitzar estadístiques
========================================================== */

/**
 * Mostra les estadístiques de l'inventari.
 */
function renderitzarEstadistiques() {

    // Nombre total de productes
    const totalProductes = inventari.length;

    // Productes amb stock baix
    const stockBaix = inventari.filter(producte => producte.stock < 5).length;

    // Valor total de l'inventari
    const valorInventari = inventari.reduce((total, producte) => {return total + (producte.stock * producte.preu);}, 0);

    estadistiques.innerHTML = `
        <p>📦<br>Productes<br><strong>${totalProductes}</strong></p>
        
        <p>⚠<br>Stock baix<br><strong>${stockBaix}</strong></p>

        <p>💰<br>Valor inventari<br><strong>${valorInventari.toFixed(2)} €</strong></p>
    `;
}

/* ==========================================================
   Afegir producte
========================================================== */

/**
 * Afegeix un nou producte a l'inventari.
 */
function afegirProducte() {

    const nom = inputNom.value?.trim() ?? '';
    
    const stock = Number(inputStock.value?.trim() ?? '0');
    
    const preu = Number(inputPreu.value?.trim() ?? '0');


    // Validació
    if (nom === "" || isNaN(stock) || isNaN(preu) || stock <= 0 || preu <= 0) {
        alert("Introduïu dades vàlides.");
        return;
    }


    // Evitem productes duplicats
    const duplicat = inventari.find(producte => producte.nom.toLowerCase() === nom.toLowerCase());

    if (duplicat) {
        alert("Aquest producte ja existeix.");
        return;
    }


    // Creació del nou objecte
    const nouProducte = {nom, stock, preu};
    inventari.push(nouProducte);


    // Netegem el formulari
    // inputNom.value = "";

    // inputStock.value = "";

    // inputPreu.value = "";
    formulari.reset();
    inputNom.focus();


    // Si està actiu el filtre de stock baix, tornem a mostrar tots els productes
    mostrarNomesStockBaix = false;
    btnStockBaix.textContent = "📉 Stock baix";


    // Actualitzem la interfície
    renderitzarInventari();
    renderitzarEstadistiques();
}

/* ==========================================================
   Buscar producte
========================================================== */

/**
 * Cerca un producte pel seu nom.
 */
function buscarProducte() {

    const nomBuscat = inputBuscar.value?.trim().toLowerCase() ?? "";

    if (nomBuscat === "") {
        alert("Introduïu un nom de producte.");
        inputBuscar.focus();
        return;
    }

    const producteTrobat = inventari.find(producte => producte.nom.toLowerCase() === nomBuscat.toLowerCase());

    if (!producteTrobat) {
        alert("Producte no trobat.");
        return;
    }

    alert(` Producte trobat
        Nom: ${producteTrobat.nom}
        Stock: ${producteTrobat.stock}
        Preu: ${producteTrobat.preu.toFixed(2)} €
    `);
}

/* ==========================================================
   Mostrar només stock baix
========================================================== */

/**
 * Activa o desactiva el filtre de productes amb stock baix.
 */
function mostrarStockBaix() {

    mostrarNomesStockBaix = !mostrarNomesStockBaix;
    
    // Netejem el camp de cerca per coherència amb el filtre de stock baix
    inputBuscar.value = "";

    btnStockBaix.textContent = mostrarNomesStockBaix
        ? "📋 Mostrar tots"
        : "📉 Stock baix";

    renderitzarInventari();
}

/* ==========================================================
   Eliminar producte
========================================================== */

/**
 * Elimina un producte de l'inventari.
 *
 * @param {number} index Índex del producte a eliminar.
 */
function eliminarProducte(index) {

    // Validem l'índex
    if (index < 0 || index >= inventari.length) return;

    // Confirmem l'eliminació amb l'usuari
    if (!confirm("Voleu eliminar aquest producte?")) return;
    
    // Eliminem el producte
    inventari.splice(index, 1);

    // Actualitzem la interfície
    renderitzarInventari();
    renderitzarEstadistiques();
}


/* ==========================================================
   Funció per aplicar descompte
========================================================== */
function aplicarDescompte(index){

    if(index < 0 || index >= inventari.length) return;

    const percentatge = Number(prompt("Percentatge de descompte:")?.trim() ?? '0');

    if (isNaN(percentatge) || percentatge <= 0 || percentatge >= 100) return;

    inventari[index].preu -= inventari[index].preu * percentatge / 100;

    renderitzarInventari();
    renderitzarEstadistiques();
}

/* ==========================================================
   Esdeveniments
========================================================== */

/**
 * Afegeix un producte en prémer el botó.
 */
btnAfegir.addEventListener("click", afegirProducte);


/**
 * Permet afegir un producte prement Enter al camp del nom.
 */
inputNom.addEventListener("keydown", event => {
    if (event.key === "Enter") afegirProducte();
});


/**
 * Cerca un producte.
 */
btnBuscar.addEventListener("click", buscarProducte);


/**
 * Permet cercar un producte prement Enter.
 */
inputBuscar.addEventListener("keydown", event => {
    if (event.key === "Enter") buscarProducte(); 
});


/**
 * Activa o desactiva el filtre de stock baix.
 */
btnStockBaix.addEventListener("click", mostrarStockBaix);


// Delegació d'esdeveniments per als botons d'eliminar i aplicar descompte
llistaInventari.addEventListener("click",(event)=>{
    const botoEliminar = event.target.closest(".btn-eliminar");

    if(botoEliminar){
        eliminarProducte(Number(botoEliminar.dataset.index));
        return;
    }
    const botoDescompte = event.target.closest(".btn-descompte");

    if(botoDescompte){
        aplicarDescompte(Number(botoDescompte.dataset.index));
        return;
    }
});


/* ==========================================================
   Inicialització
========================================================== */

/**
 * Inicialitza l'aplicació.
 */
document.addEventListener("DOMContentLoaded", () => {
    renderitzarInventari();
    renderitzarEstadistiques();
});
