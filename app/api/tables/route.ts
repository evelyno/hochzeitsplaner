import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET(request: Request) {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const eventId = searchParams.get('eventId')

    if (!eventId) return new NextResponse("Event ID required", { status: 400 })

    try {
        const tables = await prisma.table.findMany({
            where: { eventId },
            include: { guests: true }
        })
        return NextResponse.json(tables)
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
        const body = await request.json()
        const { eventId, name, shape, capacity, x, y, rotation } = body

        if (!eventId || !name || !capacity) {
            return new NextResponse("Missing required fields", { status: 400 })
        }

        const table = await prisma.table.create({
            data: {
                eventId,
                name,
                shape: shape || 'RECTANGLE',
                capacity: parseInt(capacity),
                x: parseFloat(x) || 0,
                y: parseFloat(y) || 0,
                rotation: parseFloat(rotation) || 0
            }
        })

        return NextResponse.json(table)
    } catch (error) {
        console.error("Error creating table:", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

export async function PATCH(request: Request) {
    const session = await getServerSession(authOptions)
    if (!session) return new NextResponse('Unauthorized', { status: 401 })

    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) return new NextResponse('Missing ID', { status: 400 })

    try {
        const table = await prisma.table.update({
            where: { id },
            data: updateData
        })
        return NextResponse.json(table)
    } catch (error) {
        console.error('Error updating table:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}

export async function DELETE(request: Request) {
    const session = await getServerSession(authOptions)
    if (!session) return new NextResponse('Unauthorized', { status: 401 })

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) return new NextResponse('Missing ID', { status: 400 })

    try {
        await prisma.table.delete({ where: { id } })
        return new NextResponse('Deleted', { status: 200 })
    } catch (error) {
        console.error('Error deleting table:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}
