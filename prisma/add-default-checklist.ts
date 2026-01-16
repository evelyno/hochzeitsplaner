import { PrismaClient } from '@prisma/client'
import { defaultChecklistItems } from '../lib/default-checklist'

const prisma = new PrismaClient()

async function addDefaultChecklistToExistingUser() {
    console.log('Adding default checklist to user@client.com...')

    try {
        // Find the user
        const user = await prisma.user.findUnique({
            where: { email: 'user@client.com' }
        })

        if (!user) {
            console.error('User not found!')
            return
        }

        // Find the user's event
        const event = await prisma.event.findFirst({
            where: { clientId: user.id }
        })

        if (!event) {
            console.error('No event found for this user!')
            return
        }

        console.log(`Found event: ${event.name}`)

        // Delete existing tasks (optional - remove if you want to keep existing tasks)
        const deletedCount = await prisma.task.deleteMany({
            where: { eventId: event.id }
        })
        console.log(`Deleted ${deletedCount.count} existing tasks`)

        // Create default checklist items
        await prisma.task.createMany({
            data: defaultChecklistItems.map((item: any) => ({
                eventId: event.id,
                description: item.description,
                category: item.category,
                order: item.order,
                isCompleted: false
            }))
        })

        console.log(`✅ Successfully added ${defaultChecklistItems.length} default checklist items!`)
        console.log('\nYou can now login as user@client.com and see the full checklist.')

    } catch (error) {
        console.error('Error:', error)
    } finally {
        await prisma.$disconnect()
    }
}

addDefaultChecklistToExistingUser()
