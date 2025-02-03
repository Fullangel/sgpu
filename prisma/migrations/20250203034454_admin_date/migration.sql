/*
  Warnings:

  - You are about to drop the column `resetToken` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `resetTokenExpires` on the `user` table. All the data in the column will be lost.
  - The values [Teacher,Preparer,Student] on the enum `user_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- DropIndex
DROP INDEX `user_resetToken_key` ON `user`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `resetToken`,
    DROP COLUMN `resetTokenExpires`,
    MODIFY `type` ENUM('Profesor', 'Preparador', 'Estudiante', 'Administrador') NOT NULL;
