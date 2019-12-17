-- phpMyAdmin SQL Dump
-- version 4.8.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Erstellungszeit: 17. Dez 2019 um 06:54
-- Server-Version: 10.1.33-MariaDB
-- PHP-Version: 7.2.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `ispolaso`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `admins`
--

CREATE TABLE `admins` (
  `id` text NOT NULL,
  `username` text NOT NULL COMMENT 'username',
  `hash` text NOT NULL COMMENT 'hashed value of the password',
  `token` text NOT NULL COMMENT 'the token of the client',
  `lrefresh` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'latest refresh of the tables',
  `level` int(11) NOT NULL COMMENT 'permission level of user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `admins`
--

INSERT INTO `admins` (`id`, `username`, `hash`, `token`, `lrefresh`, `level`) VALUES
('0', 'root', '$2y$10$cr1AIs2sFkouwqRwBwxKau0dWKUK7KZEGv1EhoaMpFKhcwTG1Nkwq', '906aebf04495f815282e014f9442a6f5cd3df76e887eaf2ea50451e2bb1f561e', '2019-12-16 19:15:54', 1),
('', 'loot', '$2y$10$9/MJkR.hiBlnAIRLw72ZwuZ5tDWfBl2EZ28LTbE536DxXz/rZUpPS', '', '0000-00-00 00:00:00', 1);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `runner`
--

CREATE TABLE `runner` (
  `Vorname` text COLLATE utf8_german2_ci NOT NULL,
  `Name` text COLLATE utf8_german2_ci NOT NULL,
  `Gruppe` text COLLATE utf8_german2_ci NOT NULL,
  `Nummer` int(11) NOT NULL,
  `Anwesenheit` text COLLATE utf8_german2_ci,
  `Ankunftszeit` int(10) DEFAULT NULL,
  `Endzeit` text COLLATE utf8_german2_ci NOT NULL,
  `Uhrzeit` text COLLATE utf8_german2_ci NOT NULL,
  `Runde` int(11) NOT NULL DEFAULT '0',
  `Station` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_german2_ci;

--
-- Daten für Tabelle `runner`
--

INSERT INTO `runner` (`Vorname`, `Name`, `Gruppe`, `Nummer`, `Anwesenheit`, `Ankunftszeit`, `Endzeit`, `Uhrzeit`, `Runde`, `Station`) VALUES
('MAN_root', '$2y$10$uz7uRJWxL9OoyqKEjUGT9OwcnyMaRn1bK7u5PEAg/qEdSW5UtXCmy', '1', 0, '7d47ae05abcdae850c8a23746ddf2d5293b063b0405a6c9026881309e1d01783', 2147483647, '', '', 0, 0),
('Max', 'Musterman', 'Q1', 1, '1', 1565990917, '1565990908', '1565990972', 13, 0),
('Max', 'Musterfrau', '5B', 2, '0', 1554974463, '', '', 5, 0),
('Magdalena', 'Musterfrau', '7C', 3, '19d142585767a2245f57e681a2d09912a7fbe69f491f5fad3ef5b0c48c5a486f WHERE Vorname', 1554974463, '', '1560750984', 4, 0),
('MAN_admin', '$2y$10$5gl7tn3xzFgn5R9wl6liiO7mhFQf/4.p3dfR.GoQcqI2K1uh0Lsmi', '1', 0, 'd2f307454d3db65cebb7eb5b442bb1a03569ac95d7600c1093af8e8c540d1ce9', NULL, '', '', 0, 0);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
