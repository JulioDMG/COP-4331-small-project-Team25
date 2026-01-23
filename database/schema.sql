
-- schema.sql -- database initialization --

-- Should only be ran once.
-- if a table exists, will do nothing.

CREATE DATABASE IF NOT EXISTS COP4331;
USE COP4331;

CREATE TABLE IF NOT EXISTS `Users` (
  `ID`        INT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `FirstName` VARCHAR(50)  NOT NULL DEFAULT '',
  `LastName`  VARCHAR(50)  NOT NULL DEFAULT '',
  `Login`     VARCHAR(50)  NOT NULL DEFAULT '',
  `Password`  VARCHAR(255) NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS `Colors` (
  `ID`     INT         NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `Name`   VARCHAR(50) NOT NULL DEFAULT '',
  `UserID` INT         NOT NULL DEFAULT '0'
);

CREATE TABLE IF NOT EXISTS `Contacts` (
  `ID`        INT         NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `FirstName` VARCHAR(50) NOT NULL DEFAULT '',
  `LastName`  VARCHAR(50) NOT NULL DEFAULT '',
  `Phone`     VARCHAR(50) NOT NULL DEFAULT '',
  `Email`     VARCHAR(50) NOT NULL DEFAULT '',
  `UserID`    INT         NOT NULL DEFAULT '0',
  INDEX idx_user_search (UserID, LastName, Email)
);
