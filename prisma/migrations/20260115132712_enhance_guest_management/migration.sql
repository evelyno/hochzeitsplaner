/*
  Warnings:

  - You are about to drop the column `rsvp` on the `Guest` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "RSVPStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED');

-- CreateEnum
CREATE TYPE "MealPreference" AS ENUM ('STANDARD', 'VEGETARIAN', 'VEGAN', 'GLUTEN_FREE', 'HALAL', 'KOSHER', 'OTHER');

-- DropForeignKey
ALTER TABLE "Guest" DROP CONSTRAINT "Guest_eventId_fkey";

-- AlterTable
ALTER TABLE "Guest" DROP COLUMN "rsvp",
ADD COLUMN     "childrenCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "dietaryNotes" TEXT,
ADD COLUMN     "hasChildren" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPlusOne" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "mealPreference" "MealPreference" NOT NULL DEFAULT 'STANDARD',
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "plusOneOf" TEXT,
ADD COLUMN     "rsvpStatus" "RSVPStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "tableGroup" TEXT,
ADD COLUMN     "tableNumber" INTEGER;

-- AddForeignKey
ALTER TABLE "Guest" ADD CONSTRAINT "Guest_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
