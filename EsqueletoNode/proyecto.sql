-- mysql -u root  < proyecto.sql

-- phpMyAdmin SQL Dump
-- version 5.1.3
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 06-06-2022 a las 21:04:05
-- Versión del servidor: 10.4.24-MariaDB
-- Versión de PHP: 7.4.29
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `proyecto`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `alumno`
--
CREATE DATABASE proyecto;
USE proyecto;

CREATE TABLE `alumno` (
  `ID` int(11) NOT NULL,
  `ID_Curso` int(11) NOT NULL,
  `Padre` int(11) NOT NULL
);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `curso`
--

CREATE TABLE `curso` (
  ID int(11) NOT NULL AUTO_INCREMENT,
  `Nombre_curso` varchar(70) NOT NULL,
  PRIMARY KEY (ID)
);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `fichamedica`
--

CREATE TABLE `fichamedica` (
  `DNI` varchar(11) NOT NULL,
  `Obra_social` varchar(20) NOT NULL,
  `N_de_afiliado_obra_social` int(11) NOT NULL,
  `Enfermedad` varchar(200) NOT NULL,
  `Internacion` varchar(200) NOT NULL COMMENT 'Razon por la que fue internado',
  `Alergia` varchar(100) NOT NULL,
  `manifestalergia` varchar (100) NOT NULL,
  `Tratamiento_medico` varchar(200) NOT NULL,
  `edad_quirurjico` int (11) NOT NULL,
  `Quirurjico` varchar(100) NOT NULL COMMENT 'Recibio cirujias?',
  `Discapacidad_fisica` varchar(100) NOT NULL COMMENT 'Ej rodilla destrozada no puede hacer movimientos bruscos\r\n',
  `problemas_salud` varchar (100) NOT NULL,
  `Vacunacion` varchar(3) NOT NULL COMMENT '1',
  `Altura` int (11) NOT NULL,
  `Peso` double NOT NULL,
  `Hospital` varchar(100) NOT NULL COMMENT 'Hospital al cual llamar',
  `localidad` varchar (100) NOT NULL,
  `N_telehospit` int (11) NOT NULL,
  `Medico_cabeceraln` varchar(50) NOT NULL,
  `Medico_cabecerafn` varchar(50) NOT NULL,
  `Domiciliomed` varchar(50) NOT NULL,
  `Telefono_medico` int(11) NOT NULL,
  `Familiar_responsableln` varchar(40) NOT NULL,
  `Familiar_responsablefn` varchar(40) NOT NULL,
  `Telefono_familiar` int(11) NOT NULL,
 `id_us` int (11) NOT NULL
) ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historial_inasistencias`
--

CREATE TABLE `historial_inasistencias` (
  `id_original` int(11) NOT NULL,
  `tipo` tinyint(1) ,
  `motivo` varchar(255) NOT NULL,
  `cantidad` double NOT NULL,
  `fecha` date NOT NULL,
  `id_us` int(11) NOT NULL,
  `fecha_cambio` date NOT NULL,
  `id_usuario_modif` int(11) NOT NULL
) ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historial_notas`
--

CREATE TABLE `historial_notas` (
  `id` int(11) NOT NULL,
  `id_alum` int(11) NOT NULL,
  `id_materia` int(11) NOT NULL,
  `fecha_cambion` date NOT NULL,
  `nota` int(11) NOT NULL
) ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inasistencias`
--

CREATE TABLE `finales` (
  `id` int(11) NOT NULL,
  `id_alumno` int(11) NOT NULL,
  `id_materia` int(11) NOT NULL,
  `trimestre` int(11) NOT NULL COMMENT '1,2,3 son para el valor de trimestre si no es ninguna de eso asumis que es final',
  `valor` int(11) NOT NULL
);


CREATE TABLE `inasistencias` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tipo` tinyint(1) ,
  `motivo` varchar(255) NOT NULL,
  `cantidad` double NOT NULL,
  `fecha` date NOT NULL,
  `id_us` int(11) NOT NULL,
  `id_creador` int(11) NOT NULL,
    PRIMARY KEY (`id`)
) ;

--
-- Disparadores `inasistencias`
--
--Permite dejar un registro de todas las asistencias que son borradas de la tabla principal para recuperacion en caso de que por alguna razon un tercero modifique las inasistencias

