-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('high', 'medium', 'low');

-- CreateTable
CREATE TABLE "perspectives" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "color_bg" VARCHAR(7) NOT NULL,
    "color_bar" VARCHAR(7) NOT NULL,
    "color_header" VARCHAR(7) NOT NULL,
    "display_order" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "perspectives_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "initiatives" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(10) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "perspective_id" TEXT NOT NULL,
    "target_kpi" VARCHAR(100),
    "estimated_effort" VARCHAR(50),
    "priority" "Priority",
    "display_order" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "initiatives_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schedules" (
    "id" TEXT NOT NULL,
    "initiative_id" TEXT NOT NULL,
    "year" INTEGER NOT NULL DEFAULT 2026,
    "start_month" INTEGER NOT NULL,
    "end_month" INTEGER NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "schedules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "perspectives_name_key" ON "perspectives"("name");

-- CreateIndex
CREATE UNIQUE INDEX "initiatives_code_key" ON "initiatives"("code");

-- CreateIndex
CREATE UNIQUE INDEX "schedules_initiative_id_key" ON "schedules"("initiative_id");

-- AddForeignKey
ALTER TABLE "initiatives" ADD CONSTRAINT "initiatives_perspective_id_fkey" FOREIGN KEY ("perspective_id") REFERENCES "perspectives"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_initiative_id_fkey" FOREIGN KEY ("initiative_id") REFERENCES "initiatives"("id") ON DELETE CASCADE ON UPDATE CASCADE;
