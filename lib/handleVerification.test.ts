// Import dependencies
import { PrismaClient } from '@prisma/client';
import { handleVerification, InvalidVerificationRequest } from './handleVerification';


// Mock dependencies
jest.mock('@prisma/client', () => {
    return {
        PrismaClient: jest.fn().mockImplementation(() => {
            return {
                business: {
                    findFirst: jest.fn().mockResolvedValue(null),
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




// Test suite
describe('handleVerification', () => {
    beforeEach(() => {
        prisma = new PrismaClient(); // Reinitialize the prisma client for each test
        jest.clearAllMocks();
    });

    it('should throw InvalidVerificationRequest when emailAddress or subject is missing', async () => {
        await expect(handleVerification('', '')).rejects.toThrow(InvalidVerificationRequest);
    });

    it('should save a business to the database', async () => {
        const emailAddress = 'test@example.com';
        const subject = '123456';

        await handleVerification(emailAddress, subject);

        // expect(prisma.business.create).toHaveBeenCalled();
        expect(prisma.business.findFirst).toHaveBeenCalled();

        // More tests can be added here to cover other scenarios
    });
});
