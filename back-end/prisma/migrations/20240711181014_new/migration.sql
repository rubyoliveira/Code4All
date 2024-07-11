-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "author" TEXT NOT NULL DEFAULT 'anonymous',
ADD COLUMN     "userId" TEXT NOT NULL DEFAULT 'anonymous';

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_author_fkey" FOREIGN KEY ("author") REFERENCES "user"("username") ON DELETE RESTRICT ON UPDATE CASCADE;
