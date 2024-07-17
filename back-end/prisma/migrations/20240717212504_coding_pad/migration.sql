-- CreateTable
CREATE TABLE "ide" (
    "id" SERIAL NOT NULL,
    "language" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "starterCode" TEXT NOT NULL,

    CONSTRAINT "ide_pkey" PRIMARY KEY ("id")
);
