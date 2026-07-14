# Gestor d'inventari amb objectes

Aplicació de consola en Node.js per gestionar un inventari. A diferència de la versió basada en arrays paral·lels, aquesta versió guarda cada producte en un objecte:

```js
{
  nom: 'Monitor',
  stock: 3,
  preu: 180
}
```

## Funcionalitats

- Afegir productes.
- Mostrar l'inventari.
- Buscar un producte pel nom.
- Mostrar els productes amb stock baix.
- Calcular preus amb descompte.
- Eliminar productes.

## Instal·lació i ús

```bash
npm install
npm start
```

Per executar les proves:

```bash
npm test
```
