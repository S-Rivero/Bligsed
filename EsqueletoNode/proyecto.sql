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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `curso`
--

CREATE TABLE `curso` (
  `ID` int(11) NOT NULL,
  `Nombre curso` varchar(70) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
  `tipo` tinyint(1) NOT NULL,
  `motivo` varchar(255) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `id_us` int(11) NOT NULL,
  `id_creador` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Disparadores `inasistencias`
--
DELIMITER $$
CREATE TRIGGER `historial` BEFORE UPDATE ON `inasistencias` FOR EACH ROW INSERT INTO historial_inasistencias (id_original, tipo, motivo, cantidad, fecha, id_us, fecha_cambio, id_usuario_modif) VALUES (old.id, old.tipo, old.motivo, old.cantidad, old.fecha, old.id_us, NOW(), old.id_creador)
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

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notas`
--

CREATE TABLE `notas` (
  `id` int(11) NOT NULL,
  `id_alum` int(11) NOT NULL COMMENT 'foranea tabla alumnos',
  `id_materia` int(11) NOT NULL COMMENT 'foranea tabla alumno',
  `nota` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `publicaciones`
--

CREATE TABLE `publicaciones` (
  `id` int(11) NOT NULL,
  `titulo` varchar(20) NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `autor` int(11) NOT NULL COMMENT 'relacionar con id usuario'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `superusuarios`
--

CREATE TABLE `superusuarios` (
  `id` int(11) NOT NULL,
  `fecha_creacion` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `colegio` (
  `id` int(11) NOT NULL,
  `pago` tinyint(1) NOT NULL,
  `superusuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
  `colegio` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Disparadores `usuarios`
--
DELIMITER $$
CREATE TRIGGER `cargadni` AFTER INSERT ON `usuarios` FOR EACH ROW INSERT INTO fichamedica (DNI) VALUES (concat(new.DNI))
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `borrar fichamedica` BEFORE DELETE ON `usuarios`
 FOR EACH ROW DELETE FROM fichamedica WHERE fichamedica.DNI = OLD.DNI
 $$
 DELIMITER;
--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `curso`
--
ALTER TABLE `curso`
  ADD PRIMARY KEY (`ID`);

--
-- Indices de la tabla `fichamedica`
--
ALTER TABLE `fichamedica`
  ADD KEY `DNI` (`DNI`),
  ADD KEY `Familiar responsable` (`Familiar responsable`);

--
-- Indices de la tabla `historial_notas`
--

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
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `padres`
--
ALTER TABLE `padres`
  ADD PRIMARY KEY (`ID`);

--
-- Indices de la tabla `publicaciones`
--
ALTER TABLE `publicaciones`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `curso`
--
ALTER TABLE `curso`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `historial_notas`
--

--
-- AUTO_INCREMENT de la tabla `inasistencias`
--
ALTER TABLE `inasistencias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `materias`
--
ALTER TABLE `materias`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `notas`
--
ALTER TABLE `notas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `publicaciones`
--
ALTER TABLE `publicaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

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
INSERT INTO `curso` (`Nombre curso`) VALUES ( '7C');
INSERT INTO `materias` (`Materia`, `IdCurso`, `profesor`) VALUES ( 'Matematicas', 1, 4), ( 'Lengua', 1, 4);
INSERT INTO `alumno` (`ID`, `ID Curso`, `Padre` ) VALUES ( 6, 1, 5);
INSERT INTO `notas` (`id_alum`, `Id_materia`, `nota`) VALUES ( 6, 1, 1), ( 6, 1, 10), (6, 1, 9), (6, 1, 5), (6, 2, 4), (6, 2, 7), (6, 2, 8), (6, 2, 9);
INSERT INTO `usuarios` (`DNI`, `Nombre`, `username`, `Sexo`, `Numero_de_telefono`, `Tipo_de_usuario`, `password`, `Fecha_de_nacimiento`, `colegio`) VALUES(0, '0', '0', 'F', 00000000, 0, '$2a$10$6lmlEuJRZ6bxbskY05sFCeyL8VZOH1L3ifJi0CQ0f0AS306QFnleq', '0000-0-00', 0), (1, '1', '1', 'M', 11111111, 1, '$2a$10$6lmlEuJRZ6bxbskY05sFCeyL8VZOH1L3ifJi0CQ0f0AS306QFnleq', '1111-1-11', 0), (2, '2', '2', 'F', 22222222, 2, '$2a$10$6lmlEuJRZ6bxbskY05sFCeyL8VZOH1L3ifJi0CQ0f0AS306QFnleq', '2222-2-22', 0),  (3, '3', '3', 'F', 33333333, 3, '$2a$10$6lmlEuJRZ6bxbskY05sFCeyL8VZOH1L3ifJi0CQ0f0AS306QFnleq', '3333-3-3', 0), (4, '4', '4', 'M', 44444444, 4, '$2a$10$6lmlEuJRZ6bxbskY05sFCeyL8VZOH1L3ifJi0CQ0f0AS306QFnleq', '4444-4-4', 0), (5, '5', '5', 'F', 55555555, 5, '$2a$10$6lmlEuJRZ6bxbskY05sFCeyL8VZOH1L3ifJi0CQ0f0AS306QFnleq', '5555-5-5', 0), (6, '6', '6', 'M', 66666666, 6, '$2a$10$6lmlEuJRZ6bxbskY05sFCeyL8VZOH1L3ifJi0CQ0f0AS306QFnleq', '6666-6-6', 0);
INSERT INTO `inasistencias`(`tipo`, `motivo`, `cantidad`, `fecha`, `id_us`, `id_creador`) VALUES (1, "Tarde por ir al medico", 0, "2022-6-4", 6, 3), (0,"Inasistencia total", 1, "2022-5-23", 6, 3);




