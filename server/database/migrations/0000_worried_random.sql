CREATE TABLE `audit_log` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`log_ref` text NOT NULL,
	`actor_type` text NOT NULL,
	`actor_name` text NOT NULL,
	`action` text NOT NULL,
	`description` text,
	`impact` text NOT NULL,
	`entity_type` text,
	`entity_ref` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `auditor_findings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`technical_file_id` integer NOT NULL,
	`severity` text NOT NULL,
	`gspr_ref` text,
	`description` text NOT NULL,
	`recommendation` text,
	`status` text DEFAULT 'open' NOT NULL,
	`created_at` text NOT NULL,
	`resolved_at` text,
	FOREIGN KEY (`technical_file_id`) REFERENCES `technical_files`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `clinical_evidence` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`technical_file_id` integer NOT NULL,
	`cer_ref` text NOT NULL,
	`source_type` text NOT NULL,
	`title` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`ai_summary` text,
	`confidence` integer,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`technical_file_id`) REFERENCES `technical_files`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `demo_requests` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`full_name` text NOT NULL,
	`work_email` text NOT NULL,
	`company` text,
	`role` text,
	`regulation_focus` text,
	`message` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `gspr_entries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`technical_file_id` integer NOT NULL,
	`gspr_ref` text NOT NULL,
	`requirement_text` text NOT NULL,
	`conformity` text DEFAULT 'missing' NOT NULL,
	`evidence_refs` text NOT NULL,
	`standard_refs` text NOT NULL,
	`notes` text,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`technical_file_id`) REFERENCES `technical_files`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `pms_plans` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`technical_file_id` integer NOT NULL,
	`plan_type` text NOT NULL,
	`device_ref` text,
	`next_due` text NOT NULL,
	`status` text DEFAULT 'pending_review' NOT NULL,
	`confidence` integer,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`technical_file_id`) REFERENCES `technical_files`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `risk_entries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`technical_file_id` integer NOT NULL,
	`risk_id` text NOT NULL,
	`hazard_description` text NOT NULL,
	`severity` text NOT NULL,
	`probability` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`mitigation` text,
	`control_measure_ref` text,
	`verification_ref` text,
	`traceability_refs` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`technical_file_id`) REFERENCES `technical_files`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `technical_files` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`device_name` text NOT NULL,
	`udi_di` text,
	`device_class` text,
	`regulation` text NOT NULL,
	`notified_body` text,
	`intended_use` text,
	`readiness_percent` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`owner_id` integer NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`name` text NOT NULL,
	`role` text DEFAULT 'viewer' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);