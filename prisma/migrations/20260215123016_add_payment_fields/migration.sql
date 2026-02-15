-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "amount" INTEGER,
ADD COLUMN     "paymentRef" TEXT,
ADD COLUMN     "paymentStatus" TEXT NOT NULL DEFAULT 'PENDING';
