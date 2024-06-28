-- CreateTable
CREATE TABLE "user" (
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "badges" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("username")
);
