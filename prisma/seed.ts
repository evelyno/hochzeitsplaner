import { PrismaClient, Role } from '@prisma/client'
import { hash } from 'bcryptjs'
import * as crypto from 'crypto'

const prisma = new PrismaClient()

// Helper to generate a random password
const generatePassword = (length = 12) => {
    return crypto.randomBytes(length).toString('hex').slice(0, length)
}

async function main() {
    console.log('🌱 Starting database seed...')

    // 1. Super Admin
    const superAdminPassword = generatePassword()
    const superAdminHash = await hash(superAdminPassword, 12)
    const superAdmin = await prisma.user.upsert({
        where: { email: 'superadmin@app.com' },
        update: {
            role: 'SUPER_ADMIN', // Ensure role is set correctly even on update
        },
        create: {
            email: 'superadmin@app.com',
            name: 'Super Admin',
            password: superAdminHash,
            role: 'SUPER_ADMIN',
        },
    })
    console.log(`\n👑 Super Admin created:`)
    console.log(`Email: superadmin@app.com`)
    console.log(`Password: ${superAdminPassword}`)

    // 2. Admin (Venue Operator)
    // Need a venue for the admin
    const venue = await prisma.venue.create({
        data: {
            name: 'Grand Plaza Hotel',
        }
    })

    const adminPassword = generatePassword()
    const adminHash = await hash(adminPassword, 12)
    const admin = await prisma.user.upsert({
        where: { email: 'admin@venue.com' },
        update: {
            role: 'ADMIN',
            venueId: venue.id
        },
        create: {
            email: 'admin@venue.com',
            name: 'Venue Admin',
            password: adminHash,
            role: 'ADMIN',
            venueId: venue.id,
        },
    })
    console.log(`\n🏨 Admin (Venue) created:`)
    console.log(`Email: admin@venue.com`)
    console.log(`Password: ${adminPassword}`)

    // 3. User (Client/Couple)
    const userPassword = generatePassword()
    const userHash = await hash(userPassword, 12)
    const user = await prisma.user.upsert({
        where: { email: 'user@client.com' },
        update: {
            role: 'USER',
        },
        create: {
            email: 'user@client.com',
            name: 'Happy Couple',
            password: userHash,
            role: 'USER',
        },
    })

    // Create an event for the user so the dashboard isn't empty
    await prisma.event.create({
        data: {
            name: 'Wedding of User & Partner',
            date: new Date('2025-06-15'),
            budget: 25000,
            venueId: venue.id,
            clientId: user.id
        }
    })

    console.log(`\n💍 User (Client) created:`)
    console.log(`Email: user@client.com`)
    console.log(`Password: ${userPassword}`)
    console.log(`\n✅ Seeding finished.`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
