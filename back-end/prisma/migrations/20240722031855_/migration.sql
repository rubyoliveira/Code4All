/*
  Warnings:

  - The `rating` column on the `courses` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "courses" DROP COLUMN "rating",
ADD COLUMN     "rating" DOUBLE PRECISION[] DEFAULT ARRAY[]::DOUBLE PRECISION[];
