const e = require("connect-flash");

module.exports = {
    JSONPromediosAl: function(json){
        let materias = [];
        json.forEach(e =>{
            if(!(materias.includes(e.Materia))){
                materias.push(e.Materia);
            }
        })
        
        return materias.map(m => {
            let notas = [];
            json.forEach(e => {
                if(e.Materia == m)
                    notas.push(e.nota);
            });
            return{
                "materia": m,
                "notas": notas
            };
        })

    },
    
    JSONListaDeCursos: function(arrJson){
        let cursos = []; 
        let anios = [];
        
        for(let i = 0 ; i < 8 ; i++){
            let regExp = new RegExp('^'+i);
            anios = arrJson.filter(e => {
                return regExp.test(e.Curso);
            })
            .map(li => {
                return li.Curso ? {curso: li.Curso[1], id: li.ID}:'';
            })
            cursos.push({anio: i, division: anios});

        }
        let cursosFinal = cursos.filter(e =>{
            return (e.division[0])
        });
        return cursosFinal;
    },

    JSONListaDeMaterias: function(arrJson){
        let liMaterias = [];
        let materiasFinal = [];

        arrJson.forEach(e => {
            if(!(liMaterias.includes(e.Materia))){
                liMaterias.push(e.Materia);
            }
        });

        materiasFinal = liMaterias.map(li => {
            let cursos = arrJson.filter(e => {
                return e.Materia == li;
            })
            .map(e => {
                return {curso: e.Curso, idMateria: e.IdMateria};
            });

            return {materia: li, cursos};
        });
        return materiasFinal;
    },

    JSONListaAlumnosNotas: function(a,n){
        return a.map(e => {
            let notasArr = n.filter(r => r.id_alum == e.id_alum).map(j => {
                return {
                    num: j.numnota,
                    nota: j.nota
                }
            });
            return {
                id: e.id_alum,
                nombre: e.Nombre,
                notas: notasArr
            };
        })
    },

    JSONrenderCargarInasistencias: function({idSeleccionados, idAlumnos, nombreAlumnos}){
        let newArr = [];
        for(let i = 0 ; i < idAlumnos.length ; i++){
            newArr.push({id: idAlumnos[i], nombre: nombreAlumnos[i]});
        }
        return newArr.filter(e => idSeleccionados.includes(e.id));
    },

    JSONcargarInasistencias: function({id, fecha, inasistencia}){
        let arr = [];
        for(let i = 0 ; i < id.length ; i++){
            arr.push({
                idAlumno: id[0],
                fecha: fecha[0],
                inasistencia: inasistencia[0]
                //SEPARAR INASISTENCIA DE TIPO DE INASISTENCIA
            })
        }
    }
    /*
        0 vale 0
        1 y 2 valen 1
        3 y 4 valen 0.5
        5 y 6 valen 0.25
        <option value="0">0 - Ausente no computable</option>
        <option value="1">1 - Ausente TM (Jornada simple)</option>
        <option value="2">1 - Ausente TT (Jornada simple)</option>
        <option value="3">0.5 - Ausente TM</option>
        <option value="4">0.5 - Ausente TT</option>
        <option value="5">0.25 - Tarde TM</option>
        <option value="6">0.25 - Tarde TT</option>
    */
}

// [
//     {
//         id: 6,
//         nombre: "juan",
//         notas: [1,2,3,4]
//     },
//     {

//     }
// ]

//A:
/*
[
  {
    "id_alum": 6,
    "Nombre": "6"
  }
]
*/

//N:
/*
[
  {
    "id_alum": 6,
    "nota": 1,
    "numnota": 1
  },
  {
    "id_alum": 6,
    "nota": 10,
    "numnota": 2
  },
  {
    "id_alum": 6,
    "nota": 9,
    "numnota": 3
  },
  {
    "id_alum": 6,
    "nota": 5,
    "numnota": 4
  }
]
*/