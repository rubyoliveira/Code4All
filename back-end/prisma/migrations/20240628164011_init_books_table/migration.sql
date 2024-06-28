/*
  Warnings:

  - You are about to drop the column `badges` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "badges",
DROP COLUMN "email",
DROP COLUMN "name";
