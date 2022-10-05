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

    JSONcargarInasistencias: function(id_creador, {id, fecha, inasistencia, justificado}){
        console.log('id :>> ', id);
        console.log('fecha :>> ', fecha);
        console.log('inasistencia :>> ', inasistencia);
        let tiposInasistencia = {
            '0': {
                "cantidad": 0,
                "motivo": "Ausente no computable"
            },
            '1': {
                "cantidad": 1,
                "motivo": "Ausente TM (Jornada simple)"
            },
            '2': {
                "cantidad": 1,
                "motivo": "Ausente TT (Jornada simple)"
            },
            '3': {
                "cantidad": 0.5,
                "motivo": "Ausente TM"
            },
            '4': {
                "cantidad": 0.5,
                "motivo": "Ausente TT"
            },
            '5': {
                "cantidad": 0.25,
                "motivo": "Tarde TM"
            },
            '6': {
                "cantidad": 0.25,
                "motivo": "Tarde TT"
            }
        }
        let arr = [];
        for(let i = 0 ; i < id.length ; i++){
            let just = 0;
            if(justificado){
                just = justificado.includes(id[i]) ? 1:0;
            }
            let {cantidad, motivo} = tiposInasistencia[inasistencia[i]];
            arr.push(
                [
                    just, motivo, cantidad, fecha[i], id[i],id_creador
                ]
            );
            // arr.push({
            //     tipo: just,
            //     motivo,
            //     cantidad,
            //     fecha: fecha[i],
            //     id_us: id[i],
            //     id_creador
            // });
        }

        return arr;
    }
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