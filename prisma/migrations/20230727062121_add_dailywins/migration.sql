-- CreateTable
CREATE TABLE "DailyWins" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyWins_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DailyWins" ADD CONSTRAINT "DailyWins_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
