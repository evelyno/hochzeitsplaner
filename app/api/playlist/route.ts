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
        const songs = await prisma.playlistSong.findMany({
            where: { eventId },
            orderBy: { createdAt: 'desc' }
        })
        return NextResponse.json(songs)
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
        const { eventId, title, artist, category, notes, requestedBy } = body

        if (!eventId || !title || !artist) {
            return new NextResponse("Missing required fields", { status: 400 })
        }

        const song = await prisma.playlistSong.create({
            data: {
                eventId,
                title,
                artist,
                category: category || 'GENERAL',
                notes,
                requestedBy
            }
        })

        return NextResponse.json(song)
    } catch (error) {
        console.error("Error creating song:", error)
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
        const song = await prisma.playlistSong.update({
            where: { id },
            data: updateData
        })
        return NextResponse.json(song)
    } catch (error) {
        console.error('Error updating song:', error)
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
        await prisma.playlistSong.delete({ where: { id } })
        return new NextResponse('Deleted', { status: 200 })
    } catch (error) {
        console.error('Error deleting song:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}
