-- CreateEnum
CREATE TYPE "VendorCategory" AS ENUM ('VENUE', 'CATERING', 'PHOTOGRAPHY', 'VIDEOGRAPHY', 'FLORIST', 'MUSIC_DJ', 'MUSIC_BAND', 'HAIR_MAKEUP', 'DRESS', 'SUIT', 'CAKE', 'DECORATION', 'TRANSPORTATION', 'INVITATIONS', 'ENTERTAINMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "VendorStatus" AS ENUM ('RESEARCHING', 'CONTACTED', 'QUOTE_RECEIVED', 'BOOKED', 'CONFIRMED', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Vendor" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "category" "VendorCategory" NOT NULL,
    "companyName" TEXT NOT NULL,
    "contactPerson" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "status" "VendorStatus" NOT NULL DEFAULT 'RESEARCHING',
    "quotedPrice" DOUBLE PRECISION,
    "finalPrice" DOUBLE PRECISION,
    "depositPaid" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "contractSigned" BOOLEAN NOT NULL DEFAULT false,
    "contractUrl" TEXT,
    "notes" TEXT,
    "rating" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Vendor" ADD CONSTRAINT "Vendor_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
