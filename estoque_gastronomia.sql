-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 19/11/2025 às 17:37
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;


-- --------------------------------------------------------

CREATE TABLE `categoria` (
  `id` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `categoria` (`id`, `nome`) VALUES
(1, 'Carnes'),
(2, 'Massas'),
(3, 'Molhos'),
(4, 'Vegetais'),
(5, 'Bebidas');

-- --------------------------------------------------------

CREATE TABLE `estoque` (
  `id` int(11) NOT NULL,
  `codIngrediente` int(11) DEFAULT NULL,
  `quantidade` decimal(10,3) NOT NULL,
  `tipo` enum('entrada','saida') NOT NULL,
  `motivo` varchar(200) DEFAULT NULL,
  `dataMov` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `estoque` (`id`, `codIngrediente`, `quantidade`, `tipo`, `motivo`, `dataMov`) VALUES
(1, 1, 5000.000, 'entrada', 'Compra de carne moída', '2025-11-19 13:16:35'),
(2, 2, 3000.000, 'entrada', 'Compra de frango', '2025-11-19 13:16:35'),
(3, 3, 4000.000, 'entrada', 'Compra de macarrão', '2025-11-19 13:16:35'),
(4, 4, 3000.000, 'entrada', 'Compra de massa de lasanha', '2025-11-19 13:16:35'),
(5, 5, 5000.000, 'entrada', 'Compra de molho de tomate', '2025-11-19 13:16:35'),
(6, 6, 2000.000, 'entrada', 'Compra de creme de leite', '2025-11-19 13:16:35'),
(7, 7, 1500.000, 'entrada', 'Compra de cebola', '2025-11-19 13:16:35'),
(8, 8, 300.000, 'entrada', 'Compra de alho', '2025-11-19 13:16:35'),
(9, 9, 50.000, 'entrada', 'Compra de Coca-Cola', '2025-11-19 13:16:35'),
(10, 10, 30.000, 'entrada', 'Compra de sucos', '2025-11-19 13:16:35');

-- --------------------------------------------------------

CREATE TABLE `ingrediente` (
  `id` int(11) NOT NULL,
  `nome` varchar(120) NOT NULL,
  `unidade` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `ingrediente` (`id`, `nome`, `unidade`) VALUES
(1, 'Carne Moída', 'g'),
(2, 'Frango em Cubos', 'g'),
(3, 'Macarrão Spaghetti', 'g'),
(4, 'Massa de Lasanha', 'g'),
(5, 'Molho de Tomate', 'ml'),
(6, 'Creme de Leite', 'ml'),
(7, 'Cebola', 'g'),
(8, 'Alho', 'g'),
(9, 'Coca-Cola Lata', 'un'),
(10, 'Suco de Laranja 300ml', 'un');

-- --------------------------------------------------------

CREATE TABLE `prato` (
  `id` int(11) NOT NULL,
  `nome` varchar(120) NOT NULL,
  `preco` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `prato` (`id`, `nome`, `preco`) VALUES
(1, 'Spaghetti à Bolonhesa', 32.90),
(2, 'Lasanha Tradicional', 39.90),
(3, 'Frango Cremoso', 29.90),
(4, 'Combo Coca + Spaghetti', 39.90);

-- --------------------------------------------------------

CREATE TABLE `receita` (
  `id` int(11) NOT NULL,
  `codPrato` int(11) DEFAULT NULL,
  `codIngrediente` int(11) DEFAULT NULL,
  `quantidade` decimal(10,3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `receita` (`id`, `codPrato`, `codIngrediente`, `quantidade`) VALUES
(1, 1, 3, 100.000),
(2, 1, 1, 150.000),
(3, 1, 5, 100.000),
(4, 1, 7, 20.000),
(5, 1, 8, 5.000),
(6, 2, 4, 200.000),
(7, 2, 1, 200.000),
(8, 2, 5, 150.000),
(9, 2, 6, 50.000),
(10, 2, 7, 15.000),
(11, 3, 2, 180.000),
(12, 3, 6, 70.000),
(13, 3, 7, 10.000),
(14, 3, 8, 3.000),
(15, 4, 3, 100.000),
(16, 4, 1, 150.000),
(17, 4, 5, 100.000),
(18, 4, 9, 1.000);


ALTER TABLE `categoria`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `estoque`
  ADD PRIMARY KEY (`id`),
  ADD KEY `codIngrediente` (`codIngrediente`);

ALTER TABLE `ingrediente`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `prato`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `receita`
  ADD PRIMARY KEY (`id`),
  ADD KEY `codPrato` (`codPrato`),
  ADD KEY `codIngrediente` (`codIngrediente`);

ALTER TABLE `categoria`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

ALTER TABLE `estoque`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

ALTER TABLE `ingrediente`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

ALTER TABLE `prato`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

ALTER TABLE `receita`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

ALTER TABLE `estoque`
  ADD CONSTRAINT `estoque_ibfk_1` FOREIGN KEY (`codIngrediente`) REFERENCES `ingrediente` (`id`);

ALTER TABLE `receita`
  ADD CONSTRAINT `receita_ibfk_1` FOREIGN KEY (`codPrato`) REFERENCES `prato` (`id`),
  ADD CONSTRAINT `receita_ibfk_2` FOREIGN KEY (`codIngrediente`) REFERENCES `ingrediente` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
