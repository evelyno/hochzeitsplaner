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
        const gifts = await prisma.giftItem.findMany({
            where: { eventId },
            orderBy: { createdAt: 'desc' }
        })
        return NextResponse.json(gifts)
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
        const { eventId, name, description, price, url, imageUrl, category } = body

        if (!eventId || !name) {
            return new NextResponse("Missing required fields", { status: 400 })
        }

        const gift = await prisma.giftItem.create({
            data: {
                eventId,
                name,
                description,
                price: price ? parseFloat(price) : null,
                url,
                imageUrl,
                category: category || 'GENERAL'
            }
        })

        return NextResponse.json(gift)
    } catch (error) {
        console.error("Error creating gift:", error)
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
        const gift = await prisma.giftItem.update({
            where: { id },
            data: updateData
        })
        return NextResponse.json(gift)
    } catch (error) {
        console.error('Error updating gift:', error)
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
        await prisma.giftItem.delete({ where: { id } })
        return new NextResponse('Deleted', { status: 200 })
    } catch (error) {
        console.error('Error deleting gift:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}
