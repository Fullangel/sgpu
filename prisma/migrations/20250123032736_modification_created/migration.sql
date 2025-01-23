-- AlterTable
ALTER TABLE `user` MODIFY `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3);
INSERT INTO Nationality (code, description) VALUES ('V', 'Venezolano');
INSERT INTO Nationality (code, description) VALUES ('E', 'Extranjero');
