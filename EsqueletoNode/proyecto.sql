--mysql -u root  < proyecto.sql
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
  `ID Curso` int(11) NOT NULL,
  `Padre` int(11) NOT NULL
);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `curso`
--

CREATE TABLE `curso` (
  ID int(11) NOT NULL AUTO_INCREMENT,
  `Nombre curso` varchar(70) NOT NULL,
  PRIMARY KEY (ID)
);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `fichamedica`
--

CREATE TABLE `fichamedica` (
  `DNI` varchar(11) NOT NULL,
  `Enfermedad` varchar(200) NOT NULL,
  `Internacion` varchar(200) NOT NULL COMMENT 'Razon por la que fue internado',
  `Alergia` varchar(100) NOT NULL,
  `Tratamiento medico` varchar(200) NOT NULL,
  `Quirurjico` varchar(100) NOT NULL COMMENT 'Recibio cirujias?',
  `Discapacidad fisica` varchar(100) NOT NULL COMMENT 'Ej rodilla destrozada no puede hacer movimientos bruscos\r\n',
  `Vacunacion` varchar(3) NOT NULL COMMENT '1',
  `Altura` double NOT NULL,
  `Peso` double NOT NULL,
  `Hospital` varchar(50) NOT NULL COMMENT 'Hospital al cual llamar',
  `Obra social` varchar(20) NOT NULL,
  `N de afiliado obra social` int(11) NOT NULL,
  `Medico cabecera` varchar(50) NOT NULL,
  `Domiciliomed` varchar(50) NOT NULL,
  `Telefono medico` int(11) NOT NULL,
  `Familiar responsable` int(11) NOT NULL
) ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historial_inasistencias`
--

CREATE TABLE `historial_inasistencias` (
  `id_original` int(11) NOT NULL,
  `tipo` tinyint(1) NOT NULL,
  `motivo` varchar(255) NOT NULL,
  `cantidad` int(11) NOT NULL,
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

CREATE TABLE `inasistencias` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tipo` tinyint(1) NOT NULL,
  `motivo` varchar(255) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `id_us` int(11) NOT NULL,
  `id_creador` int(11) NOT NULL,
    PRIMARY KEY (`id`)
) ;

--
-- Disparadores `inasistencias`
--
DELIMITER $$
CREATE TRIGGER `editar-historial` BEFORE UPDATE ON `inasistencias` FOR EACH ROW INSERT INTO historial_inasistencias (id_original, tipo, motivo, cantidad, fecha, id_us, fecha_cambio, id_usuario_modif) VALUES (old.id, old.tipo, old.motivo, old.cantidad, old.fecha, old.id_us, NOW(), old.id_creador)
$$
DELIMITER ;

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
  PRIMARY KEY (`id`)
) ;

-- --------------------------------------------------------
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

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `publicaciones`
--

CREATE TABLE `publicaciones` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(20) NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `autor` int(11) NOT NULL COMMENT 'relacionar con id usuario',
   fecha DATE NOT NULL,
    PRIMARY KEY (`id`)
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
-- Estructura de tabla para la tabla `superusuarios`
--

CREATE TABLE `superusuarios` (
  `id` int(11) NOT NULL,
  `fecha_creacion` date NOT NULL
);

CREATE TABLE `colegio` (
  id int(11) NOT NULL AUTO_INCREMENT,
  `pago` tinyint(1) NOT NULL,
  `superusuario` int(11) NOT NULL,
  PRIMARY KEY (id)
);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
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
   PRIMARY KEY (id)
);

--
-- Disparadores `usuarios`
--


DELIMITER $$
CREATE TRIGGER `borrar fichamedica` BEFORE DELETE ON `usuarios`
 FOR EACH ROW DELETE FROM fichamedica WHERE fichamedica.DNI = OLD.DNI
 $$
 DELIMITER ;

 DELIMITER $$
 CREATE TRIGGER `cargadnionlyalum` AFTER INSERT ON `usuarios`
 FOR EACH ROW IF COALESCE(new.Tipo_de_usuario) = 6 THEN BEGIN
INSERT INTO fichamedica (DNI) VALUES (concat(new.DNI));
INSERT INTO alumno (id) VALUES (new.id);
END; END IF
$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER `carga padre only` AFTER INSERT ON `usuarios`
 FOR EACH ROW IF COALESCE(new.Tipo_de_usuario) = 5 THEN BEGIN
INSERT INTO padres (ID) VALUES (concat(new.ID));
END; END IF$$
DELIMITER ;
--
-- Índices para tablas volcadas
--
  CREATE TABLE `mensajes` (
    id int(11) NOT NULL AUTO_INCREMENT,
    chatroom int(11) NOT NULL,
    id_emisor int(11) NOT NULL,
    contenido mediumtext NOT NULL,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    PRIMARY KEY (id)
  );

  CREATE TABLE `sala_chat` (
    id_chat int(11) NOT NULL AUTO_INCREMENT,
    id_usuario int(11) NOT NULL,
    PRIMARY KEY (id_chat)
  );

--



