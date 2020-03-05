const mongoClient = require('mongodb').MongoClient,
  config = require('config');

let dbHost = config.get('db.host');
let dbPort = config.get('db.port');
let dbName = config.get('db.name');
let dbUrl = `mongodb://${dbHost}:${dbPort}`;

module.exports.cosultar = async (query) => {
  return new Promise(async (resolve, reject) => {
    let filter = {};
    if (query.minStar) {
      filter.rating = {
        $gte: parseInt(query.minStar)
      }
    }
    if (query.minCredits) {
      filter.maximumCredits = {
        $gte: parseInt(query.minCredits)
      }
    }
    if (query.minCost) {
      filter.price = {
        $gte: parseInt(query.minCost)
      }
    }
    const client = new mongoClient(dbUrl, {
      useUnifiedTopology: true
    });
    const result = {};
    client.connect(function(errConect, client) {
      if (errConect) {
        result.message = `Error al conectar al servidor: ${dbUrl}`;
        result.length = 0;
        reject(result);
      } else {
        console.log(`Conectado correctamente al servidor: ${dbUrl}`);
        const db = client.db(dbName);
        const col = db.collection('courses');
        col.find(filter).toArray(function(err, resultado) {
          if (err) {
            result.message = 'Error buscando los cursos';
            result.documents = {
              "error": err
            };
            result.length = 0;
            reject(result);
          } else {
            result.success = true;
            result.status = 200;
            result.documents = resultado;
            result.length = resultado.length;
            result.message = "Cursos consultados";
            resolve(result);
          }
        });
      }
    });
  })
}

module.exports.insert = async (data) => {
  return new Promise(async (resolve, reject) => {

    const client = new mongoClient(dbUrl, {
      useUnifiedTopology: true
    });
    const result = {};
    client.connect(function(errConect, client) {
      if (errConect) {
        result.message = `Error al conectar al servidor: ${dbUrl}`;
        result.length = 0;
        reject(result);
      } else {
        console.log(`Conectado correctamente al servidor: ${dbUrl}`);
        const db = client.db(dbName);
        const col = db.collection('courses');
        col.insertMany(data, function(err, resultado) {
          if (err) {
            result.message = 'Error insertando los cursos';
            result.length = 0;
            reject(result);
          } else {
            result.success = true;
            result.status = 200;
            result.message = "Cursos insertados";
            resolve(result);
          }
        });
      }
    });
  });
}
