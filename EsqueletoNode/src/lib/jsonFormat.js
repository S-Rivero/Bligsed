module.exports = {
    JSONPromediosAl: function(json){
        let formateado = {};
        let materias = {};
        let max = {};
        let maxNotas = 0;
        let contNotas = 0;
        let maxMateria = '';
        let band = 0;
        json.forEach(j => {
            if(!(j.Materia in materias)){
                contNotas = 0;
                materias[j.Materia] = [];
                band++;
            }
            contNotas++;
            materias[j.Materia].push(j.nota);
            if(band == 1){
                maxMateria = j.Materia;
                maxNotas = contNotas;
            }else{
                if(contNotas > maxNotas){
                    maxNotas = contNotas;
                    maxMateria = j.Materia;
                }
            }
        });
        formateado['materias'] = materias;
        max['materia'] = maxMateria;
        max['cantidad'] = maxNotas;
        formateado['max'] = max;
        return formateado;
    },

    JSONListaDeCursos: function(arrJson){
        let cursos = [];
        let anio = 0;
        let curso = {}
        arrJson.forEach(json => {
            if(parseInt(json.Curso[0]) > anio){
                if(anio != 0){
                    cursos.push(curso);
                    curso = {division: []};
                }
                anio = parseInt(json.Curso[0]);
                curso['year'] = parseInt(json.Curso[0]);
                curso['division'].push(json.Curso[1]);
            }
        });
        console.log(cursos);

        return cursos;

        
    }
}

// notas = {
//     lengua: {
//         notas: [10,2,4]
//     },
//     matematica: {
//         notas: [2,4,6]
//     }
// }