DELIMITER $$
CREATE TRIGGER `editar-historial` BEFORE UPDATE ON `inasistencias` FOR EACH ROW INSERT INTO historial_inasistencias (id_original, tipo, motivo, cantidad, fecha, id_us, fecha_cambio, id_usuario_modif) VALUES (old.id, old.tipo, old.motivo, old.cantidad, old.fecha, old.id_us, NOW(), old.id_creador)
$$
DELIMITER ;
--Permite dejar un registro de todas las asistencias que son borradas de la tabla principal para recuperacion en caso de que por alguna razon se borre incorrectamente la inasistencia

DELIMITER $$
CREATE TRIGGER `borrar-inasistencias` BEFORE DELETE ON `inasistencias`
 FOR EACH ROW INSERT INTO historial_inasistencias (id_original, tipo, motivo, cantidad, fecha, id_us, fecha_cambio, id_usuario_modif) VALUES (old.id, old.tipo, old.motivo, old.cantidad, old.fecha, old.id_us, NOW(), old.id_creador)
 $$
 DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `materias`
--

CREATE TABLE `materias` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Materia` varchar(70) NOT NULL,
  `IdCurso` int(11) NOT NULL,
  `profesor` int(11) NOT NULL,
  PRIMARY KEY (`ID`),
  FOREIGN KEY (`IdCurso`) REFERENCES `curso` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notas`
--

CREATE TABLE `notas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_alum` int(11) NOT NULL COMMENT 'foranea tabla alumnos',
  `id_materia` int(11) NOT NULL COMMENT 'foranea tabla alumno',
  `nota` int(11) NOT NULL,
  trimestre int(11) NOT NULL,
  numnota int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ;

-- --------------------------------------------------------
--Ayuda a llevar un registro sobre todas las notas modificadas por un profesor con todos sus valores anteriores

DELIMITER $$
CREATE TRIGGER `carganotas` BEFORE UPDATE ON `notas`
 FOR EACH ROW INSERT INTO historial_notas 
(id, id_alum, id_materia, fecha_cambion, nota) VALUES (old.id, old.id_alum, old.id_materia, NOW(), old.nota)
$$
DELIMITER ;
--
-- Estructura de tabla para la tabla `padres`
--

CREATE TABLE `padres` (
  `ID` int(11) NOT NULL
);

CREATE TABLE `profesores` (
  `ID` int(11) NOT NULL
);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`session_id`)
);

-- --------------------------------------------------------

--
--

CREATE TABLE `superusuarios` (
  `id` int(11) NOT NULL,
  `fecha_creacion` date NOT NULL,
  estado_pago tinyint(1)
);

CREATE TABLE `colegio` (
  id int(11) NOT NULL AUTO_INCREMENT,
  `pago` tinyint(1) NOT NULL,
  `superusuario` int(11) NOT NULL,
  PRIMARY KEY (id)
);

-- --------------------------------------------------------

--
--

CREATE TABLE `usuarios` (
  id int(11) NOT NULL AUTO_INCREMENT,
  `DNI` varchar(11) NOT NULL,
  `Nombre` varchar(65) NOT NULL,
  `username` varchar(50) NOT NULL,
  `Sexo` varchar(1) NOT NULL,
  `Numero_de_telefono` int(11) NOT NULL,
  `Tipo_de_usuario` tinyint(4) NOT NULL,
  `password` char(250) NOT NULL,
  `Fecha_de_nacimiento` date NOT NULL,
  `colegio` int(11) NOT NULL,
  domicilio varchar(100) NOT NULL,
   PRIMARY KEY (id)
);

--
-- Disparadores `usuarios`
--

--Trigger que borra la ficha medica del alumno en caso  de que este haya sido retirado del sistema

DELIMITER $$
CREATE TRIGGER `borrar fichamedica` BEFORE DELETE ON `usuarios`
 FOR EACH ROW DELETE FROM fichamedica WHERE fichamedica.DNI = OLD.DNI
 $$
 DELIMITER ;
--Trigger que crea una fila de ficha medica y autocompleta el DNI de la misma con el DNI del alumno recien creado

 DELIMITER $$
 CREATE TRIGGER `cargadnionlyalum` AFTER INSERT ON `usuarios`
 FOR EACH ROW IF COALESCE(new.Tipo_de_usuario) = 6 THEN BEGIN
