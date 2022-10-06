const pool = require('../database');

function tipoUsuarioToString(tipo){
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
};

module.exports = {
    unoMas: function(n){
      return n+1;
    },
    imprimirCursoPerfil: function(curso){
      switch(curso){
        case "7C":
        case "6C":
        case "5C":
        case "4C":
          return curso + " - Técnico en informática personal y profesional";
        default:
          return tipoUsuarioToString(curso);
      }
    },
    if: function(v1, v2, options) {
      if(v1 === v2) {
        return options.fn(this);
      }
      return options.inverse(this);
    },
    ifCond: function(v1, operator, v2, options) {
      switch (operator) {
          case '==':
              return (v1 == v2) ? options.fn(this) : options.inverse(this);
          case '===':
              return (v1 === v2) ? options.fn(this) : options.inverse(this);
          case '!=':
              return (v1 != v2) ? options.fn(this) : options.inverse(this);
          case '!==':
              return (v1 !== v2) ? options.fn(this) : options.inverse(this);
          case '<':
              return (v1 < v2) ? options.fn(this) : options.inverse(this);
          case '<=':
              return (v1 <= v2) ? options.fn(this) : options.inverse(this);
          case '>':
              return (v1 > v2) ? options.fn(this) : options.inverse(this);
          case '>=':
              return (v1 >= v2) ? options.fn(this) : options.inverse(this);
          case '&&':
              return (v1 && v2) ? options.fn(this) : options.inverse(this);
          case '||':
              return (v1 || v2) ? options.fn(this) : options.inverse(this);
          default:
              return options.inverse(this);
      }
    },
    tipoUsuarioToString: function(tipo){
      return tipoUsuarioToString(tipo);
    },
    partials: function(string) {
        return string;
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
    },
    textToDate: function(text){
      return new Date(text).toLocaleDateString();
    },
    dateDbToCorrectFormat: function(dbDate){
        let year = dbDate.toLocaleString("default", { year: "numeric" });
        let month = dbDate.toLocaleString("default", { month: "2-digit" });
        let day = dbDate.toLocaleString("default", { day: "2-digit" });

        return year + "-" + month + "-" + day;
    },
    selectVacunacion: function(vac){
      switch(vac){
        case 1:
        case '1':
          return "Completa";
        case 2:
        case '2':
          return "Incompleta";
        default:
          return "Sin datos";
      }
    },
    anioToString(anio){
      let anios = {
        1: "1er año",
        2: "2do año",
        3: "3er año",
        4: "4to año",
        5: "5to año",
        6: "6to año",
        7: "7mo año",
      }
      return anios[anio];
    },
    cursoToString(curso){
      return curso.split('').join("°");
    },
    tipoInasistenciaToCheck(tipo){
      if(tipo == 1)
        return 'checked';
      else
        return '';
    }
  } 