import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDatabaseMySQL1768059997937 implements MigrationInterface {
    name = 'InitDatabaseMySQL1768059997937'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` varchar(36) NOT NULL, \`email\` varchar(255) NOT NULL, \`username\` varchar(255) NULL, \`name\` varchar(255) NULL, \`full_name\` varchar(255) NULL, \`age\` int NULL, \`avatar_url\` varchar(255) NULL, \`role\` varchar(255) NOT NULL DEFAULT 'child', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`last_active\` datetime NULL, UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`subjects\` (\`id\` varchar(255) NOT NULL, \`title\` varchar(255) NOT NULL, \`icon\` varchar(255) NOT NULL, \`theme_config\` json NULL, \`description\` text NULL, \`active\` tinyint NOT NULL DEFAULT 1, \`sort_order\` int NOT NULL DEFAULT '0', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`levels\` (\`id\` varchar(255) NOT NULL, \`subject_id\` varchar(255) NOT NULL, \`title\` varchar(255) NOT NULL, \`subtitle\` varchar(255) NULL, \`icon\` varchar(255) NULL, \`route\` varchar(255) NULL, \`is_free\` tinyint NOT NULL DEFAULT 1, \`level_number\` int NOT NULL, \`ui_config\` json NULL, \`min_age\` int NULL, \`max_age\` int NULL, \`estimated_duration\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`questions\` (\`id\` int NOT NULL AUTO_INCREMENT, \`level_id\` varchar(255) NOT NULL, \`question_type\` varchar(255) NOT NULL, \`content\` json NOT NULL, \`order_index\` int NOT NULL, \`points\` int NOT NULL DEFAULT '0', \`metadata\` json NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_progress\` (\`id\` int NOT NULL AUTO_INCREMENT, \`user_id\` varchar(255) NOT NULL, \`level_id\` varchar(255) NOT NULL, \`stars\` int NOT NULL DEFAULT '0', \`status\` varchar(255) NOT NULL DEFAULT 'LOCKED', \`high_score\` int NOT NULL DEFAULT '0', \`total_attempts\` int NOT NULL DEFAULT '0', \`first_played_at\` datetime NULL, \`last_played_at\` datetime NULL, \`completed_at\` datetime NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`learning_sessions\` (\`id\` int NOT NULL AUTO_INCREMENT, \`user_id\` varchar(255) NOT NULL, \`level_id\` varchar(255) NOT NULL, \`started_at\` datetime NOT NULL, \`completed_at\` datetime NULL, \`duration_seconds\` int NOT NULL DEFAULT '0', \`score\` int NOT NULL DEFAULT '0', \`total_questions\` int NOT NULL DEFAULT '0', \`accuracy_percentage\` float NOT NULL DEFAULT '0', \`completed\` tinyint NOT NULL DEFAULT 0, \`session_metadata\` json NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`question_attempts\` (\`id\` int NOT NULL AUTO_INCREMENT, \`session_id\` int NOT NULL, \`question_id\` int NULL, \`question_number\` int NOT NULL, \`question_text\` text NULL, \`user_answer\` varchar(255) NULL, \`correct_answer\` varchar(255) NULL, \`is_correct\` tinyint NOT NULL, \`time_spent_seconds\` int NOT NULL DEFAULT '0', \`attempts_count\` int NOT NULL DEFAULT '1', \`answered_at\` datetime NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`achievements\` (\`id\` int NOT NULL AUTO_INCREMENT, \`achievement_id\` varchar(255) NOT NULL, \`title\` varchar(255) NOT NULL, \`description\` text NULL, \`icon\` varchar(255) NOT NULL, \`rarity\` varchar(255) NOT NULL DEFAULT 'common', \`unlock_criteria\` json NOT NULL, \`points\` int NOT NULL DEFAULT '0', \`category\` varchar(255) NULL, \`active\` tinyint NOT NULL DEFAULT 1, UNIQUE INDEX \`IDX_78a155f02e79ffa720c1941626\` (\`achievement_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_achievements\` (\`id\` int NOT NULL AUTO_INCREMENT, \`user_id\` varchar(255) NOT NULL, \`achievement_id\` int NOT NULL, \`earned_at\` datetime NOT NULL, \`earned_context\` json NULL, \`notified\` tinyint NOT NULL DEFAULT 0, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_settings\` (\`id\` int NOT NULL AUTO_INCREMENT, \`user_id\` varchar(255) NOT NULL, \`learning_settings\` json NULL, \`notification_settings\` json NULL, \`parental_controls\` json NULL, \`audio_settings\` json NULL, \`ui_settings\` json NULL, \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_4ed056b9344e6f7d8d46ec4b30\` (\`user_id\`), UNIQUE INDEX \`REL_4ed056b9344e6f7d8d46ec4b30\` (\`user_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`notifications\` (\`id\` int NOT NULL AUTO_INCREMENT, \`user_id\` varchar(255) NOT NULL, \`type\` varchar(255) NOT NULL, \`title\` varchar(255) NOT NULL, \`message\` text NOT NULL, \`data\` json NULL, \`read\` tinyint NOT NULL DEFAULT 0, \`scheduled_for\` datetime NULL, \`sent_at\` datetime NULL, \`read_at\` datetime NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`parent_gate_attempts\` (\`id\` int NOT NULL AUTO_INCREMENT, \`user_id\` varchar(255) NULL, \`num1\` int NOT NULL, \`num2\` int NOT NULL, \`user_answer\` int NOT NULL, \`is_correct\` tinyint NOT NULL, \`ip_address\` varchar(255) NULL, \`attempted_at\` datetime NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`mascot_messages\` (\`id\` int NOT NULL AUTO_INCREMENT, \`level_id\` varchar(255) NULL, \`trigger_type\` varchar(255) NOT NULL, \`message_template\` text NOT NULL, \`priority\` int NOT NULL DEFAULT '0', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`levels\` ADD CONSTRAINT \`FK_26fcf1c177200bca95bf60bb63a\` FOREIGN KEY (\`subject_id\`) REFERENCES \`subjects\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`questions\` ADD CONSTRAINT \`FK_97cb5a1d1eea1692c817d7e5147\` FOREIGN KEY (\`level_id\`) REFERENCES \`levels\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_progress\` ADD CONSTRAINT \`FK_c41601eeb8415a9eb15c8a4e557\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_progress\` ADD CONSTRAINT \`FK_df22c1e4566f909288cc76fb40c\` FOREIGN KEY (\`level_id\`) REFERENCES \`levels\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`learning_sessions\` ADD CONSTRAINT \`FK_cc362342ca274ef516059737a74\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`learning_sessions\` ADD CONSTRAINT \`FK_365592043658f5f7a02ea65aa8f\` FOREIGN KEY (\`level_id\`) REFERENCES \`levels\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`question_attempts\` ADD CONSTRAINT \`FK_2b127ae3e2c818186cc9b0ad4dd\` FOREIGN KEY (\`session_id\`) REFERENCES \`learning_sessions\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`question_attempts\` ADD CONSTRAINT \`FK_9872f32242500c59627c486a0fb\` FOREIGN KEY (\`question_id\`) REFERENCES \`questions\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_achievements\` ADD CONSTRAINT \`FK_c755e3741cd46fc5ae3ef06592c\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_achievements\` ADD CONSTRAINT \`FK_36b4a912357ad1342b735d4d4c8\` FOREIGN KEY (\`achievement_id\`) REFERENCES \`achievements\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_settings\` ADD CONSTRAINT \`FK_4ed056b9344e6f7d8d46ec4b302\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`notifications\` ADD CONSTRAINT \`FK_9a8a82462cab47c73d25f49261f\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`parent_gate_attempts\` ADD CONSTRAINT \`FK_82ba494b941c994dc713a5c5916\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`parent_gate_attempts\` DROP FOREIGN KEY \`FK_82ba494b941c994dc713a5c5916\``);
        await queryRunner.query(`ALTER TABLE \`notifications\` DROP FOREIGN KEY \`FK_9a8a82462cab47c73d25f49261f\``);
        await queryRunner.query(`ALTER TABLE \`user_settings\` DROP FOREIGN KEY \`FK_4ed056b9344e6f7d8d46ec4b302\``);
        await queryRunner.query(`ALTER TABLE \`user_achievements\` DROP FOREIGN KEY \`FK_36b4a912357ad1342b735d4d4c8\``);
        await queryRunner.query(`ALTER TABLE \`user_achievements\` DROP FOREIGN KEY \`FK_c755e3741cd46fc5ae3ef06592c\``);
        await queryRunner.query(`ALTER TABLE \`question_attempts\` DROP FOREIGN KEY \`FK_9872f32242500c59627c486a0fb\``);
        await queryRunner.query(`ALTER TABLE \`question_attempts\` DROP FOREIGN KEY \`FK_2b127ae3e2c818186cc9b0ad4dd\``);
        await queryRunner.query(`ALTER TABLE \`learning_sessions\` DROP FOREIGN KEY \`FK_365592043658f5f7a02ea65aa8f\``);
        await queryRunner.query(`ALTER TABLE \`learning_sessions\` DROP FOREIGN KEY \`FK_cc362342ca274ef516059737a74\``);
        await queryRunner.query(`ALTER TABLE \`user_progress\` DROP FOREIGN KEY \`FK_df22c1e4566f909288cc76fb40c\``);
        await queryRunner.query(`ALTER TABLE \`user_progress\` DROP FOREIGN KEY \`FK_c41601eeb8415a9eb15c8a4e557\``);
        await queryRunner.query(`ALTER TABLE \`questions\` DROP FOREIGN KEY \`FK_97cb5a1d1eea1692c817d7e5147\``);
        await queryRunner.query(`ALTER TABLE \`levels\` DROP FOREIGN KEY \`FK_26fcf1c177200bca95bf60bb63a\``);
        await queryRunner.query(`DROP TABLE \`mascot_messages\``);
        await queryRunner.query(`DROP TABLE \`parent_gate_attempts\``);
        await queryRunner.query(`DROP TABLE \`notifications\``);
        await queryRunner.query(`DROP INDEX \`REL_4ed056b9344e6f7d8d46ec4b30\` ON \`user_settings\``);
        await queryRunner.query(`DROP INDEX \`IDX_4ed056b9344e6f7d8d46ec4b30\` ON \`user_settings\``);
        await queryRunner.query(`DROP TABLE \`user_settings\``);
        await queryRunner.query(`DROP TABLE \`user_achievements\``);
        await queryRunner.query(`DROP INDEX \`IDX_78a155f02e79ffa720c1941626\` ON \`achievements\``);
        await queryRunner.query(`DROP TABLE \`achievements\``);
        await queryRunner.query(`DROP TABLE \`question_attempts\``);
        await queryRunner.query(`DROP TABLE \`learning_sessions\``);
        await queryRunner.query(`DROP TABLE \`user_progress\``);
        await queryRunner.query(`DROP TABLE \`questions\``);
        await queryRunner.query(`DROP TABLE \`levels\``);
        await queryRunner.query(`DROP TABLE \`subjects\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
    }

}
