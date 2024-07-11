-- CreateTable
CREATE TABLE "sessions" (
    "id" SERIAL NOT NULL,
    "session_token" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sessions_session_token_key" ON "sessions"("session_token");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_username_fkey" FOREIGN KEY ("username") REFERENCES "user"("username") ON DELETE RESTRICT ON UPDATE CASCADE;