INSERT INTO fichamedica (DNI, id_us, localidad) VALUES (concat(new.DNI), concat(new.id), concat(new.domicilio));
INSERT INTO alumno (id) VALUES (new.id);
END; END IF
$$
DELIMITER ;
--Crea un registro dentro de la tabla padres de manera automatica despues de que un usuario de tipo padre sea creado

DELIMITER $$
CREATE TRIGGER `carga padre only` AFTER INSERT ON `usuarios`
 FOR EACH ROW IF COALESCE(new.Tipo_de_usuario) = 5 THEN BEGIN
INSERT INTO padres (ID) VALUES (concat(new.ID));
END; END IF$$
DELIMITER ;

--Crea un registro dentro de la tabla profesores de manera automatica despues de que un usuario tipo profesor sea creado
DELIMITER $$
CREATE TRIGGER `cargaprofe` AFTER INSERT ON `usuarios`
 FOR EACH ROW IF COALESCE(new.Tipo_de_usuario) = 4 THEN BEGIN
INSERT INTO profesores (ID) VALUES (concat(new.ID));
END; END IF $$ 
DELIMITER ;


/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;


INSERT INTO `curso` (`Nombre_curso`) VALUES ( '7C'), ('6D'), ('1A'), ('5D');
INSERT INTO `materias` (`Materia`, `IdCurso`, `profesor`) VALUES ( 'Matematicas', 1, 4), ( 'Lengua', 1, 4), ( 'Computacion', 3, 7), ( 'Naturales', 2, 4), ( 'Quimica', 3, 4), ( 'Redes', 4, 7);

INSERT INTO `notas` (`id_alum`, `Id_materia`, `nota`,`trimestre`, numnota) VALUES ( 6, 1, 1, 1, 1), ( 6, 1, 10, 1, 2), (6, 1, 9, 1, 3), (6, 1, 5, 1, 4), (6, 2, 4, 1, 5), (6, 2, 7, 1, 6), (6, 2, 8, 1, 7), (6, 2, 9, 1, 8);
INSERT INTO `notas` (`id_alum`, `Id_materia`, `nota`,`trimestre`, numnota) VALUES ( 6, 1, 1, 2, 1), ( 6, 1, 10, 2, 2), (6, 1, 9, 2, 3), (6, 1, 5, 2, 4), (6, 2, 4, 2, 5), (6, 2, 7, 2, 6), (6, 2, 8, 2, 7), (6, 2, 9, 2, 8);
INSERT INTO `notas` (`id_alum`, `Id_materia`, `nota`,`trimestre`, numnota) VALUES ( 6, 1, 1, 3, 1), ( 6, 1, 10, 3, 2), (6, 1, 9, 3, 3), (6, 1, 5, 3, 4), (6, 2, 4, 3, 5), (6, 2, 7, 3, 6), (6, 2, 8, 3, 7), (6, 2, 9, 3, 8);

