-- AlterTable
ALTER TABLE `user` ADD COLUMN `teacher_id` INTEGER NULL,
    MODIFY `birthdate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_teacher_id_fkey` FOREIGN KEY (`teacher_id`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
