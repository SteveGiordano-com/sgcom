/*
  Warnings:

  - You are about to drop the column `password` on the `users` table. All the data in the column will be lost.
  - Added the required column `total_views` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "password",
ADD COLUMN     "total_views" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "users_tweets" (
    "user_id" VARCHAR(225) NOT NULL,
    "tweet_id" VARCHAR(225) NOT NULL,

    CONSTRAINT "pk_user_tweet" PRIMARY KEY ("user_id","tweet_id")
);

-- CreateTable
CREATE TABLE "users_sessions" (
    "user_id" VARCHAR(225) NOT NULL,
    "session_id" VARCHAR(225) NOT NULL,

    CONSTRAINT "pk_user_session" PRIMARY KEY ("user_id","session_id")
);

-- AddForeignKey
ALTER TABLE "users_tweets" ADD CONSTRAINT "users_tweets_tweet_id_fkey" FOREIGN KEY ("tweet_id") REFERENCES "tweets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users_tweets" ADD CONSTRAINT "users_tweets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
