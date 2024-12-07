-- phpMyAdmin SQL Dump
-- version 5.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 07, 2024 at 09:01 AM
-- Server version: 10.4.11-MariaDB
-- PHP Version: 7.4.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `drivewaysealingdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `billresponses`
--

CREATE TABLE `billresponses` (
  `ResponseID` int(11) NOT NULL,
  `BillID` int(11) NOT NULL,
  `ClientID` int(11) NOT NULL,
  `Responder` enum('Client','DavidSmith') NOT NULL,
  `ResponseText` text DEFAULT NULL,
  `CreatedAt` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `bills`
--

CREATE TABLE `bills` (
  `BillID` int(11) NOT NULL,
  `OrderID` int(11) NOT NULL,
  `ClientID` int(11) NOT NULL,
  `GeneratedDate` date NOT NULL,
  `TotalAmount` decimal(10,2) NOT NULL,
  `BillStatus` enum('Pending','Paid','In Dispute') DEFAULT 'Pending',
  `Notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `clients`
--

CREATE TABLE `clients` (
  `ClientID` int(11) NOT NULL,
  `FirstName` varchar(50) NOT NULL,
  `LastName` varchar(50) NOT NULL,
  `Address` text NOT NULL,
  `CreditCardInfo` text NOT NULL,
  `PhoneNumber` varchar(15) NOT NULL,
  `Email` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `OrderID` int(11) NOT NULL,
  `QuoteID` int(11) NOT NULL,
  `ClientID` int(11) NOT NULL,
  `OrderDate` date NOT NULL,
  `WorkStartDate` date NOT NULL,
  `WorkEndDate` date NOT NULL,
  `OrderStatus` enum('Pending','In Progress','Completed') DEFAULT 'Pending',
  `TotalPrice` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `quoteresponses`
--

CREATE TABLE `quoteresponses` (
  `ResponseID` int(11) NOT NULL,
  `QuoteID` int(11) NOT NULL,
  `ClientID` int(11) NOT NULL,
  `Responder` enum('Client','DavidSmith') NOT NULL,
  `ResponseText` text DEFAULT NULL,
  `CreatedAt` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `quotes`
--

CREATE TABLE `quotes` (
  `QuoteID` int(11) NOT NULL,
  `ClientID` int(11) NOT NULL,
  `PropertyAddress` text NOT NULL,
  `SquareFeet` int(11) NOT NULL,
  `ProposedPrice` decimal(10,2) NOT NULL,
  `Pictures` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`Pictures`)),
  `Notes` text DEFAULT NULL,
  `Status` enum('Pending','Rejected','Counter Proposal','Agreed','Failed') DEFAULT 'Pending',
  `CounterPrice` decimal(10,2) DEFAULT NULL,
  `TimeWindowStart` date DEFAULT NULL,
  `TimeWindowEnd` date DEFAULT NULL,
  `CreatedAt` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `billresponses`
--
ALTER TABLE `billresponses`
  ADD PRIMARY KEY (`ResponseID`),
  ADD KEY `BillID` (`BillID`),
  ADD KEY `ClientID` (`ClientID`);

--
-- Indexes for table `bills`
--
ALTER TABLE `bills`
  ADD PRIMARY KEY (`BillID`),
  ADD KEY `OrderID` (`OrderID`),
  ADD KEY `ClientID` (`ClientID`);

--
-- Indexes for table `clients`
--
ALTER TABLE `clients`
  ADD PRIMARY KEY (`ClientID`),
  ADD UNIQUE KEY `Email` (`Email`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`OrderID`),
  ADD KEY `QuoteID` (`QuoteID`),
  ADD KEY `ClientID` (`ClientID`);

--
-- Indexes for table `quoteresponses`
--
ALTER TABLE `quoteresponses`
  ADD PRIMARY KEY (`ResponseID`),
  ADD KEY `QuoteID` (`QuoteID`),
  ADD KEY `ClientID` (`ClientID`);

--
-- Indexes for table `quotes`
--
ALTER TABLE `quotes`
  ADD PRIMARY KEY (`QuoteID`),
  ADD KEY `ClientID` (`ClientID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `billresponses`
--
ALTER TABLE `billresponses`
  MODIFY `ResponseID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `bills`
--
ALTER TABLE `bills`
  MODIFY `BillID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `clients`
--
ALTER TABLE `clients`
  MODIFY `ClientID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `OrderID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `quoteresponses`
--
ALTER TABLE `quoteresponses`
  MODIFY `ResponseID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `quotes`
--
ALTER TABLE `quotes`
  MODIFY `QuoteID` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `billresponses`
--
ALTER TABLE `billresponses`
  ADD CONSTRAINT `billresponses_ibfk_1` FOREIGN KEY (`BillID`) REFERENCES `bills` (`BillID`) ON DELETE CASCADE,
  ADD CONSTRAINT `billresponses_ibfk_2` FOREIGN KEY (`ClientID`) REFERENCES `clients` (`ClientID`) ON DELETE CASCADE;

--
-- Constraints for table `bills`
--
ALTER TABLE `bills`
  ADD CONSTRAINT `bills_ibfk_1` FOREIGN KEY (`OrderID`) REFERENCES `orders` (`OrderID`) ON DELETE CASCADE,
  ADD CONSTRAINT `bills_ibfk_2` FOREIGN KEY (`ClientID`) REFERENCES `clients` (`ClientID`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`QuoteID`) REFERENCES `quotes` (`QuoteID`) ON DELETE CASCADE,
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`ClientID`) REFERENCES `clients` (`ClientID`) ON DELETE CASCADE;

--
-- Constraints for table `quoteresponses`
--
ALTER TABLE `quoteresponses`
  ADD CONSTRAINT `quoteresponses_ibfk_1` FOREIGN KEY (`QuoteID`) REFERENCES `quotes` (`QuoteID`) ON DELETE CASCADE,
  ADD CONSTRAINT `quoteresponses_ibfk_2` FOREIGN KEY (`ClientID`) REFERENCES `clients` (`ClientID`) ON DELETE CASCADE;

--
-- Constraints for table `quotes`
--
ALTER TABLE `quotes`
  ADD CONSTRAINT `quotes_ibfk_1` FOREIGN KEY (`ClientID`) REFERENCES `clients` (`ClientID`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
