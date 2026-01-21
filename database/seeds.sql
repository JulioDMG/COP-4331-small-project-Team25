CREATE DATABASE IF NOT EXISTS COP4331;
USE COP4331;

-- TODO: duplicates created on both

INSERT INTO Users (FirstName,LastName,Login,Password) VALUES
  ('Rick','Leinecker','RickL','COP4331'),
  ('Sam','Hill','SamH','Test'),
  ('Rick','Leinecker','RickL','5832a71366768098cceb7095efb774f2'),
  ('Sam','Hill','SamH','0cbc6611f5540bd0809a388dc95a615b');

INSERT INTO Colors (Name,UserID) VALUES
  ('Blue',1),
  ('White',1),
  ('Black',1),
  ('gray',1),
  ('Magenta',1),
  ('Yellow',1),
  ('Cyan',1),
  ('Salmon',1),
  ('Chartreuse',1),
  ('Lime',1),
  ('Light Blue',1),
  ('Light Gray',1),
  ('Light Red',1),
  ('Light Green',1),
  ('Chiffon',1),
  ('Fuscia',1),
  ('Brown',1),
  ('Beige',1),
  ('Blue',3),
  ('White',3),
  ('Black',3),
  ('gray',3),
  ('Magenta',3),
  ('Yellow',3),
  ('Cyan',3),
  ('Salmon',3),
  ('Chartreuse',3),
  ('Lime',3),
  ('Light Blue',3),
  ('Light Gray',3),
  ('Light Red',3),
  ('Light Green',3),
  ('Chiffon',3),
  ('Fuscia',3),
  ('Brown',3),
  ('Beige',3);
