-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "completedBy" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "modules" ADD COLUMN     "completedBy" TEXT[] DEFAULT ARRAY[]::TEXT[];
