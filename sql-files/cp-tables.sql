CREATE TABLE `cp_account` (
	`id` varchar(255) NOT NULL,
	`account_id` varchar(255) NOT NULL,
	`provider_id` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`access_token` text,
	`refresh_token` text,
	CONSTRAINT `cp_account_id` PRIMARY KEY(`id`)
);

CREATE TABLE `cp_session` (
	`id` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`expires_at` timestamp NOT NULL,
	`ip_address` varchar(255),
	CONSTRAINT `cp_session_id` PRIMARY KEY(`id`)
);

CREATE TABLE `cp_user` (
	`id` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	CONSTRAINT `cp_user_id` PRIMARY KEY(`id`),
	CONSTRAINT `cp_user_email_unique` UNIQUE(`email`)
);

CREATE TABLE `cp_verification` (
	`id` varchar(255) NOT NULL,
	`identifier` varchar(255) NOT NULL,
	`value` varchar(255) NOT NULL,
	`expires_at` timestamp NOT NULL,
	CONSTRAINT `cp_verification_id` PRIMARY KEY(`id`)
);

ALTER TABLE `cp_account` ADD CONSTRAINT `cp_account_user_id_cp_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `cp_user`(`id`) ON DELETE no action ON UPDATE no action;
ALTER TABLE `cp_session` ADD CONSTRAINT `cp_session_user_id_cp_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `cp_user`(`id`) ON DELETE no action ON UPDATE no action;