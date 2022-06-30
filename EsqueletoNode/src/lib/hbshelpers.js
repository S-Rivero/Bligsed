const pool = require('../database');

module.exports = {
    ifCond: function(v1, options) {
      if(v1%2 === 0) {
        return options.fn(this);
      }
      return options.inverse(this);
    },
    tipoUsuarioToString: function(tipo){
      switch(tipo){
        case 0:
          return 'superusuario';
          break;
        case 1:
          return 'administracion';
          break;
        case 2:
          return 'directivo';
          break;
        case 3:
          return 'preceptor';
          break;
        case 4:
          return 'docente';
          break;
        case 5:
          return 'tutor';
          break;
        case 6:
          return 'alumno';
          break;
      }
    },
    tipoInasistenciaToString: function(tipo){
      switch(tipo){
        case 0:
          return 'No justificada';
          break;
        case 1:
          return 'Justificada';
          break;
      }
    },
    dateTimeToDate: function(dateTime){
      return dateTime.toLocaleDateString();
    }
  } 