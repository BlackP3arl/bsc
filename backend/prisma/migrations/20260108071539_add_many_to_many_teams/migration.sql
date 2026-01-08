/*
  Warnings:

  - You are about to drop the column `team_id` on the `initiatives` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "initiatives" DROP CONSTRAINT "initiatives_team_id_fkey";

-- AlterTable
ALTER TABLE "initiatives" DROP COLUMN "team_id";

-- CreateTable
CREATE TABLE "initiative_teams" (
    "id" TEXT NOT NULL,
    "initiative_id" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "initiative_teams_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "initiative_teams_initiative_id_team_id_key" ON "initiative_teams"("initiative_id", "team_id");

-- AddForeignKey
ALTER TABLE "initiative_teams" ADD CONSTRAINT "initiative_teams_initiative_id_fkey" FOREIGN KEY ("initiative_id") REFERENCES "initiatives"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "initiative_teams" ADD CONSTRAINT "initiative_teams_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;
