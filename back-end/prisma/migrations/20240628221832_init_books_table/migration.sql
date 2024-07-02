-- CreateTable
CREATE TABLE "courses" (
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("title")
);
