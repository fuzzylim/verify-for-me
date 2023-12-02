import { PrismaClient } from '@prisma/client';
import { handleVerification, InvalidVerificationRequest } from './handleVerification';

jest.mock('@prisma/client', () => {
    return {
        PrismaClient: jest.fn().mockImplementation(() => {
            return {
                business: {
                    findFirst: jest.fn().mockResolvedValue(),
                    create: jest.fn().mockResolvedValue({}),
                },
                verificationCode: {
                    findFirst: jest.fn().mockResolvedValue({}),
                    update: jest.fn().mockResolvedValue({}),
                },
                verificationAttempt: {
                    create: jest.fn().mockResolvedValue({}),
                },
                trustedDomain: {
                    create: jest.fn().mockResolvedValue({}),
                    findFirst: jest.fn().mockResolvedValue({ id: 1, domain: '', abn: 'Test Business 1' })
                },
            };
        }),
    };
});

describe('handleVerification', () => {
    let prisma;

    beforeEach(() => {
        prisma = new PrismaClient();
    });

    it('should throw InvalidVerificationRequest when emailAddress or subject is missing', async () => {
        await expect(handleVerification('', '')).rejects.toThrow(InvalidVerificationRequest);
    });

    // Add more tests here for different scenarios
    it('should save a business to the database', async () => {
        // Arrange
        const emailAddress = 'fuzzylim@presidio.com.au';
        const subject = '123456';

        // Act
        await handleVerification(emailAddress, subject);

        // Assert
        expect(prisma.business.create).toHaveBeenCalled();
    });
});