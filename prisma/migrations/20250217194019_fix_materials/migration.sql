/*
  Warnings:

  - Added the required column `name` to the `Material` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teacher_id` to the `Material` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `material` ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `teacher_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `birthdate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE `Material` ADD CONSTRAINT `Material_teacher_id_fkey` FOREIGN KEY (`teacher_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
