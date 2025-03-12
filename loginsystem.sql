-- --------------------------------------------------------
-- Хост:                         127.0.0.1
-- Версия на сървъра:            10.4.32-MariaDB - mariadb.org binary distribution
-- ОС на сървъра:                Win64
-- HeidiSQL Версия:              12.6.0.6765
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Дъмп на структурата на БД loginsystem
CREATE DATABASE IF NOT EXISTS `loginsystem` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `loginsystem`;

-- Дъмп структура за таблица loginsystem.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Дъмп данни за таблица loginsystem.users: ~2 rows (приблизителен брой)
INSERT INTO `users` (`id`, `username`, `email`, `password`) VALUES
	(16, 'ico', '20427@uktc-bg.com', '$2y$10$QDGhwDxntMs/N0hGd9sE7.KcZWY1/TLitLQk11eh0090IeQTQXlli'),
	(17, 'nz', 'nz@abv.bg', '$2y$10$yPuvx9iIUEIcXtCA20lXB.6wyGsTLPGOFZJzpEj2/r0xDottw9z5q');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
