/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Nationality` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Nationality_code_key` ON `Nationality`(`code`);
