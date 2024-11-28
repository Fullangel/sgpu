/*
  Warnings:

  - You are about to drop the column `Status` on the `user` table. All the data in the column will be lost.
  - Added the required column `status` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `Status`,
    ADD COLUMN `status` ENUM('Activo', 'Inactivo') NOT NULL;
