/*
  Warnings:

  - You are about to drop the column `Content` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `Specialization` on the `user` table. All the data in the column will be lost.
  - Added the required column `specialization` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `Content`,
    DROP COLUMN `Specialization`,
    ADD COLUMN `content` VARCHAR(191) NULL,
    ADD COLUMN `specialization` VARCHAR(191) NOT NULL;
