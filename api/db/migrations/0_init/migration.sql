-- CreateTable
CREATE TABLE "tweets" (
    "id" VARCHAR(225) NOT NULL,
    "text" VARCHAR(500) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "tweets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" VARCHAR(225) NOT NULL,
    "password" VARCHAR(80) NOT NULL,
    "email" VARCHAR(500) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_login_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" VARCHAR(36) NOT NULL,
    "total_views" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,
    "last_view_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

