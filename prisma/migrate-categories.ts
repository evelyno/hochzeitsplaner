import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Mapping from old category names to new category names
const categoryMapping: Record<string, string> = {
    '12_10_MONTHS': '12_MONTHS',
    '9_7_MONTHS': '9_MONTHS',
    '6_5_MONTHS': '6_MONTHS',
    '4_3_MONTHS': '4_MONTHS',
    '4_2_WEEKS': '2_WEEKS',
    '1_DAY': 'DAY_BEFORE',
    'WEDDING_DAY': 'DAY_BEFORE',
    'AFTER_WEDDING': 'AFTER',
}

async function migrateCategoryNames() {
    console.log('Starting category migration...')

    try {
        // Get all tasks
        const tasks = await prisma.task.findMany()
        console.log(`Found ${tasks.length} tasks to check`)

        let updatedCount = 0

        for (const task of tasks) {
            const newCategory = categoryMapping[task.category]

            if (newCategory) {
                await prisma.task.update({
                    where: { id: task.id },
                    data: { category: newCategory }
                })
                console.log(`Updated task "${task.description}" from ${task.category} to ${newCategory}`)
                updatedCount++
            }
        }

        console.log(`\n✅ Migration complete! Updated ${updatedCount} tasks.`)

    } catch (error) {
        console.error('Error during migration:', error)
    } finally {
        await prisma.$disconnect()
    }
}

migrateCategoryNames()
