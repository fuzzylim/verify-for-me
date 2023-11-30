-- CreateTable
CREATE TABLE "VerificationCode" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expiry" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationAttempt" (
    "id" TEXT NOT NULL,
    "attempted_code" TEXT NOT NULL,
    "attempted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email_address" TEXT NOT NULL,
    "verification_code_id" TEXT,

    CONSTRAINT "VerificationAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrustedDomain" (
    "id" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "businessId" INTEGER,
    "company" TEXT NOT NULL,
    "abn" TEXT NOT NULL,

    CONSTRAINT "TrustedDomain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Business" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "abn" TEXT NOT NULL,
    "abnStatus" TEXT NOT NULL,
    "abnStatusEffectiveFrom" TIMESTAMP(3) NOT NULL,
    "categoryId" INTEGER,

    CONSTRAINT "Business_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Claim" (
    "id" SERIAL NOT NULL,
    "claimType" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "businessId" INTEGER NOT NULL,
    "votes" INTEGER NOT NULL,

    CONSTRAINT "Claim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Verification" (
    "id" SERIAL NOT NULL,
    "result" TEXT NOT NULL,
    "verifiedClaimId" INTEGER NOT NULL,
    "verificationMethodId" INTEGER NOT NULL,
    "vefiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationMethod" (
    "id" SERIAL NOT NULL,
    "method" TEXT NOT NULL,
    "description" TEXT,
    "trustworthy_because" TEXT,
    "could_be_compromised_by" TEXT,
    "restaurant_analogy" TEXT,

    CONSTRAINT "VerificationMethod_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TrustedDomain_domain_key" ON "TrustedDomain"("domain");

-- AddForeignKey
ALTER TABLE "VerificationAttempt" ADD CONSTRAINT "VerificationAttempt_verification_code_id_fkey" FOREIGN KEY ("verification_code_id") REFERENCES "VerificationCode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrustedDomain" ADD CONSTRAINT "TrustedDomain_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Business" ADD CONSTRAINT "Business_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Claim" ADD CONSTRAINT "Claim_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Verification" ADD CONSTRAINT "Verification_verifiedClaimId_fkey" FOREIGN KEY ("verifiedClaimId") REFERENCES "Claim"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Verification" ADD CONSTRAINT "Verification_verificationMethodId_fkey" FOREIGN KEY ("verificationMethodId") REFERENCES "VerificationMethod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
