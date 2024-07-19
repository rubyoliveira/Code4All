-- CreateTable
CREATE TABLE "interactiveIDE" (
    "idHash" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "users" TEXT[],
    "creator" TEXT NOT NULL,

    CONSTRAINT "interactiveIDE_pkey" PRIMARY KEY ("idHash")
);