INSERT INTO `usuarios` (`id` , `DNI`, `Nombre`, `username`, `Sexo`, `Numero_de_telefono`, `Tipo_de_usuario`, `password`, `Fecha_de_nacimiento`, `colegio`) VALUES(0, 0, '0', '0', 'F', 00000000, 0, '$2a$10$6lmlEuJRZ6bxbskY05sFCeyL8VZOH1L3ifJi0CQ0f0AS306QFnleq', '0000-0-00', 0);
INSERT INTO `usuarios` (`DNI`, `Nombre`, `username`, `Sexo`, `Numero_de_telefono`, `Tipo_de_usuario`, `password`, `Fecha_de_nacimiento`, `colegio`, `domicilio`) VALUES(1, '1', '1', 'M', 11111111, 1, '$2a$10$6lmlEuJRZ6bxbskY05sFCeyL8VZOH1L3ifJi0CQ0f0AS306QFnleq', '1111-1-11', 0, 'florencio varela'), (2, '2', '2', 'F', 22222222, 2, '$2a$10$6lmlEuJRZ6bxbskY05sFCeyL8VZOH1L3ifJi0CQ0f0AS306QFnleq', '2222-2-22', 0, 'Chacabuco'),  (3, '3', '3', 'F', 33333333, 3, '$2a$10$6lmlEuJRZ6bxbskY05sFCeyL8VZOH1L3ifJi0CQ0f0AS306QFnleq', '3333-3-3', 0, 'Villa Tesei'), (4, '4', '4', 'M', 44444444, 4, '$2a$10$6lmlEuJRZ6bxbskY05sFCeyL8VZOH1L3ifJi0CQ0f0AS306QFnleq', '4444-4-4', 0, 'maleante keloke'), (5, '5', '5', 'F', 55555555, 5, '$2a$10$6lmlEuJRZ6bxbskY05sFCeyL8VZOH1L3ifJi0CQ0f0AS306QFnleq', '5555-5-5', 0, 'Lazytown'), (6, '6', '6', 'M', 66666666, 6, '$2a$10$6lmlEuJRZ6bxbskY05sFCeyL8VZOH1L3ifJi0CQ0f0AS306QFnleq', '6666-6-6', 0, 'Calle bolivia'), (20000000, 'Carlos', 'Carlos', 'M', 47474747, 4, '$2a$10$6lmlEuJRZ6bxbskY05sFCeyL8VZOH1L3ifJi0CQ0f0AS306QFnleq', '1990-6-6', 0, 'Calle profesor random');
INSERT INTO `inasistencias`(`tipo`, `motivo`, `cantidad`, `fecha`, `id_us`, `id_creador`) VALUES (1, "Tarde por ir al medico", 0, "2022-6-4", 6, 3), (0,"Inasistencia total", 1, "2022-5-23", 6, 3);
INSERT INTO `colegio`(`pago`,`superusuario`) VALUES (1,0);
INSERT INTO `superusuarios`(`id`,`fecha_creacion`) VALUES (0,"2012-2-15");
UPDATE `alumno` SET  `ID_Curso`= 1, `Padre`=5 WHERE `ID` = 6;  
UPDATE fichamedica SET `Enfermedad` = "Sida", `Internacion` = "Internacion debido a cirujia por apendicitis", `Alergia` = "Intolerancia a la lactosa", `Tratamiento_medico` = "Antibioticos", `Quirurjico` = "Cirujia por apendicitis. 7 puntos sector inferior izquierdo del abdomen", `Vacunacion` = "1", `Altura` = 145, `Peso` = 93.5, `Hospital` = "Hospital italiano", `Obra_social` = "Osecac", `N_de_afiliado_obra_social` = 112312312312, `Medico_cabeceraln` = "Morbius", `Medico_cabecerafn` = "Michael", `Domiciliomed` = "Antesana 247", `Telefono_medico` = 2133352223;

INSERT INTO `usuarios` (`DNI`, `Nombre`, `username`, `Sexo`, `Numero_de_telefono`, `Tipo_de_usuario`, `password`, `Fecha_de_nacimiento`, `colegio`) VALUES(4636463, 'Juan Ignacio Perez De Barradas', 'Juan', 'M', 00000000, 6, '$2a$10$6lmlEuJRZ6bxbskY05sFCeyL8VZOH1L3ifJi0CQ0f0AS306QFnleq', '2003-8-10', 0);
INSERT INTO `usuarios` (`DNI`, `Nombre`, `username`, `Sexo`, `Numero_de_telefono`, `Tipo_de_usuario`, `password`, `Fecha_de_nacimiento`, `colegio`) VALUES(5532463, 'Goblin', 'goblino', 'M', 00000001, 6, '$2a$10$6lmlEuJRZ6bxbskY05sFCeyL8VZOH1L3ifJi0CQ0f0AS306QFnleq', '2000-2-10', 0);
INSERT INTO `usuarios` (`DNI`, `Nombre`, `username`, `Sexo`, `Numero_de_telefono`, `Tipo_de_usuario`, `password`, `Fecha_de_nacimiento`, `colegio`) VALUES(2036463, 'Amonger3296', 'Mogus', 'M', 00003296, 6, '$2a$10$6lmlEuJRZ6bxbskY05sFCeyL8VZOH1L3ifJi0CQ0f0AS306QFnleq', '2001-3-10', 0);
INSERT INTO `usuarios` (`DNI`, `Nombre`, `username`, `Sexo`, `Numero_de_telefono`, `Tipo_de_usuario`, `password`, `Fecha_de_nacimiento`, `colegio`) VALUES(0036463, 'Buzardo', 'BZC', 'M', 00041246, 6, '$2a$10$6lmlEuJRZ6bxbskY05sFCeyL8VZOH1L3ifJi0CQ0f0AS306QFnleq', '2006-5-10', 0);

