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

    JSONListaAlumnosNotas: function(a,[n,z]){
        return a.map(e => {
            let notasArr = n.filter(r => r.id_alum == e.id_alum).map(j => {
                return {
                    num: j.numnota,
                    nota: j.nota
                }
            });
            let notTrim = z.filter(r => r.id_alumno == e.id_alum);
            let notTrimDef = 0;
            if (notTrim[0]){
                notTrimDef = notTrim[0].valor;
            }
            return {
                id: e.id_alum,
                nombre: e.Nombre,
                notas: notasArr,
                nota_trimestre: notTrimDef
            };
        })
    },

    JSONrenderCargarInasistencias: function({idSeleccionados, idAlumnos, nombreAlumnos}){
        if(typeof idAlumnos == "object"){
            let newArr = [];
            for(let i = 0 ; i < idAlumnos.length ; i++){
                newArr.push({id: idAlumnos[i], nombre: nombreAlumnos[i]});
            }
            return newArr.filter(e => idSeleccionados.includes(e.id));
        }else{
            return [{id: idSeleccionados, nombre: nombreAlumnos}]
        }
    },

    JSONcargarInasistencias: function(id_creador, {id, fecha, inasistencia, justificado}){
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
        let idlen = id.length;
        if(typeof id != "object"){
            let just = 0;
            if(justificado){
                just = justificado.includes(id) ? 1:0;
            }
            let {cantidad, motivo} = tiposInasistencia[inasistencia];
                arr.push(
                    [
                        just, motivo, cantidad, fecha, id,id_creador
                    ]
                );
        }else{
            for(let i = 0 ; i < idlen ; i++){
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
        }
        return arr;
    },

    notasFinalesFormat: function(arr){
        let newArr = [];
        let materias = [];
        if(arr.length){
            arr.forEach(e =>{
                if(!(materias.includes(e.Materia))){
                    materias.push(e.Materia);
                }
            })
            
            return materias.map(m => {
                let notas = [];
                let aux = [];
                let flag = false;
                arr.forEach(e => {
                    if(e.Materia == m){
                        if(e.trimestre == 0){
                            aux.push({valor: e.valor != 0 ? e.valor:'', trimestre: e.trimestre});
                            flag = true;
                        }else{
                            notas.push({valor: e.valor != 0 ? e.valor:'', trimestre: e.trimestre});
                        }
                    }
                });
                if(flag){
                    flag = false;
                    notas.push(aux[0]);
                }
                return{
                    "materia": m,
                    "notas": notas
                };
            })

        }else{
            return {
                materia: arr.Materia,
                notas: [{
                    valor: e.valor != 0 ? e.valor:'',
                    trimestre: arr.trimestre
                }]
            };
        }
    }
}

/*
[
    {
        materia: "lengua",
        notas: [
            {
                valor: 5,
                trimestre: 1
            },
            {
                valor: 2,
                trimestre: 2
            }
        ]
    }
]

[
  { id_materia: 2, Materia: 'Lengua', valor: 10, trimestre: 1 },
  { id_materia: 1, Materia: 'Matematicas', valor: 7, trimestre: 1 },
  { id_materia: 1, Materia: 'Matematicas', valor: 0, trimestre: 2 },
  { id_materia: 1, Materia: 'Matematicas', valor: 0, trimestre: 3 }
]
*/

