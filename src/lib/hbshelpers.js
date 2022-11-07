const pool = require('../database');

function tipoUsuarioToString(tipo){
  
  switch(parseInt(tipo)){
    case 0:
      return 'Superusuario';
      break;
    case 1:
      return 'Administracion';
      break;
    case 2:
      return 'Directivo';
      break;
    case 3:
      return 'Preceptor';
      break;
    case 4:
      return 'Docente';
      break;
    case 5:
      return 'Tutor';
      break;
    case 6:
      return 'Alumno';
      break;
  }
};

module.exports = {
    unoMas: function(n){
      return n+1;
    },
    imprimirCursoPerfil: function(curso){
      switch(curso[0]){
        case "8":
        case "7":
        case "6":
        case "5":
        case "4":
        case "3":
        case "2":
        case "1":
          return "Alumno de " + curso;
        default:
          return tipoUsuarioToString(curso);
      }
    },
    if: function(v1, v2, options) {
      if(v1 == v2) {
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
      let d = dateTime.toLocaleDateString().split('/');
      return [d[1],d[0],d[2]].join('/');
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
    },
    motivoATipoInasistencia(motivo){
      let tiposInasistencia = {
        'Ausente no computable': 0,
        'Tarde TM': 5,
        'Tarde TT': 6,
        'Ausente TT': 4,
        'Ausente TM': 3,
        'Ausente TM (Jornada simple)': 1,
        'Ausente TT (Jornada simple)': 2
     }
     return tiposInasistencia[motivo];
    }
  } 