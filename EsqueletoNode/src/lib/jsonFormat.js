module.exports = {
    JSONPromediosAl: function(json){
        let materias = {};
        json.forEach(j => {
            if(!(j.Materia in materias)){
                materias[j.Materia] = [];
                // return;
            }
            materias[j.Materia].push(j.nota);
        });
        return materias;
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