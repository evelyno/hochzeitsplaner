import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "../auth/[...nextauth]/route"

// GET - Fetch timeline events for an event
export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const eventId = searchParams.get("eventId")

        if (!eventId) {
            return new NextResponse("Event ID required", { status: 400 })
        }

        const timelineEvents = await prisma.timelineEvent.findMany({
            where: { eventId },
            orderBy: [{ order: 'asc' }, { time: 'asc' }]
        })

        return NextResponse.json(timelineEvents)
    } catch (error) {
        console.error("[TIMELINE_GET]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

// POST - Create a new timeline event
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const body = await req.json()
        const { eventId, time, title, description, duration, location, category, order } = body

        if (!eventId || !time || !title) {
            return new NextResponse("Missing required fields", { status: 400 })
        }

        const timelineEvent = await prisma.timelineEvent.create({
            data: {
                eventId,
                time,
                title,
                description,
                duration: duration ? parseInt(duration) : null,
                location,
                category: category || 'OTHER',
                order: order || 0
            }
        })

        return NextResponse.json(timelineEvent)
    } catch (error) {
        console.error("[TIMELINE_POST]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

// PATCH - Update a timeline event
export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const body = await req.json()
        const { id, time, title, description, duration, location, category, order } = body

        if (!id) {
            return new NextResponse("Timeline event ID required", { status: 400 })
        }

        const timelineEvent = await prisma.timelineEvent.update({
            where: { id },
            data: {
                ...(time !== undefined && { time }),
                ...(title !== undefined && { title }),
                ...(description !== undefined && { description }),
                ...(duration !== undefined && { duration: duration ? parseInt(duration) : null }),
                ...(location !== undefined && { location }),
                ...(category !== undefined && { category }),
                ...(order !== undefined && { order })
            }
        })

        return NextResponse.json(timelineEvent)
    } catch (error) {
        console.error("[TIMELINE_PATCH]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

// DELETE - Delete a timeline event
export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")

        if (!id) {
            return new NextResponse("Timeline event ID required", { status: 400 })
        }

        await prisma.timelineEvent.delete({
            where: { id }
        })

        return new NextResponse(null, { status: 204 })
    } catch (error) {
        console.error("[TIMELINE_DELETE]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
