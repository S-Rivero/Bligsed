-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 10-11-2022 a las 20:26:48
-- Versión del servidor: 10.4.22-MariaDB
-- Versión de PHP: 8.0.13

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

DROP DATABASE IF EXISTS proyecto;
CREATE DATABASE proyecto;
USE proyecto;

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `cursos` (IN `sus` INT(11))  BEGIN 
SELECT Nombre_curso as C FROM curso WHERE ID = sus;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `alumno`
--

CREATE TABLE `alumno` (
  `ID` int(11) NOT NULL,
  `ID_Curso` int(11) NOT NULL,
  `Padre` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `alumno`
--

INSERT INTO `alumno` (`ID`, `ID_Curso`, `Padre`) VALUES
(6, 1, 5),
(8, 1, 5),
(9, 1, 5),
(10, 1, 5),
(11, 1, 5),
(18, 2, 16),
(19, 3, 16),
(20, 3, 17);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `colegio`
--

CREATE TABLE `colegio` (
  `id` int(11) NOT NULL,
  `pago` tinyint(1) NOT NULL,
  `superusuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `colegio`
--

INSERT INTO `colegio` (`id`, `pago`, `superusuario`) VALUES
(1, 1, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `curso`
--

CREATE TABLE `curso` (
  `ID` int(11) NOT NULL,
  `Nombre_curso` varchar(70) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `curso`
--

INSERT INTO `curso` (`ID`, `Nombre_curso`) VALUES
(1, '7C'),
(2, '6D'),
(3, '1A'),
(4, '5D');

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
  `manifestalergia` varchar(100) NOT NULL,
  `Tratamiento_medico` varchar(200) NOT NULL,
  `edad_quirurjico` int(11) NOT NULL,
  `Quirurjico` varchar(100) NOT NULL COMMENT 'Recibio cirujias?',
  `Discapacidad_fisica` varchar(100) NOT NULL COMMENT 'Ej rodilla destrozada no puede hacer movimientos bruscos\r\n',
  `problemas_salud` varchar(100) NOT NULL,
  `Vacunacion` varchar(3) NOT NULL COMMENT '1',
  `Altura` int(11) NOT NULL,
  `Peso` double NOT NULL,
  `Hospital` varchar(100) NOT NULL COMMENT 'Hospital al cual llamar',
  `localidad` varchar(100) NOT NULL,
  `N_telehospit` int(11) NOT NULL,
  `Medico_cabeceraln` varchar(50) NOT NULL,
  `Medico_cabecerafn` varchar(50) NOT NULL,
  `Domiciliomed` varchar(50) NOT NULL,
  `Telefono_medico` int(11) NOT NULL,
  `Familiar_responsableln` varchar(40) NOT NULL,
  `Familiar_responsablefn` varchar(40) NOT NULL,
  `Telefono_familiar` int(11) NOT NULL,
  `id_us` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `fichamedica`
--

INSERT INTO `fichamedica` (`DNI`, `Obra_social`, `N_de_afiliado_obra_social`, `Enfermedad`, `Internacion`, `Alergia`, `manifestalergia`, `Tratamiento_medico`, `edad_quirurjico`, `Quirurjico`, `Discapacidad_fisica`, `problemas_salud`, `Vacunacion`, `Altura`, `Peso`, `Hospital`, `localidad`, `N_telehospit`, `Medico_cabeceraln`, `Medico_cabecerafn`, `Domiciliomed`, `Telefono_medico`, `Familiar_responsableln`, `Familiar_responsablefn`, `Telefono_familiar`, `id_us`) VALUES
('6', 'Osecac', 2147483647, 'Sida', 'Internacion debido a cirujia por apendicitis', 'Intolerancia a la lactosa', '', 'Antibioticos', 0, 'Cirujia por apendicitis. 7 puntos sector inferior izquierdo del abdomen', '', '', '1', 145, 93.5, 'Hospital italiano', 'Calle bolivia', 0, 'Morbius', 'Michael', 'Antesana 247', 2133352223, '', '', 0, 6),
('4636463', '', 0, '', '', '', '', '', 0, '', '', '', '', 0, 0, '', '', 0, '', '', '', 0, '', '', 0, 8),
('5532463', '', 0, '', '', '', '', '', 0, '', '', '', '', 0, 0, '', '', 0, '', '', '', 0, '', '', 0, 9),
('2036463', '', 0, '', '', '', '', '', 0, '', '', '', '', 0, 0, '', '', 0, '', '', '', 0, '', '', 0, 10),
('36463', '', 0, '', '', '', '', '', 0, '', '', '', '', 0, 0, '', '', 0, '', '', '', 0, '', '', 0, 11),
('60660686', 'Osecac', 2147483647, '', 'Internacion debido a cirujia por apendicitis', 'Alergia a las nueces', 'inflamacion y fiebre general', 'Antibioticos', 15, 'Cirujia por apendicitis.', '', '', '1', 140, 35, 'Hospital italiano', 'La Boca', 0, 'Morbius', 'Michael', 'Antesana 247', 2133352223, '', '', 0, 18),
('68526783', 'Osecac', 2147483647, 'Asma', '', 'Intolerancia a la lactosa', '', 'Antibioticos', 0, '', '', '', '1', 170, 60.5, 'Hospital italiano', 'La Boca', 0, 'Morbius', 'Michael', 'Antesana 247', 10293847, '', '', 0, 19),
('60264312', 'Osecac', 2147483647, '', 'Internacion debido a Traqueotomia', '', '', '', 12, 'Traqueotomia', '', '', '1', 196, 118, 'Hospital italiano', 'Caballito', 0, 'Ford', 'Harrison', 'Antesana 246', 21333522, '', '', 0, 20);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `finales`
--

CREATE TABLE `finales` (
  `id` int(11) NOT NULL,
  `id_alumno` int(11) NOT NULL,
  `id_materia` int(11) NOT NULL,
  `trimestre` int(11) NOT NULL COMMENT '1,2,3 son para el valor de trimestre si no es ninguna de eso asumis que es final',
  `valor` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `finales`
--

INSERT INTO `finales` (`id`, `id_alumno`, `id_materia`, `trimestre`, `valor`) VALUES
(1, 6, 1, 1, 7),
(2, 6, 2, 1, 10),
(3, 8, 1, 1, 9),
(4, 8, 2, 1, 4),
(5, 18, 4, 1, 7),
(6, 18, 4, 1, 10),
(7, 18, 7, 1, 9),
(8, 18, 7, 1, 4),
(9, 19, 3, 1, 7),
(10, 19, 3, 1, 10),
(11, 19, 5, 1, 9),
(12, 19, 5, 1, 4),
(13, 20, 3, 1, 7),
(14, 20, 3, 1, 10),
(15, 20, 5, 1, 9),
(16, 20, 5, 1, 4),
(17, 9, 1, 1, 0),
(18, 10, 1, 1, 0),
(19, 11, 1, 1, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historial_inasistencias`
--

CREATE TABLE `historial_inasistencias` (
  `id_original` int(11) NOT NULL,
  `tipo` tinyint(1) DEFAULT NULL,
  `motivo` varchar(255) NOT NULL,
  `cantidad` double NOT NULL,
  `fecha` date NOT NULL,
  `id_us` int(11) NOT NULL,
  `fecha_cambio` date NOT NULL,
  `id_usuario_modif` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inasistencias`
--

CREATE TABLE `inasistencias` (
  `id` int(11) NOT NULL,
  `tipo` tinyint(1) DEFAULT NULL,
  `motivo` varchar(255) NOT NULL,
  `cantidad` double NOT NULL,
  `fecha` date NOT NULL,
  `id_us` int(11) NOT NULL,
  `id_creador` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `inasistencias`
--

INSERT INTO `inasistencias` (`id`, `tipo`, `motivo`, `cantidad`, `fecha`, `id_us`, `id_creador`) VALUES
(1, 1, 'Tarde por ir al medico', 0, '2022-06-04', 6, 3),
(2, 0, 'Inasistencia total', 1, '2022-05-23', 6, 3);

--
-- Disparadores `inasistencias`
--
DELIMITER $$
CREATE TRIGGER `borrar-inasistencias` BEFORE DELETE ON `inasistencias` FOR EACH ROW INSERT INTO historial_inasistencias (id_original, tipo, motivo, cantidad, fecha, id_us, fecha_cambio, id_usuario_modif) VALUES (old.id, old.tipo, old.motivo, old.cantidad, old.fecha, old.id_us, NOW(), old.id_creador)
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `editar-historial` BEFORE UPDATE ON `inasistencias` FOR EACH ROW INSERT INTO historial_inasistencias (id_original, tipo, motivo, cantidad, fecha, id_us, fecha_cambio, id_usuario_modif) VALUES (old.id, old.tipo, old.motivo, old.cantidad, old.fecha, old.id_us, NOW(), old.id_creador)
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `materias`
--

CREATE TABLE `materias` (
  `ID` int(11) NOT NULL,
  `Materia` varchar(70) NOT NULL,
  `IdCurso` int(11) NOT NULL,
  `profesor` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `materias`
--

INSERT INTO `materias` (`ID`, `Materia`, `IdCurso`, `profesor`) VALUES
(1, 'Matematicas', 1, 4),
(2, 'Lengua', 1, 4),
(3, 'Computacion', 3, 7),
(4, 'Naturales', 2, 4),
(5, 'Quimica', 3, 4),
(6, 'Redes', 4, 7),
(7, 'Base de datos', 2, 7);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notas`
--

CREATE TABLE `notas` (
  `id_alum` int(11) NOT NULL COMMENT 'foranea tabla alumnos',
  `id_materia` int(11) NOT NULL COMMENT 'foranea tabla alumno',
  `nota` int(11) NOT NULL,
  `trimestre` int(11) NOT NULL,
  `numnota` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `notas`
--

INSERT INTO `notas` (`id_alum`, `id_materia`, `nota`, `trimestre`, `numnota`) VALUES
(6, 1, 1, 1, 1),
(6, 1, 1, 2, 1),
(6, 1, 1, 3, 1),
(6, 1, 10, 1, 2),
(6, 1, 10, 2, 2),
(6, 1, 10, 3, 2),
(6, 1, 9, 1, 3),
(6, 1, 9, 2, 3),
(6, 1, 9, 3, 3),
(6, 1, 5, 1, 4),
(6, 1, 5, 2, 4),
(6, 1, 5, 3, 4),
(6, 2, 4, 1, 5),
(6, 2, 4, 2, 5),
(6, 2, 4, 3, 5),
(6, 2, 7, 1, 6),
(6, 2, 7, 2, 6),
(6, 2, 7, 3, 6),
(6, 2, 8, 1, 7),
(6, 2, 8, 2, 7),
(6, 2, 8, 3, 7),
(6, 2, 9, 1, 8),
(6, 2, 9, 2, 8),
(6, 2, 9, 3, 8),
(8, 1, 1, 1, 1),
(8, 1, 1, 2, 1),
(8, 1, 1, 3, 1),
(8, 1, 10, 1, 2),
(8, 1, 10, 2, 2),
(8, 1, 10, 3, 2),
(8, 1, 9, 1, 3),
(8, 1, 9, 2, 3),
(8, 1, 9, 3, 3),
(8, 1, 5, 1, 4),
(8, 1, 5, 2, 4),
(8, 1, 5, 3, 4),
(8, 2, 4, 1, 5),
(8, 2, 4, 2, 5),
(8, 2, 4, 3, 5),
(8, 2, 7, 1, 6),
(8, 2, 7, 2, 6),
(8, 2, 7, 3, 6),
(8, 2, 8, 1, 7),
(8, 2, 8, 2, 7),
(8, 2, 8, 3, 7),
(8, 2, 9, 1, 8),
(8, 2, 9, 2, 8),
(8, 2, 9, 3, 8),
(9, 1, 1, 1, 1),
(9, 1, 1, 2, 1),
(9, 1, 1, 3, 1),
(9, 1, 10, 1, 2),
(9, 1, 10, 2, 2),
(9, 1, 10, 3, 2),
(9, 1, 9, 1, 3),
(9, 1, 9, 2, 3),
(9, 1, 9, 3, 3),
(9, 1, 5, 1, 4),
(9, 1, 5, 2, 4),
(9, 1, 5, 3, 4),
(9, 2, 4, 1, 5),
(9, 2, 4, 2, 5),
(9, 2, 4, 3, 5),
(9, 2, 7, 1, 6),
(9, 2, 7, 2, 6),
(9, 2, 7, 3, 6),
(9, 2, 8, 1, 7),
(9, 2, 8, 2, 7),
(9, 2, 8, 3, 7),
(9, 2, 9, 1, 8),
(9, 2, 9, 2, 8),
(9, 2, 9, 3, 8),
(10, 1, 1, 1, 1),
(10, 1, 1, 2, 1),
(10, 1, 1, 3, 1),
(10, 1, 10, 1, 2),
(10, 1, 10, 2, 2),
(10, 1, 10, 3, 2),
(10, 1, 9, 1, 3),
(10, 1, 9, 2, 3),
(10, 1, 9, 3, 3),
(10, 1, 5, 1, 4),
(10, 1, 5, 2, 4),
(10, 1, 5, 3, 4),
(10, 2, 4, 1, 5),
(10, 2, 4, 2, 5),
(10, 2, 4, 3, 5),
(10, 2, 7, 1, 6),
(10, 2, 7, 2, 6),
(10, 2, 7, 3, 6),
(10, 2, 8, 1, 7),
(10, 2, 8, 2, 7),
(10, 2, 8, 3, 7),
(10, 2, 9, 1, 8),
(10, 2, 9, 2, 8),
(10, 2, 9, 3, 8),
(11, 1, 1, 1, 1),
(11, 1, 1, 2, 1),
(11, 1, 1, 3, 1),
(11, 1, 10, 1, 2),
(11, 1, 10, 2, 2),
(11, 1, 10, 3, 2),
(11, 1, 9, 1, 3),
(11, 1, 9, 2, 3),
(11, 1, 9, 3, 3),
(11, 1, 5, 1, 4),
(11, 1, 5, 2, 4),
(11, 1, 5, 3, 4),
(11, 2, 4, 1, 5),
(11, 2, 4, 2, 5),
(11, 2, 4, 3, 5),
(11, 2, 7, 1, 6),
(11, 2, 7, 2, 6),
(11, 2, 7, 3, 6),
(11, 2, 8, 1, 7),
(11, 2, 8, 2, 7),
(11, 2, 8, 3, 7),
(11, 2, 9, 1, 8),
(11, 2, 9, 2, 8),
(11, 2, 9, 3, 8),
(18, 4, 1, 1, 1),
(18, 4, 1, 2, 1),
(18, 4, 1, 3, 1),
(18, 4, 10, 1, 2),
(18, 4, 10, 2, 2),
(18, 4, 10, 3, 2),
(18, 4, 9, 1, 3),
(18, 4, 9, 2, 3),
(18, 4, 9, 3, 3),
(18, 4, 5, 1, 4),
(18, 4, 5, 2, 4),
(18, 4, 5, 3, 4),
(18, 7, 4, 1, 5),
(18, 7, 4, 2, 5),
(18, 7, 4, 3, 5),
(18, 7, 7, 1, 6),
(18, 7, 7, 2, 6),
(18, 7, 7, 3, 6),
(18, 7, 8, 1, 7),
(18, 7, 8, 2, 7),
(18, 7, 8, 3, 7),
(18, 7, 9, 1, 8),
(18, 7, 9, 2, 8),
(18, 7, 9, 3, 8),
(19, 3, 1, 1, 1),
(19, 3, 1, 2, 1),
(19, 3, 1, 3, 1),
(19, 3, 10, 1, 2),
(19, 3, 10, 2, 2),
(19, 3, 10, 3, 2),
(19, 3, 9, 1, 3),
(19, 3, 9, 2, 3),
(19, 3, 9, 3, 3),
(19, 3, 5, 1, 4),
(19, 3, 5, 2, 4),
(19, 3, 5, 3, 4),
(19, 5, 4, 1, 5),
(19, 5, 4, 2, 5),
(19, 5, 4, 3, 5),
(19, 5, 7, 1, 6),
(19, 5, 7, 2, 6),
(19, 5, 7, 3, 6),
(19, 5, 8, 1, 7),
(19, 5, 8, 2, 7),
(19, 5, 8, 3, 7),
(19, 5, 9, 1, 8),
(19, 5, 9, 2, 8),
(19, 5, 9, 3, 8),
(20, 3, 1, 1, 1),
(20, 3, 1, 2, 1),
(20, 3, 1, 3, 1),
(20, 3, 10, 1, 2),
(20, 3, 10, 2, 2),
(20, 3, 10, 3, 2),
(20, 3, 9, 1, 3),
(20, 3, 9, 2, 3),
(20, 3, 9, 3, 3),
(20, 3, 5, 1, 4),
(20, 3, 5, 2, 4),
(20, 3, 5, 3, 4),
(20, 5, 4, 1, 5),
(20, 5, 4, 2, 5),
(20, 5, 4, 3, 5),
(20, 5, 7, 1, 6),
(20, 5, 7, 2, 6),
(20, 5, 7, 3, 6),
(20, 5, 8, 1, 7),
(20, 5, 8, 2, 7),
(20, 5, 8, 3, 7),
(20, 5, 9, 1, 8),
(20, 5, 9, 2, 8),
(20, 5, 9, 3, 8);

--
-- Disparadores `notas`
--
DELIMITER $$
CREATE TRIGGER `carganotas` BEFORE UPDATE ON `notas` FOR EACH ROW INSERT INTO historial_notas 
(id_alum, id_materia, fecha_cambion, nota) VALUES (old.id_alum, old.id_materia, NOW(), old.nota)
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `padres`
--

CREATE TABLE `padres` (
  `ID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `padres`
--

INSERT INTO `padres` (`ID`) VALUES
(5),
(16),
(17);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `profesores`
--

CREATE TABLE `profesores` (
  `ID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `profesores`
--

INSERT INTO `profesores` (`ID`) VALUES
(4),
(7),
(15);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `superusuarios`
--

CREATE TABLE `superusuarios` (
  `id` int(11) NOT NULL,
  `fecha_creacion` date NOT NULL,
  `estado_pago` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `superusuarios`
--

INSERT INTO `superusuarios` (`id`, `fecha_creacion`, `estado_pago`) VALUES
(0, '2012-02-15', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `DNI` varchar(11) NOT NULL,
  `Nombre` varchar(65) NOT NULL,
  `username` varchar(50) NOT NULL,
  `Sexo` varchar(1) NOT NULL,
  `Numero_de_telefono` int(11) NOT NULL,
  `Tipo_de_usuario` tinyint(4) NOT NULL,
  `password` char(250) NOT NULL,
  `Fecha_de_nacimiento` date NOT NULL,
  `colegio` int(11) NOT NULL,
  `domicilio` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `DNI`, `Nombre`, `username`, `Sexo`, `Numero_de_telefono`, `Tipo_de_usuario`, `password`, `Fecha_de_nacimiento`, `colegio`, `domicilio`) VALUES
(1, '1', 'admin0', '1', 'M', 11111111, 1, '$2a$10$6lmlEuJRZ6bxbskY05sFCeyL8VZOH1L3ifJi0CQ0f0AS306QFnleq', '1111-01-11', 0, 'florencio varela'),
(2, '2', 'directivo0', '2', 'F', 22222222, 2, '$2a$10$6lmlEuJRZ6bxbskY05sFCeyL8VZOH1L3ifJi0CQ0f0AS306QFnleq', '2222-02-22', 0, 'Chacabuco'),
(3, '3', 'preceptor0', '3', 'F', 33333333, 3, '$2a$10$6lmlEuJRZ6bxbskY05sFCeyL8VZOH1L3ifJi0CQ0f0AS306QFnleq', '3333-03-03', 0, 'Villa Tesei'),
(4, '40000000', 'profesor1', 'profesor', 'M', 72377237, 4, '$2a$10$6lmlEuJRZ6bxbskY05sFCeyL8VZOH1L3ifJi0CQ0f0AS306QFnleq', '0000-00-00', 0, 'La Matanza'),
(5, '5', 'padre0', '5', 'F', 55555555, 5, '$2a$10$6lmlEuJRZ6bxbskY05sFCeyL8VZOH1L3ifJi0CQ0f0AS306QFnleq', '5555-05-05', 0, 'Lazytown'),
(6, '6', 'alumno0', '6', 'M', 66666666, 6, '$2a$10$6lmlEuJRZ6bxbskY05sFCeyL8VZOH1L3ifJi0CQ0f0AS306QFnleq', '6666-06-06', 0, 'San Lorenzo 461'),
(7, '20000000', 'Carlos Bianchi', 'Carlos', 'M', 47474747, 4, '$2a$10$6lmlEuJRZ6bxbskY05sFCeyL8VZOH1L3ifJi0CQ0f0AS306QFnleq', '1990-06-06', 0, 'Calle profesor Carlos'),
(8, '4636463', 'Juan Ignacio Perez De Barradas', 'Juan', 'M', 0, 6, '$2a$10$6lmlEuJRZ6bxbskY05sFCeyL8VZOH1L3ifJi0CQ0f0AS306QFnleq', '2003-08-10', 0, ''),
(9, '5532463', 'Juan Roman', 'goblino', 'M', 1, 6, '$2a$10$6lmlEuJRZ6bxbskY05sFCeyL8VZOH1L3ifJi0CQ0f0AS306QFnleq', '2000-02-10', 0, 'Riquelme'),
(10, '2036463', 'Armando Paredes', 'Mogus', 'M', 3296, 6, '$2a$10$6lmlEuJRZ6bxbskY05sFCeyL8VZOH1L3ifJi0CQ0f0AS306QFnleq', '2001-03-10', 0, 'Arquitectura 321'),
(11, '36463', 'Horacio Souto', 'BZC', 'M', 41246, 6, '$2a$10$6lmlEuJRZ6bxbskY05sFCeyL8VZOH1L3ifJi0CQ0f0AS306QFnleq', '2006-05-10', 0, ''),
(12, '10000000', 'administrador1', 'admin', 'M', 43377237, 1, '$2a$10$6lmlEuJRZ6bxbskY05sFCeyL8VZOH1L3ifJi0CQ0f0AS306QFnleq', '0000-00-00', 0, 'Ramos Mejia'),
(13, '20000000', 'directivo1', 'director', 'M', 21235466, 2, '$2a$10$6lmlEuJRZ6bxbskY05sFCeyL8VZOH1L3ifJi0CQ0f0AS306QFnleq', '0000-00-00', 0, 'Haedo'),
(14, '30000000', 'preceptor1', 'preceptor', 'M', 4449968, 3, '$2a$10$6lmlEuJRZ6bxbskY05sFCeyL8VZOH1L3ifJi0CQ0f0AS306QFnleq', '0000-00-00', 0, 'Quilmes'),
(16, '50000000', 'padre1', 'padre1', 'M', 12345678, 5, '$2a$10$6lmlEuJRZ6bxbskY05sFCeyL8VZOH1L3ifJi0CQ0f0AS306QFnleq', '0000-00-00', 0, 'La Boca'),
(17, '55435555', 'padre2', 'padre2', 'M', 59083546, 5, '$2a$10$6lmlEuJRZ6bxbskY05sFCeyL8VZOH1L3ifJi0CQ0f0AS306QFnleq', '0000-00-00', 0, 'Caballito'),
(18, '60660686', 'alumno1', 'alumno1', 'M', 15849876, 6, '$2a$10$6lmlEuJRZ6bxbskY05sFCeyL8VZOH1L3ifJi0CQ0f0AS306QFnleq', '0000-00-00', 0, 'La Boca'),
(19, '68526783', 'alumno2', 'alumno2', 'M', 10293847, 6, '$2a$10$6lmlEuJRZ6bxbskY05sFCeyL8VZOH1L3ifJi0CQ0f0AS306QFnleq', '0000-00-00', 0, 'La Boca'),
(20, '60264312', 'alumno3', 'alumno3', 'M', 47392742, 6, '$2a$10$6lmlEuJRZ6bxbskY05sFCeyL8VZOH1L3ifJi0CQ0f0AS306QFnleq', '0000-00-00', 0, 'Caballito');

--
-- Disparadores `usuarios`
--
DELIMITER $$
CREATE TRIGGER `borrar fichamedica` BEFORE DELETE ON `usuarios` FOR EACH ROW DELETE FROM fichamedica WHERE fichamedica.DNI = OLD.DNI
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `carga padre only` AFTER INSERT ON `usuarios` FOR EACH ROW IF COALESCE(new.Tipo_de_usuario) = 5 THEN BEGIN
INSERT INTO padres (ID) VALUES (concat(new.ID));
END; END IF
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `cargadnionlyalum` AFTER INSERT ON `usuarios` FOR EACH ROW IF COALESCE(new.Tipo_de_usuario) = 6 THEN BEGIN
INSERT INTO fichamedica (DNI, id_us, localidad) VALUES (concat(new.DNI), concat(new.id), concat(new.domicilio));
INSERT INTO alumno (id) VALUES (new.id);
END; END IF
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `cargaprofe` AFTER INSERT ON `usuarios` FOR EACH ROW IF COALESCE(new.Tipo_de_usuario) = 4 THEN BEGIN
INSERT INTO profesores (ID) VALUES (concat(new.ID));
END; END IF
$$
DELIMITER ;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `colegio`
--
ALTER TABLE `colegio`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `curso`
--
ALTER TABLE `curso`
  ADD PRIMARY KEY (`ID`);

--
-- Indices de la tabla `finales`
--
ALTER TABLE `finales`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `historial_notas`
--
ALTER TABLE `historial_notas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `inasistencias`
--
ALTER TABLE `inasistencias`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `materias`
--
ALTER TABLE `materias`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `IdCurso` (`IdCurso`);

--
-- Indices de la tabla `notas`
--
ALTER TABLE `notas`
  ADD PRIMARY KEY (`id_alum`,`id_materia`,`numnota`,`trimestre`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `colegio`
--
ALTER TABLE `colegio`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `curso`
--
ALTER TABLE `curso`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `finales`
--
ALTER TABLE `finales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT de la tabla `historial_notas`
--
ALTER TABLE `historial_notas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `inasistencias`
--
ALTER TABLE `inasistencias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `materias`
--
ALTER TABLE `materias`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `materias`
--
ALTER TABLE `materias`
  ADD CONSTRAINT `materias_ibfk_1` FOREIGN KEY (`IdCurso`) REFERENCES `curso` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
