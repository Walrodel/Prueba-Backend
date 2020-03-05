const express = require("express"),
  path = require("path"),
  app = express(),
  axios = require("axios"),
  config = require('config');

let appPort = config.get('app.port');
let appUrlData = config.get('app.urlData');

const coursesService = require('./services/coursesService');
const inti = async () => {
  coursesService.cosultar({})
    .then(result => {
      if (result.length == 0) {
        console.log("Obteniendo cursos a insertar...");
        axios.get(appUrlData)
          .then(resultJs => {
            const inserResult = JSON.parse(resultJs.data.toString().split('=')[1]);
            console.log("Insertando cursos...");
            coursesService.insert(inserResult)
              .then(resultInsert => {
                console.log(resultInsert.message);
              })
              .catch(error => {
                console.log(error.documents);
              });
          })
          .catch(err => {
            console.log("Error al obtener cursos: ", err);
          });
      }
    })
    .catch(error => {
      console.log(error.message);
    });
}

inti();

app.get('/courses', async (req, res) => {
  coursesService.cosultar(req.query)
    .then(result => {
      res.json(result.documents)
    })
    .catch(error => {
      res.json(error)
    });
});

app.listen(appPort, err => {
  if (err) {
    console.error("Error escuchando: ", err);
    return;
  }
  console.log(`Escuchando en el puerto :${appPort}`);
});
