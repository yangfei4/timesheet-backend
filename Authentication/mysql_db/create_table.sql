CREATE DATABASE IF NOT EXISTS timesheetDB;

USE timesheetDB;

DROP TABLE IF EXISTS User;
CREATE TABLE User (
	id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(255),
    password VARCHAR(255),
    profile_id VARCHAR(255),
    role VARCHAR(255),
    PRIMARY KEY (id)
);