UPDATE `alumno` SET  `ID_Curso`= 1, `Padre`=5 WHERE `ID` = 8;  
UPDATE `alumno` SET  `ID_Curso`= 1, `Padre`=5 WHERE `ID` = 9;  
UPDATE `alumno` SET  `ID_Curso`= 1, `Padre`=5 WHERE `ID` = 10;  
UPDATE `alumno` SET  `ID_Curso`= 1, `Padre`=5 WHERE `ID` = 11;  

INSERT INTO `notas` (`id_alum`, `Id_materia`, `nota`,`trimestre`, numnota) VALUES ( 8, 1, 1, 1, 1), ( 8, 1, 10, 1, 2), (8, 1, 9, 1, 3), (8, 1, 5, 1,  4), (8, 2, 4, 1, 5), (8, 2, 7, 1, 6), (8, 2, 8, 1, 7), (8, 2, 9, 1, 8);
INSERT INTO `notas` (`id_alum`, `Id_materia`, `nota`,`trimestre`, numnota) VALUES ( 8, 1, 1, 2, 1), ( 8, 1, 10, 2, 2), (8, 1, 9, 2, 3), (8, 1, 5, 2, 4), (8, 2, 4, 2, 5), (8, 2, 7, 2, 6), (8, 2, 8, 2, 7), (8, 2, 9, 2, 8);
INSERT INTO `notas` (`id_alum`, `Id_materia`, `nota`,`trimestre`, numnota) VALUES ( 8, 1, 1, 3, 1), ( 8, 1, 10, 3, 2), (8, 1, 9, 3, 3), (8, 1, 5, 3, 4), (8, 2, 4, 3, 5), (8, 2, 7, 3, 6), (8, 2, 8, 3, 7), (8, 2, 9, 3, 8);

INSERT INTO `notas` (`id_alum`, `Id_materia`, `nota`,`trimestre`, numnota) VALUES ( 9, 1, 1, 1, 1), ( 9, 1, 10, 1, 2), (9, 1, 9, 1, 3), (9, 1, 5, 1, 4), (9, 2, 4, 1, 5), (9, 2, 7, 1, 6), (9, 2, 8, 1, 7), (9, 2, 9, 1, 8);
INSERT INTO `notas` (`id_alum`, `Id_materia`, `nota`,`trimestre`, numnota) VALUES ( 9, 1, 1, 2, 1), ( 9, 1, 10, 2, 2), (9, 1, 9, 2, 3), (9, 1, 5, 2, 4), (9, 2, 4, 2, 5), (9, 2, 7, 2, 6), (9, 2, 8, 2, 7), (9, 2, 9, 2, 8);
INSERT INTO `notas` (`id_alum`, `Id_materia`, `nota`,`trimestre`, numnota) VALUES ( 9, 1, 1, 3, 1), ( 9, 1, 10, 3, 2), (9, 1, 9, 3, 3), (9, 1, 5, 3, 4), (9, 2, 4, 3, 5), (9, 2, 7, 3, 6), (9, 2, 8, 3, 7), (9, 2, 9, 3, 8);

INSERT INTO `notas` (`id_alum`, `Id_materia`, `nota`,`trimestre`, numnota) VALUES ( 10, 1, 1, 1, 1), ( 10, 1, 10, 1, 2), (10, 1, 9, 1, 3), (10, 1, 5, 1, 4), (10, 2, 4, 1, 5), (10, 2, 7, 1, 6), (10, 2, 8, 1, 7), (10, 2, 9, 1, 8);
INSERT INTO `notas` (`id_alum`, `Id_materia`, `nota`,`trimestre`, numnota) VALUES ( 10, 1, 1, 2, 1), ( 10, 1, 10, 2, 2), (10, 1, 9, 2, 3), (10, 1, 5, 2, 4), (10, 2, 4, 2, 5), (10, 2, 7, 2, 6), (10, 2, 8, 2, 7), (10, 2, 9, 2, 8);
INSERT INTO `notas` (`id_alum`, `Id_materia`, `nota`,`trimestre`, numnota) VALUES ( 10, 1, 1, 3, 1), ( 10, 1, 10, 3, 2), (10, 1, 9, 3, 3), (10, 1, 5, 3, 4), (10, 2, 4, 3, 5), (10, 2, 7, 3, 6), (10, 2, 8, 3, 7), (10, 2, 9, 3, 8);

