CREATE DATABASE IF NOT EXISTS COP4331;
USE COP4331;

-- TODO: fails if tables created

CREATE TABLE `Users` (
  `ID`        INT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `FirstName` VARCHAR(50)  NOT NULL DEFAULT '',
  `LastName`  VARCHAR(50)  NOT NULL DEFAULT '',
  `Login`     VARCHAR(50)  NOT NULL DEFAULT '',
  `Password`  VARCHAR(255) NOT NULL DEFAULT ''
);

CREATE TABLE `Colors` (
  `ID`     INT         NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `Name`   VARCHAR(50) NOT NULL DEFAULT '',
  `UserID` INT         NOT NULL DEFAULT '0'
);

CREATE TABLE `Contacts` (
  `ID`        INT         NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `FirstName` VARCHAR(50) NOT NULL DEFAULT '',
  `LastName`  VARCHAR(50) NOT NULL DEFAULT '',
  `Phone`     VARCHAR(50) NOT NULL DEFAULT '',
  `Email`     VARCHAR(50) NOT NULL DEFAULT '',
  `UserID`    INT         NOT NULL DEFAULT '0',
  INDEX idx_user_search (UserID, LastName, Email)
);
