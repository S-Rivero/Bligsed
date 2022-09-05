--Obtener todas las materias de un profesor
SELECT ID, Materia FROM `materias` WHERE profesor = 4;

--Obtener todos los cursos de un profesor
SELECT c.Nombre_curso as Curso, Mat.ID as IdMateria, Mat.Materia as Materia FROM curso c INNER JOIN (SELECT ID, Materia, IdCurso FROM `materias` WHERE profesor = 4) Mat ON c.ID = Mat.IdCurso;

--Obtener todos los id de alumnos de un curso
-- SELECT a.id as idAlumno FROM alumno a 
-- JOIN (SELECT c.Nombre_curso as Curso, Mat.ID as IdMateria, Mat.IdCurso as IdCurso, Mat.Materia as Materia FROM curso c INNER JOIN (SELECT ID, Materia, IdCurso FROM `materias` WHERE profesor = 4) Mat ON c.ID = Mat.IdCurso) Cur ON Cur.IdCurso = a.ID_Curso;
SELECT a.id as idAlumno FROM alumno a JOIN curso c ON a.ID_Curso = c.ID WHERE c.ID = 1;