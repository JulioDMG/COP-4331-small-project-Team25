
-- setup.sql -- creates users, re-runnable --

CREATE DATABASE IF NOT EXISTS COP4331;
USE COP4331;

CREATE USER IF NOT EXISTS 'TheBeast'@'%';
ALTER USER 'TheBeast'@'%' IDENTIFIED BY 'WeLoveCOP4331';
GRANT ALL PRIVILEGES ON COP4331.* TO 'TheBeast'@'%';

-- To Test:
--
-- $ mysql -u root -p < schema.sql
-- $ mysql -u root -p < seeds.sql
-- $ mysql -u root -p < setup.sql
--
-- $ mysql -u TheBeast -pWeLoveCOP4331 COP4331
-- > select * from Users;
-- > select * from Colors;
-- > select * from Colors where UserID=1;
-- > select * from Colors where UserID=3;
--
