-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3307
-- Tiempo de generación: 28-04-2022 a las 21:57:29
-- Versión del servidor: 10.4.20-MariaDB
-- Versión de PHP: 8.0.8

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

CREATE TABLE `alumno` (
  `ID` int(11) NOT NULL,
  `ID Curso` int(11) NOT NULL,
  `ID docente` int(11) NOT NULL,
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
-- Estructura de tabla para la tabla `materias`
--

CREATE TABLE `materias` (
  `ID` int(11) NOT NULL,
  `Materia` varchar(70) NOT NULL,
  `IdCurso` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `padres`
--

CREATE TABLE `padres` (
  `ID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `Id` int(11) NOT NULL,
  `DNI` varchar(11) NOT NULL,
  `Nombre` varchar(65) NOT NULL,
  `Mail` varchar(50) NOT NULL,
  `Sexo` varchar(1) NOT NULL,
  `Numero_de_telefono` int(11) NOT NULL,
  `Tipo_de_usuario` tinyint(4) NOT NULL,
  `Contraseña` char(32) NOT NULL,
  `Fecha_de_nacimiento` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Disparadores `usuarios`
--
DELIMITER $$
CREATE TRIGGER `cargadni` AFTER INSERT ON `usuarios` FOR EACH ROW INSERT INTO fichamedica (DNI) VALUES (concat(new.DNI))
$$
DELIMITER ;

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
-- Indices de la tabla `materias`
--
ALTER TABLE `materias`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `IdCurso` (`IdCurso`);

--
-- Indices de la tabla `padres`
--
ALTER TABLE `padres`
  ADD PRIMARY KEY (`ID`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `DNI` (`DNI`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `curso`
--
ALTER TABLE `curso`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `materias`
--
ALTER TABLE `materias`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `fichamedica`
--
ALTER TABLE `fichamedica`
  ADD CONSTRAINT `fichamedica_ibfk_1` FOREIGN KEY (`Familiar responsable`) REFERENCES `padres` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `materias`
--
ALTER TABLE `materias`
  ADD CONSTRAINT `materias_ibfk_1` FOREIGN KEY (`IdCurso`) REFERENCES `curso` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
