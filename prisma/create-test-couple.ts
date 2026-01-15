import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function createTestCouple() {
    console.log('Creating test couple account...')

    // Simple password for testing
    const password = 'test123'
    const passwordHash = await hash(password, 12)

    // Get the venue
    const venue = await prisma.venue.findFirst()

    if (!venue) {
        console.error('No venue found! Please run seed first.')
        return
    }

    // Create couple user
    const couple = await prisma.user.create({
        data: {
            email: 'test@couple.com',
            name: 'Test Couple',
            password: passwordHash,
            role: 'USER'
        }
    })

    // Create event for the couple
    const event = await prisma.event.create({
        data: {
            name: 'Test Wedding 2025',
            date: new Date('2025-08-20'),
            budget: 30000,
            venueId: venue.id,
            clientId: couple.id
        }
    })

    console.log('\n✅ Test couple created successfully!')
    console.log('Email: test@couple.com')
    console.log('Password: test123')
    console.log(`Event: ${event.name}`)
}

createTestCouple()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
