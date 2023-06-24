-- CreateTable
CREATE TABLE "sessions" (
    "id" VARCHAR(36) NOT NULL,
    "total_views" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,
    "last_view_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);
