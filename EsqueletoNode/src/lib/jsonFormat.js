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