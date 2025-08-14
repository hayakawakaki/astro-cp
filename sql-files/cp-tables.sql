CREATE TABLE `cp_account` (
	`id` varchar(36) NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` timestamp,
	`refresh_token_expires_at` timestamp,
	`scope` text,
	`password` text,
	`created_at` timestamp NOT NULL,
	`updated_at` timestamp NOT NULL,
	CONSTRAINT `account_id` PRIMARY KEY(`id`)
);

CREATE TABLE `cp_session` (
	`id` varchar(36) NOT NULL,
	`expires_at` timestamp NOT NULL,
	`token` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL,
	`updated_at` timestamp NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`user_id` varchar(36) NOT NULL,
	CONSTRAINT `session_id` PRIMARY KEY(`id`),
	CONSTRAINT `session_token_unique` UNIQUE(`token`)
);

CREATE TABLE `cp_user` (
	`id` varchar(36) NOT NULL,
	`name` text NOT NULL,
	`email` varchar(255) NOT NULL,
	`email_verified` boolean NOT NULL,
	`image` text,
	`created_at` timestamp NOT NULL,
	`updated_at` timestamp NOT NULL,
	CONSTRAINT `user_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_email_unique` UNIQUE(`email`)
);

CREATE TABLE `cp_verification` (
	`id` varchar(36) NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expires_at` timestamp NOT NULL,
	`created_at` timestamp,
	`updated_at` timestamp,
	CONSTRAINT `verification_id` PRIMARY KEY(`id`)
);

ALTER TABLE `cp_account` ADD CONSTRAINT `account_user_id_cp_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `cp_user`(`id`) ON DELETE no action ON UPDATE no action;
ALTER TABLE `cp_session` ADD CONSTRAINT `session_user_id_cp_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `cp_user`(`id`) ON DELETE no action ON UPDATE no action;

CREATE TABLE IF NOT EXISTS `cp_user_accounts` (
    `account_id` INT(11) unsigned  NOT NULL,
    `user_id` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`account_id`, `user_id`)
);

ALTER TABLE `cp_user_accounts` ADD CONSTRAINT `cp_user_accounts_account_id_fk` FOREIGN KEY (`account_id`) REFERENCES `login` (`account_id`) ON DELETE CASCADE;
ALTER TABLE `cp_user_accounts` ADD CONSTRAINT `cp_user_accounts_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `cp_user` (`id`) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS `user_id_idx` ON `cp_user_accounts` (`user_id`);
CREATE INDEX IF NOT EXISTS `account_id_idx` ON `cp_user_accounts` (`account_id`);