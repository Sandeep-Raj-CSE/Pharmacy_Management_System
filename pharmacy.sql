-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 22, 2021 at 02:44 PM
-- Server version: 10.4.14-MariaDB
-- PHP Version: 7.4.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pharmacy`
--

-- --------------------------------------------------------

--
-- Table structure for table `bill_1`
--

CREATE TABLE `bill_1` (
  `bill_no` int(11) NOT NULL,
  `payment_mode` varchar(25) NOT NULL,
  `discount` int(11) DEFAULT NULL,
  `pat_id` int(11) NOT NULL,
  `total_cost` int(11) DEFAULT NULL,
  `bill_date` date DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `bill_1`
--

INSERT INTO `bill_1` (`bill_no`, `payment_mode`, `discount`, `pat_id`, `total_cost`, `bill_date`) VALUES
(15, 'Cash', 0, 37, 1260, '2021-02-22');

-- --------------------------------------------------------

--
-- Table structure for table `bill_2`
--

CREATE TABLE `bill_2` (
  `bill_no` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `med_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `bill_2`
--

INSERT INTO `bill_2` (`bill_no`, `quantity`, `med_id`) VALUES
(15, 3, 8);

-- --------------------------------------------------------

--
-- Table structure for table `doctor_1`
--

CREATE TABLE `doctor_1` (
  `doc_id` int(11) NOT NULL,
  `doc_name` varchar(45) NOT NULL,
  `contact` varchar(13) DEFAULT NULL,
  `specialization` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `doctor_1`
--

INSERT INTO `doctor_1` (`doc_id`, `doc_name`, `contact`, `specialization`) VALUES
(1, 'Abhishek Ramgirkar', '1234567890', 'Cardiology'),
(2, 'Ranjit Gandhi', '4567890123', 'Radiology'),
(3, 'Siddharth Modi', '1237890456', 'Opthalmology'),
(4, 'Kamla Harris', '1278903456', 'Oncology'),
(5, 'Rahul Gandhi', '5678901234', 'Neurology');

-- --------------------------------------------------------

--
-- Table structure for table `doctor_2`
--

CREATE TABLE `doctor_2` (
  `doc_id` int(11) NOT NULL,
  `med_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `doctor_2`
--

INSERT INTO `doctor_2` (`doc_id`, `med_id`) VALUES
(1, 2),
(1, 3),
(1, 5),
(2, 5),
(2, 11),
(3, 2),
(4, 2),
(4, 4),
(5, 2),
(5, 9);

-- --------------------------------------------------------

--
-- Table structure for table `drug_manufacturer`
--

CREATE TABLE `drug_manufacturer` (
  `company_id` int(11) NOT NULL,
  `name` varchar(45) NOT NULL,
  `contact` varchar(13) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `drug_manufacturer`
--

INSERT INTO `drug_manufacturer` (`company_id`, `name`, `contact`) VALUES
(1, 'Ranbaxy', '6029111180'),
(2, 'Sun Pharmaceutical', '7873274667'),
(3, 'Cipla Limited', '9375326206'),
(4, 'Abbott', '3436587348'),
(5, 'Dr. Reddy’s Laboratories', '8116889621'),
(6, 'Cadila Healthcare', '8738706469'),
(7, 'Biocon Limited', '5192738457');

-- --------------------------------------------------------

--
-- Table structure for table `employee`
--

CREATE TABLE `employee` (
  `emp_id` int(11) NOT NULL,
  `emp_name` varchar(40) NOT NULL,
  `contact` varchar(13) NOT NULL,
  `address` varchar(50) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `login_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `employee`
--

INSERT INTO `employee` (`emp_id`, `emp_name`, `contact`, `address`, `dob`, `login_id`) VALUES
(1, 'temp', '12345', 'Nwe add', '2020-11-12', 6),
(9, 'Xyz', '123456', 'XYZPur,Xyyz', '2020-10-14', 12),
(10, 'Tony', '2424114224', 'Stark Tower', '2020-10-09', 16);

-- --------------------------------------------------------

--
-- Table structure for table `inventory`
--

CREATE TABLE `inventory` (
  `stock_id` int(11) NOT NULL,
  `med_id` int(11) NOT NULL,
  `expiry_date` date NOT NULL,
  `total_number` int(11) NOT NULL,
  `emp_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `inventory`
--

INSERT INTO `inventory` (`stock_id`, `med_id`, `expiry_date`, `total_number`, `emp_id`) VALUES
(4, 8, '2025-06-21', 47, 1),
(7, 9, '2028-11-24', 50, 1),
(11, 8, '2025-06-21', 44, 1),
(14, 9, '2028-11-24', 50, 1),
(15, 20, '2025-06-28', 17, 10);

-- --------------------------------------------------------

--
-- Table structure for table `login`
--

CREATE TABLE `login` (
  `login_id` int(11) NOT NULL,
  `username` varchar(40) NOT NULL,
  `password` varchar(40) NOT NULL,
  `role` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `login`
--

INSERT INTO `login` (`login_id`, `username`, `password`, `role`) VALUES
(1, 'Neww', '$2a$10$TH0mE1yK3ZPnunKSN2ObGebLHf2GhU1RS', 'Admin'),
(2, 'abcd', '$2a$10$UbYRXwTI6e3Qvw7tSLRmK.5V25y74jZZu', 'Admin'),
(3, 'test', '$2a$10$imLlRSUw524dI3.mFdXrQugsY3miYCYl.', 'Admin'),
(6, 'tester', 'tester', 'Admin'),
(12, 'xyz', '12345', 'Cashier'),
(13, 'Abhi', 'Abhi123', 'Admin'),
(14, 'Gato', 'Gato123', 'Cashier'),
(15, 'Sid', 'Sid123', 'Cashier'),
(19, 'Steve', '23232414', 'Patient'),
(22, 'Tony', '533252352', 'Patient'),
(23, 'Super Steve', '22334455', 'Patient'),
(25, 'Steve1', 'Captain', 'Patient'),
(62, 'Tony1', '22334455', 'Patient'),
(63, 'Pewdiepie', 'brofist', 'Patient');

-- --------------------------------------------------------

--
-- Table structure for table `medicine`
--

CREATE TABLE `medicine` (
  `med_id` int(11) NOT NULL,
  `med_name` varchar(45) NOT NULL,
  `mrp` int(11) NOT NULL,
  `primary_drug` varchar(45) DEFAULT NULL,
  `dosage` varchar(45) DEFAULT NULL,
  `company_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `medicine`
--

INSERT INTO `medicine` (`med_id`, `med_name`, `mrp`, `primary_drug`, `dosage`, `company_id`) VALUES
(2, 'Lansoprazole', 120, 'Amoxicillin', '2 tablets per day', 1),
(3, 'Hydrochlorothiazide', 56, 'Myalept', '3 tablets per day', 2),
(4, 'Benzonatate', 60, 'Ravicti', '2 tablets per day', 3),
(5, 'Coronil', 2040, 'Mavenclad', '5ml per day', 4),
(6, 'Xanax', 904, 'Actimmune', '10ml per day', 5),
(7, 'Wellbutrin', 4096, 'Oxervate', '5 tablets per week', 6),
(8, 'Viagra', 420, 'Takhzyro', '1 tablet per month', 7),
(9, 'Metoprolol', 804, 'Daraprim', '1 tablet per day', 4),
(10, 'Kevzara', 36, 'Juxtapid', '3 tablets per week', 2),
(11, 'Metformin', 1118, 'Cinryze', '10ml per month', 3),
(12, 'Gilenya', 917, 'Clindamycin', '1 tablet per month', 7),
(13, 'Metkevenya', 320, 'Juxinycin', '4 tablet per week', 2),
(14, 'Lansoprazole', 120, 'Amoxicillin', '2 tablets per day', 1),
(15, 'Hydrochlorothiazide', 56, 'Myalept', '3 tablets per day', 2),
(16, 'Benzonatate', 60, 'Ravicti', '2 tablets per day', 3),
(17, 'Coronil', 2040, 'Mavenclad', '5ml per day', 4),
(18, 'Xanax', 904, 'Actimmune', '10ml per day', 5),
(19, 'Wellbutrin', 4096, 'Oxervate', '5 tablets per week', 6),
(20, 'Viagra', 420, 'Takhzyro', '1 tablet per month', 7),
(21, 'Metoprolol', 804, 'Daraprim', '1 tablet per day', 4),
(22, 'Kevzara', 36, 'Juxtapid', '3 tablets per week', 2),
(23, 'Metformin', 1118, 'Cinryze', '10ml per month', 3),
(24, 'Gilenya', 917, 'Clindamycin', '1 tablet per month', 7),
(25, 'Metkevenya', 320, 'Juxinycin', '4 tablet per week', 2);

-- --------------------------------------------------------

--
-- Table structure for table `message`
--

CREATE TABLE `message` (
  `patid` int(11) NOT NULL,
  `message` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `patient_1`
--

CREATE TABLE `patient_1` (
  `pat_id` int(11) NOT NULL,
  `pat_name` varchar(45) NOT NULL,
  `contact` varchar(13) DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `insurance_id` varchar(20) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `address` varchar(50) DEFAULT NULL,
  `login_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `patient_1`
--

INSERT INTO `patient_1` (`pat_id`, `pat_name`, `contact`, `gender`, `insurance_id`, `age`, `address`, `login_id`) VALUES
(1, 'Steve', '23232414', 'Male', 'csaweqdas', 33, 'Cape road', 19),
(29, 'Tony', '533252352', 'Male', 'Starkk01', 324, 'Stark Tower', 20),
(32, 'Steve1', '23232414', 'Male', 'CAPAM02', 122, 'adsdsada', 21),
(37, 'Super Steve', '423232425', 'Male', 'Starkk01', 421, 'Cape road', 22),
(59, 'Tony1', '22334455', 'Male', 'fesafas', 33, 'Cape road', 62),
(60, 'Pewdiepie', '98402802', 'Male', 'Edgahhh01', 31, 'Pewdss', 63);

-- --------------------------------------------------------

--
-- Table structure for table `patient_2`
--

CREATE TABLE `patient_2` (
  `pat_id` int(11) NOT NULL,
  `doc_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `patient_2`
--

INSERT INTO `patient_2` (`pat_id`, `doc_id`) VALUES
(1, 1),
(29, 1),
(32, 1),
(37, 1),
(59, 3),
(60, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bill_1`
--
ALTER TABLE `bill_1`
  ADD PRIMARY KEY (`bill_no`),
  ADD KEY `bill_1_fk_pat_id_idx` (`pat_id`);

--
-- Indexes for table `bill_2`
--
ALTER TABLE `bill_2`
  ADD PRIMARY KEY (`bill_no`,`med_id`);

--
-- Indexes for table `doctor_1`
--
ALTER TABLE `doctor_1`
  ADD PRIMARY KEY (`doc_id`),
  ADD UNIQUE KEY `contact_UNIQUE` (`contact`);

--
-- Indexes for table `doctor_2`
--
ALTER TABLE `doctor_2`
  ADD PRIMARY KEY (`doc_id`,`med_id`);

--
-- Indexes for table `drug_manufacturer`
--
ALTER TABLE `drug_manufacturer`
  ADD PRIMARY KEY (`company_id`);

--
-- Indexes for table `employee`
--
ALTER TABLE `employee`
  ADD PRIMARY KEY (`emp_id`);

--
-- Indexes for table `inventory`
--
ALTER TABLE `inventory`
  ADD PRIMARY KEY (`stock_id`),
  ADD KEY `inventory_fk_med_id_idx` (`med_id`),
  ADD KEY `inventory_fk_emp_id_idx` (`emp_id`);

--
-- Indexes for table `login`
--
ALTER TABLE `login`
  ADD PRIMARY KEY (`login_id`),
  ADD UNIQUE KEY `username_UNIQUE` (`username`);

--
-- Indexes for table `medicine`
--
ALTER TABLE `medicine`
  ADD PRIMARY KEY (`med_id`),
  ADD KEY `medicine_fk_company_id_idx` (`company_id`);

--
-- Indexes for table `message`
--
ALTER TABLE `message`
  ADD KEY `pid` (`patid`);

--
-- Indexes for table `patient_1`
--
ALTER TABLE `patient_1`
  ADD PRIMARY KEY (`pat_id`);

--
-- Indexes for table `patient_2`
--
ALTER TABLE `patient_2`
  ADD PRIMARY KEY (`pat_id`,`doc_id`),
  ADD KEY `patient_2_fk_doc_id_idx` (`doc_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bill_1`
--
ALTER TABLE `bill_1`
  MODIFY `bill_no` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `doctor_1`
--
ALTER TABLE `doctor_1`
  MODIFY `doc_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `drug_manufacturer`
--
ALTER TABLE `drug_manufacturer`
  MODIFY `company_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `employee`
--
ALTER TABLE `employee`
  MODIFY `emp_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `inventory`
--
ALTER TABLE `inventory`
  MODIFY `stock_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `login`
--
ALTER TABLE `login`
  MODIFY `login_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT for table `medicine`
--
ALTER TABLE `medicine`
  MODIFY `med_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `patient_1`
--
ALTER TABLE `patient_1`
  MODIFY `pat_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bill_1`
--
ALTER TABLE `bill_1`
  ADD CONSTRAINT `bill_1_fk_pat_id` FOREIGN KEY (`pat_id`) REFERENCES `patient_1` (`pat_id`);

--
-- Constraints for table `bill_2`
--
ALTER TABLE `bill_2`
  ADD CONSTRAINT `bill_2_1_fk_bill_no` FOREIGN KEY (`bill_no`) REFERENCES `bill_1` (`bill_no`);

--
-- Constraints for table `doctor_2`
--
ALTER TABLE `doctor_2`
  ADD CONSTRAINT `doctor_2_fk_doc_id` FOREIGN KEY (`doc_id`) REFERENCES `doctor_1` (`doc_id`);

--
-- Constraints for table `inventory`
--
ALTER TABLE `inventory`
  ADD CONSTRAINT `inventory_fk_emp_id` FOREIGN KEY (`emp_id`) REFERENCES `employee` (`emp_id`),
  ADD CONSTRAINT `inventory_fk_med_id` FOREIGN KEY (`med_id`) REFERENCES `medicine` (`med_id`);

--
-- Constraints for table `medicine`
--
ALTER TABLE `medicine`
  ADD CONSTRAINT `medicine_fk_company_id` FOREIGN KEY (`company_id`) REFERENCES `drug_manufacturer` (`company_id`);

--
-- Constraints for table `message`
--
ALTER TABLE `message`
  ADD CONSTRAINT `pid` FOREIGN KEY (`patid`) REFERENCES `patient_1` (`pat_id`);

--
-- Constraints for table `patient_2`
--
ALTER TABLE `patient_2`
  ADD CONSTRAINT `patient_2_fk_doc_id` FOREIGN KEY (`doc_id`) REFERENCES `doctor_1` (`doc_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `patient_2_fk_pat_id` FOREIGN KEY (`pat_id`) REFERENCES `patient_1` (`pat_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
