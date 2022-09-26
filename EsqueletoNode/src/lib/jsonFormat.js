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
    }
    /*[
    { Curso: '7C', IdMateria: 1, Materia: 'Matematicas' },
    { Curso: '6C', IdMateria: 1, Materia: 'Matematicas' },
    { Curso: '6D', IdMateria: 1, Materia: 'Matematicas' }
]*/
}
//[ { anio: 6, division: [ 'D' ] }, { anio: 7, division: [ 'C', 'D' ] } ]