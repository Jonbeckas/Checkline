import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1684329519144 implements MigrationInterface {
    name?: "Init Migration";
    transaction?: true;
    async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query("CREATE TABLE `permission` (`id` varchar(36) NOT NULL, `name` varchar(255) NOT NULL, `groupId` varchar(255) NOT NULL, PRIMARY KEY (`id`))");
        queryRunner.query("CREATE TABLE `group` (`id` varchar(36) NOT NULL, `name` varchar(255) NOT NULL, PRIMARY KEY (`id`))");
        queryRunner.query("CREATE TABLE `user` (`id` varchar(36) NOT NULL, `name` varchar(255) NOT NULL, `firstname` varchar(255) NOT NULL, `password` varchar(255) NOT NULL, `username` varchar(255) NOT NULL, `lastLogin` datetime NULL, PRIMARY KEY (`id`))");
        queryRunner.query("CREATE TABLE `log` (`id` int NOT NULL AUTO_INCREMENT, `timestamp` datetime NOT NULL, `data` varchar(255) NOT NULL, `type` int NOT NULL, `category` varchar(255) NOT NULL, `user` text NULL, PRIMARY KEY (`id`))");
        queryRunner.query("CREATE TABLE `runner` (`id` varchar(36) NOT NULL, `state` text NULL, `lastStateChange` datetime NULL, `round` int NOT NULL, `timestamp` datetime NULL, `station` text NULL, PRIMARY KEY (`id`))");
        queryRunner.query("CREATE TABLE `group_users_user` (`groupId` varchar(36) NOT NULL, `userId` varchar(36) NOT NULL, PRIMARY KEY (`groupId`, `userId`))");
        queryRunner.query("ALTER TABLE `permission` ADD CONSTRAINT `FK_3ef2f3921bb8b09c16b21e197f4` FOREIGN KEY (`groupId`) REFERENCES `group`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        queryRunner.query("ALTER TABLE `group_users_user` ADD CONSTRAINT `FK_fe6cce7d479552c17823e267aff` FOREIGN KEY (`groupId`) REFERENCES `group`(`id`) ON DELETE CASCADE ON UPDATE CASCADE");

    }
    async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.dropTable("permission", true, true, true);
        queryRunner.dropTable("group", true, true, true);
        queryRunner.dropTable("user", true, true, true);
        queryRunner.dropTable("log", true, true, true);
        queryRunner.dropTable("runner", true, true, true);
        queryRunner.dropTable("group_users_user", true, true, true);
    }

}