INSERT INTO `notas` (`id_alum`, `Id_materia`, `nota`,`trimestre`, numnota) VALUES ( 11, 1, 1, 1, 1), ( 11, 1, 10, 1, 2), (11, 1, 9, 1, 3), (11, 1, 5, 1, 4), (11, 2, 4, 1, 5), (11, 2, 7, 1, 6), (11, 2, 8, 1, 7), (11, 2, 9, 1, 8);
INSERT INTO `notas` (`id_alum`, `Id_materia`, `nota`,`trimestre`, numnota) VALUES ( 11, 1, 1, 2, 1), ( 11, 1, 10, 2, 2), (11, 1, 9, 2, 3), (11, 1, 5, 2, 4), (11, 2, 4, 2, 5), (11, 2, 7, 2, 6), (11, 2, 8, 2, 7), (11, 2, 9, 2, 8);
INSERT INTO `notas` (`id_alum`, `Id_materia`, `nota`,`trimestre`, numnota) VALUES ( 11, 1, 1, 3, 1), ( 11, 1, 10, 3, 2), (11, 1, 9, 3, 3), (11, 1, 5, 3, 4), (11, 2, 4, 3, 5), (11, 2, 7, 3, 6), (11, 2, 8, 3, 7), (11, 2, 9, 3, 8);










INSERT INTO `usuarios` (`DNI`, `Nombre`, `username`, `Sexo`, `Numero_de_telefono`, `Tipo_de_usuario`, `password`, `Fecha_de_nacimiento`, `colegio`, `domicilio`) VALUES(10000000, 'administrador1', 'admin', 'M', 43377237, 1, '$2a$10$6lmlEuJRZ6bxbskY05sFCeyL8VZOH1L3ifJi0CQ0f0AS306QFnleq', 1962-05-22, 0, 'Ramos Mejia');

INSERT INTO `usuarios` (`DNI`, `Nombre`, `username`, `Sexo`, `Numero_de_telefono`, `Tipo_de_usuario`, `password`, `Fecha_de_nacimiento`, `colegio`, `domicilio`) VALUES(20000000, 'directivo1', 'director', 'M', 21235466, 2, '$2a$10$6lmlEuJRZ6bxbskY05sFCeyL8VZOH1L3ifJi0CQ0f0AS306QFnleq', 1965-01-15, 0, 'Haedo');

INSERT INTO `usuarios` (`DNI`, `Nombre`, `username`, `Sexo`, `Numero_de_telefono`, `Tipo_de_usuario`, `password`, `Fecha_de_nacimiento`, `colegio`, `domicilio`) VALUES(30000000, 'preceptor1', 'preceptor', 'M', 4449968, 3, '$2a$10$6lmlEuJRZ6bxbskY05sFCeyL8VZOH1L3ifJi0CQ0f0AS306QFnleq', 1982-07-27, 0, 'Quilmes');

INSERT INTO `usuarios` (`DNI`, `Nombre`, `username`, `Sexo`, `Numero_de_telefono`, `Tipo_de_usuario`, `password`, `Fecha_de_nacimiento`, `colegio`, `domicilio`) VALUES(40000000, 'profesor1', 'profesor', 'M', 72377237, 4, '$2a$10$6lmlEuJRZ6bxbskY05sFCeyL8VZOH1L3ifJi0CQ0f0AS306QFnleq', 1992-03-10, 0, 'La Matanza');

INSERT INTO `usuarios` (`DNI`, `Nombre`, `username`, `Sexo`, `Numero_de_telefono`, `Tipo_de_usuario`, `password`, `Fecha_de_nacimiento`, `colegio`, `domicilio`) VALUES(50000000, 'padre1', 'padre1', 'M', 12345678, 5, '$2a$10$6lmlEuJRZ6bxbskY05sFCeyL8VZOH1L3ifJi0CQ0f0AS306QFnleq', 1978-05-22, 0, 'La Boca');

