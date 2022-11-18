-- create the databases
CREATE DATABASE IF NOT EXISTS tellonym_testing;

CREATE USER 'tellonym'@'localhost' IDENTIFIED BY 'tellonym';
GRANT CREATE, ALTER, INDEX, LOCK TABLES, REFERENCES, UPDATE, DELETE, DROP, SELECT, INSERT ON `tellonym_testing`.* TO 'tellonym'@'%';

FLUSH PRIVILEGES;

CREATE TABLE IF NOT EXISTS `tellonym_testing`.`chats` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_a` int(255) NOT NULL,
  `user_b` int(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `tellonym_testing`.`chat_messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `chat_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `message` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
