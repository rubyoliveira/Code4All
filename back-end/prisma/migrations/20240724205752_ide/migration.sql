/*
  Warnings:

  - You are about to drop the column `language` on the `interactiveIDE` table. All the data in the column will be lost.
  - You are about to drop the column `version` on the `interactiveIDE` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "interactiveIDE" DROP COLUMN "language",
DROP COLUMN "version",
ALTER COLUMN "code" SET DEFAULT '//comment',
ALTER COLUMN "users" SET DEFAULT ARRAY[]::TEXT[];