INSERT INTO `usuarios` (`DNI`, `Nombre`, `username`, `Sexo`, `Numero_de_telefono`, `Tipo_de_usuario`, `password`, `Fecha_de_nacimiento`, `colegio`, `domicilio`) VALUES(55435555, 'padre2', 'padre2', 'M', 59083546, 5, '$2a$10$6lmlEuJRZ6bxbskY05sFCeyL8VZOH1L3ifJi0CQ0f0AS306QFnleq', 1942-12-10, 0, 'Caballito');

INSERT INTO `usuarios` (`DNI`, `Nombre`, `username`, `Sexo`, `Numero_de_telefono`, `Tipo_de_usuario`, `password`, `Fecha_de_nacimiento`, `colegio`, `domicilio`) VALUES(60660686, 'alumno1', 'alumno1', 'M', 15849876, 6, '$2a$10$6lmlEuJRZ6bxbskY05sFCeyL8VZOH1L3ifJi0CQ0f0AS306QFnleq', 2004-03-26, 0, 'La Boca');

INSERT INTO `usuarios` (`DNI`, `Nombre`, `username`, `Sexo`, `Numero_de_telefono`, `Tipo_de_usuario`, `password`, `Fecha_de_nacimiento`, `colegio`, `domicilio`) VALUES(68526783, 'alumno2', 'alumno2', 'M', 10293847, 6, '$2a$10$6lmlEuJRZ6bxbskY05sFCeyL8VZOH1L3ifJi0CQ0f0AS306QFnleq', 2006-05-22, 0, 'La Boca');

INSERT INTO `usuarios` (`DNI`, `Nombre`, `username`, `Sexo`, `Numero_de_telefono`, `Tipo_de_usuario`, `password`, `Fecha_de_nacimiento`, `colegio`, `domicilio`) VALUES(60264312, 'alumno3', 'alumno3', 'M', 47392742, 6, '$2a$10$6lmlEuJRZ6bxbskY05sFCeyL8VZOH1L3ifJi0CQ0f0AS306QFnleq', 2002-05-22, 0, 'Caballito');

UPDATE `alumno` SET  `ID_Curso`= 1, `Padre`=17 WHERE `ID` = 19;  
UPDATE `alumno` SET  `ID_Curso`= 1, `Padre`=17 WHERE `ID` = 20;  
UPDATE `alumno` SET  `ID_Curso`= 1, `Padre`=18 WHERE `ID` = 21;


UPDATE fichamedica SET `Enfermedad` = "Asma",  `Alergia` = "Intolerancia a la lactosa", `Tratamiento_medico` = "Antibioticos", `Vacunacion` = "1", `Altura` = 170, `Peso` = 60.5, `Hospital` = "Hospital italiano", `Obra_social` = "Osecac", `N_de_afiliado_obra_social` = 112312312312, `Medico_cabeceraln` = "Morbius", `Medico_cabecerafn` = "Michael", `Domiciliomed` = "Antesana 247", `Telefono_medico` = 10293847 WHERE DNI = 68526783;

UPDATE fichamedica SET  `Internacion` = "Internacion debido a cirujia por apendicitis", `Alergia` = "Alergia a las nueces", manifestalergia = "inflamacion y fiebre general", `Tratamiento_medico` = "Antibioticos", `Quirurjico` = "Cirujia por apendicitis.", edad_quirurjico = 15, `Vacunacion` = "1", `Altura` = 140, `Peso` = 35, `Hospital` = "Hospital italiano", `Obra_social` = "Osecac", `N_de_afiliado_obra_social` = 7459353842, `Medico_cabeceraln` = "Morbius", `Medico_cabecerafn` = "Michael", `Domiciliomed` = "Antesana 247", `Telefono_medico` = 2133352223 WHERE DNI = 60660686;