/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
INSERT INTO `curso` (`Nombre curso`) VALUES ( '7C');
INSERT INTO `materias` (`Materia`, `IdCurso`, `profesor`) VALUES ( 'Matematicas', 1, 4), ( 'Lengua', 1, 4);

INSERT INTO `notas` (`id_alum`, `Id_materia`, `nota`,`trimestre`) VALUES ( 6, 1, 1, 1), ( 6, 1, 10, 1), (6, 1, 9, 1), (6, 1, 5, 1), (6, 2, 4, 1), (6, 2, 7, 1), (6, 2, 8, 1), (6, 2, 9, 1);
INSERT INTO `notas` (`id_alum`, `Id_materia`, `nota`,`trimestre`) VALUES ( 6, 1, 1, 2), ( 6, 1, 10, 2), (6, 1, 9, 2), (6, 1, 5, 2), (6, 2, 4, 2), (6, 2, 7, 2), (6, 2, 8, 2), (6, 2, 9, 2);
INSERT INTO `notas` (`id_alum`, `Id_materia`, `nota`,`trimestre`) VALUES ( 6, 1, 1, 3), ( 6, 1, 10, 3), (6, 1, 9, 3), (6, 1, 5, 3), (6, 2, 4, 3), (6, 2, 7, 3), (6, 2, 8, 3), (6, 2, 9, 3);

INSERT INTO `usuarios` (`id` , `DNI`, `Nombre`, `username`, `Sexo`, `Numero_de_telefono`, `Tipo_de_usuario`, `password`, `Fecha_de_nacimiento`, `colegio`) VALUES(0, 0, '0', '0', 'F', 00000000, 0, '$2a$10$6lmlEuJRZ6bxbskY05sFCeyL8VZOH1L3ifJi0CQ0f0AS306QFnleq', '0000-0-00', 0);
INSERT INTO `usuarios` (`DNI`, `Nombre`, `username`, `Sexo`, `Numero_de_telefono`, `Tipo_de_usuario`, `password`, `Fecha_de_nacimiento`, `colegio`) VALUES(1, '1', '1', 'M', 11111111, 1, '$2a$10$6lmlEuJRZ6bxbskY05sFCeyL8VZOH1L3ifJi0CQ0f0AS306QFnleq', '1111-1-11', 0), (2, '2', '2', 'F', 22222222, 2, '$2a$10$6lmlEuJRZ6bxbskY05sFCeyL8VZOH1L3ifJi0CQ0f0AS306QFnleq', '2222-2-22', 0),  (3, '3', '3', 'F', 33333333, 3, '$2a$10$6lmlEuJRZ6bxbskY05sFCeyL8VZOH1L3ifJi0CQ0f0AS306QFnleq', '3333-3-3', 0), (4, '4', '4', 'M', 44444444, 4, '$2a$10$6lmlEuJRZ6bxbskY05sFCeyL8VZOH1L3ifJi0CQ0f0AS306QFnleq', '4444-4-4', 0), (5, '5', '5', 'F', 55555555, 5, '$2a$10$6lmlEuJRZ6bxbskY05sFCeyL8VZOH1L3ifJi0CQ0f0AS306QFnleq', '5555-5-5', 0), (6, '6', '6', 'M', 66666666, 6, '$2a$10$6lmlEuJRZ6bxbskY05sFCeyL8VZOH1L3ifJi0CQ0f0AS306QFnleq', '6666-6-6', 0);
INSERT INTO `inasistencias`(`tipo`, `motivo`, `cantidad`, `fecha`, `id_us`, `id_creador`) VALUES (1, "Tarde por ir al medico", 0, "2022-6-4", 6, 3), (0,"Inasistencia total", 1, "2022-5-23", 6, 3);
INSERT INTO `colegio`(`pago`,`superusuario`) VALUES (1,0);
INSERT INTO `superusuarios`(`id`,`fecha_creacion`) VALUES (0,"2012-2-15");
UPDATE `alumno` SET  `ID Curso`= 1, `Padre`=5 WHERE `ID` = 6;  
UPDATE fichamedica SET `Enfermedad` = "Sida", `Internacion` = "Internacion debido a cirujia por apendicitis", `Alergia` = "Intolerancia a la lactosa", `Tratamiento medico` = "Antibioticos", `Quirurjico` = "Cirujia por apendicitis. 7 puntos sector inferior izquierdo del abdomen", `Vacunacion` = "En fecha", `Altura` = 1.45, `Peso` = 93.5, `Hospital` = "Hospital italiano", `Obra social` = "Osecac", `N de afiliado obra social` = 112312312312, `Medico cabecera` = "Dr Michael Morbius", `Domiciliomed` = "Antesana 247", `Telefono medico` = 2133352223, `Familiar responsable` = 5 WHERE `DNI` = "6";

INSERT INTO `publicaciones` (`titulo`, `descripcion`, `autor`) VALUES ('Aniversario del Noba', 'Hoy recordamos un tragico accidente que se llevo a uno de los mas prometedores musicos de el siglo 21. Descansa en paz Lautaro.', '2', "2022-7-4")
