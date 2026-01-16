import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import fs from 'fs'
import path from 'path'
import { writeFile } from 'fs/promises'

export async function GET(request: Request) {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const eventId = searchParams.get('eventId')

    if (!eventId) return new NextResponse("Event ID required", { status: 400 })

    try {
        const items = await prisma.moodboardItem.findMany({
            where: { eventId },
            orderBy: { createdAt: 'desc' }
        })
        return NextResponse.json(items)
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const formData = await request.formData()
        const eventId = formData.get('eventId') as string
        const notes = formData.get('notes') as string
        const category = formData.get('category') as string
        const file = formData.get('image') as File | null

        if (!eventId || !file) {
            return new NextResponse("Missing required fields", { status: 400 })
        }

        let imageUrl = ""

        if (file && file.size > 0) {
            const buffer = Buffer.from(await file.arrayBuffer())
            const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
            const filename = Date.now() + "_" + safeName

            const uploadDir = path.join(process.cwd(), "public/uploads")
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true })
            }

            await writeFile(path.join(uploadDir, filename), buffer)
            imageUrl = `/uploads/${filename}`
        }

        const item = await prisma.moodboardItem.create({
            data: {
                eventId,
                imageUrl,
                notes,
                category: category || "GENERAL"
            }
        })

        return NextResponse.json(item)

    } catch (error) {
        console.error("Error creating moodboard item:", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

export async function DELETE(request: Request) {
    const session = await getServerSession(authOptions)
    if (!session) return new NextResponse('Unauthorized', { status: 401 })

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) return new NextResponse('Missing ID', { status: 400 })

    try {
        await prisma.moodboardItem.delete({ where: { id } })
        return new NextResponse('Deleted', { status: 200 })
    } catch (error) {
        console.error('Error deleting moodboard item:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}
