const FlexSearch = require('flexsearch');
//const encode_simple = require('flexsearch/dist/module/lang/latin/simple')

// Champs à indexer
const fieldsToIndex = ['name'];

// Création de l'index FlexSearch avec les options demandées
const index = new FlexSearch.Document({
  preset: 'match', // optionnelle, améliore la pertinence pour des cas généraux
  tokenize: 'reverse',
  //encoder: FlexSearch.registerCharset.LatinSimple,
  //encode: encode_simple,
  document: {
    id: '_id',
    index: fieldsToIndex,
    store: true
  }
})

// Données d'exemple
const docs = [
  { _id: '1', _type: 'io.cozy.files', name: 'test1' },
  { _id: '2', _type: 'io.cozy.files', name: 'test2' },
  { _id: '3', _type: 'io.cozy.files', name: 'aaaa' },
  { _id: '4', _type: 'io.cozy.files', name: 'UX-UI guidelines'},
]

// Ajout des documents à l'index
docs.forEach(doc => index.add(doc));

// Fonction de recherche
async function search(query) {
  const results = await index.search(query, 1, { enrich: false });
  console.log(`Résultats pour "${query}" :`, results);
}

// Exemple de requêtes
(async () => {
  await search('test')
  //await search('UX-UI guidelines')
})();