UPDATE fichamedica SET  `Internacion` = "Internacion debido a Traqueotomia", `Quirurjico` = "Traqueotomia", `Vacunacion` = "1", `Altura` = 196, `Peso` = 118, `Hospital` = "Hospital italiano", edad_quirurjico = 12, `Obra_social` = "Osecac", `N_de_afiliado_obra_social` = 8364923648, `Medico_cabeceraln` = "Ford", `Medico_cabecerafn` = "Harrison", `Domiciliomed` = "Antesana 246", `Telefono_medico` = 21333522 WHERE DNI = 60264312;



INSERT INTO `notas` (`id_alum`, `Id_materia`, `nota`,`trimestre`, numnota) VALUES ( 18, 1, 1, 1, 1), ( 18, 1, 10, 1, 2), (18, 1, 9, 1, 3), (18, 1, 5, 1, 4), (18, 2, 4, 1, 5), (18, 2, 7, 1, 6), (18, 2, 8, 1, 7), (18, 2, 9, 1, 8);
INSERT INTO `notas` (`id_alum`, `Id_materia`, `nota`,`trimestre`, numnota) VALUES ( 18, 1, 1, 2, 1), ( 18, 1, 10, 2, 2), (18, 1, 9, 2, 3), (18, 1, 5, 2, 4), (18, 2, 4, 2, 5), (18, 2, 7, 2, 6), (18, 2, 8, 2, 7), (18, 2, 9, 2, 8);
INSERT INTO `notas` (`id_alum`, `Id_materia`, `nota`,`trimestre`, numnota) VALUES ( 18, 1, 1, 3, 1), ( 18, 1, 10, 3, 2), (18, 1, 9, 3, 3), (18, 1, 5, 3, 4), (18, 2, 4, 3, 5), (18, 2, 7, 3, 6), (18, 2, 8, 3, 7), (18, 2, 9, 3, 8);

INSERT INTO `notas` (`id_alum`, `Id_materia`, `nota`,`trimestre`, numnota) VALUES ( 19, 1, 1, 1, 1), ( 19, 1, 10, 1, 2), (19, 1, 9, 1, 3), (19, 1, 5, 1, 4), (19, 2, 4, 1, 5), (19, 2, 7, 1, 6), (19, 2, 8, 1, 7), (19, 2, 9, 1, 8);
INSERT INTO `notas` (`id_alum`, `Id_materia`, `nota`,`trimestre`, numnota) VALUES ( 19, 1, 1, 2, 1), ( 19, 1, 10, 2, 2), (19, 1, 9, 2, 3), (19, 1, 5, 2, 4), (19, 2, 4, 2, 5), (19, 2, 7, 2, 6), (19, 2, 8, 2, 7), (19, 2, 9, 2, 8);
INSERT INTO `notas` (`id_alum`, `Id_materia`, `nota`,`trimestre`, numnota) VALUES ( 19, 1, 1, 3, 1), ( 19, 1, 10, 3, 2), (19, 1, 9, 3, 3), (19, 1, 5, 3, 4), (19, 2, 4, 3, 5), (19, 2, 7, 3, 6), (19, 2, 8, 3, 7), (19, 2, 9, 3, 8);

INSERT INTO `notas` (`id_alum`, `Id_materia`, `nota`,`trimestre`, numnota) VALUES ( 20, 1, 1, 1, 1), ( 20, 1, 10, 1, 2), (20, 1, 9, 1, 3), (20, 1, 5, 1, 4), (20, 2, 4, 1, 5), (20, 2, 7, 1, 6), (20, 2, 8, 1, 7), (20, 2, 9, 1, 8);
INSERT INTO `notas` (`id_alum`, `Id_materia`, `nota`,`trimestre`, numnota) VALUES ( 20, 1, 1, 2, 1), ( 20, 1, 10, 2, 2), (20, 1, 9, 2, 3), (20, 1, 5, 2, 4), (20, 2, 4, 2, 5), (20, 2, 7, 2, 6), (20, 2, 8, 2, 7), (20, 2, 9, 2, 8);
INSERT INTO `notas` (`id_alum`, `Id_materia`, `nota`,`trimestre`, numnota) VALUES ( 20, 1, 1, 3, 1), ( 20, 1, 10, 3, 2), (20, 1, 9, 3, 3), (20, 1, 5, 3, 4), (20, 2, 4, 3, 5), (20, 2, 7, 3, 6), (20, 2, 8, 3, 7), (20, 2, 9, 3, 8);