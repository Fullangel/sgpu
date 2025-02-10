-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `user_teacher_id_fkey`;

-- DropIndex
DROP INDEX `user_teacher_id_fkey` ON `user`;

-- AlterTable
ALTER TABLE `user` MODIFY `birthdate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_teacher_id_fkey` FOREIGN KEY (`teacher_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
