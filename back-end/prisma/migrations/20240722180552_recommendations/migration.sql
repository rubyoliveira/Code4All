-- AlterTable
ALTER TABLE "user" ADD COLUMN     "recommendations" TEXT[] DEFAULT ARRAY[]::TEXT[];
