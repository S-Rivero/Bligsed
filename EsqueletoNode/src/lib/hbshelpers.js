const pool = require('../database');

module.exports = {
    ifCond: function(v1, options) {
      if(v1%2 === 0) {
        return options.fn(this);
      }
      return options.inverse(this);
    },
    getNotas: function(materia){
      // const rows = pool.query("SELECT * FROM notas WHERE id_alum = 0 AND id_materia = ", function(err, publicaciones){
      //   return publicaciones;
      // });
      console.log('Materia:' + materia);
    }
  } 