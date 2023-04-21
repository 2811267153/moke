import Datastore from 'nedb';

const db = new Datastore({
  filename: 'datafile.db',
  autoload: true,
});

export default db;