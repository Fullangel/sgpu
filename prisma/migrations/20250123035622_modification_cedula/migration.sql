/*
  Warnings:

  - You are about to alter the column `cedula` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `BigInt`.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `cedula` BIGINT NOT NULL;
