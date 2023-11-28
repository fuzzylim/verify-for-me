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
    "company" TEXT NOT NULL,
    "abn" TEXT NOT NULL,

    CONSTRAINT "TrustedDomain_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TrustedDomain_domain_key" ON "TrustedDomain"("domain");

-- AddForeignKey
ALTER TABLE "VerificationAttempt" ADD CONSTRAINT "VerificationAttempt_verification_code_id_fkey" FOREIGN KEY ("verification_code_id") REFERENCES "VerificationCode"("id") ON DELETE SET NULL ON UPDATE CASCADE;
