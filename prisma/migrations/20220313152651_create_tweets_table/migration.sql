-- CreateTable
CREATE TABLE "Tweets" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "userId" TEXT NOT NULL,
    "tweet" TEXT NOT NULL,

    CONSTRAINT "Tweets_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Tweets" ADD CONSTRAINT "Tweets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
