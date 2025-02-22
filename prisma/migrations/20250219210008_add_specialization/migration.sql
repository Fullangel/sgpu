/*
  Warnings:

  - Added the required column `specialization_id` to the `Subject` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `subject` ADD COLUMN `specialization_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `specialization_id` INTEGER NULL,
    MODIFY `birthdate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE `Specialization` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `Specialization_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_specialization_id_fkey` FOREIGN KEY (`specialization_id`) REFERENCES `Specialization`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subject` ADD CONSTRAINT `Subject_specialization_id_fkey` FOREIGN KEY (`specialization_id`) REFERENCES `Specialization`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
