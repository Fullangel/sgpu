/*
  Warnings:

  - You are about to drop the column `updateAt` on the `subject` table. All the data in the column will be lost.
  - You are about to drop the column `specialization` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `subject` DROP COLUMN `updateAt`,
    ADD COLUMN `updatedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `specialization`,
    ADD COLUMN `subject_id` INTEGER NULL,
    MODIFY `birthdate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `Subject`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
