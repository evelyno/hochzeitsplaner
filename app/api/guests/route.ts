import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "../auth/[...nextauth]/route"

// GET - Fetch guests for an event
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

        const guests = await prisma.guest.findMany({
            where: { eventId },
            orderBy: { name: 'asc' }
        })

        return NextResponse.json(guests)
    } catch (error) {
        console.error("[GUEST_GET]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

// POST - Create a new guest
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const body = await req.json()
        const {
            eventId,
            name,
            email,
            phone,
            rsvpStatus,
            mealPreference,
            dietaryNotes,
            tableNumber,
            tableGroup,
            isPlusOne,
            plusOneOf,
            hasChildren,
            childrenCount,
            notes
        } = body

        if (!eventId || !name) {
            return new NextResponse("Missing required fields", { status: 400 })
        }

        const guest = await prisma.guest.create({
            data: {
                eventId,
                name,
                email,
                phone,
                rsvpStatus: rsvpStatus || 'PENDING',
                mealPreference: mealPreference || 'STANDARD',
                dietaryNotes,
                tableNumber: tableNumber ? parseInt(tableNumber) : undefined,
                tableGroup,
                isPlusOne: isPlusOne || false,
                plusOneOf,
                hasChildren: hasChildren || false,
                childrenCount: childrenCount ? parseInt(childrenCount) : 0,
                notes
            }
        })

        return NextResponse.json(guest)
    } catch (error) {
        console.error("[GUEST_POST]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

// PATCH - Update a guest
export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const body = await req.json()
        const { id, ...updateData } = body

        if (!id) {
            return new NextResponse("Guest ID required", { status: 400 })
        }

        const guest = await prisma.guest.update({
            where: { id },
            data: updateData
        })

        return NextResponse.json(guest)
    } catch (error) {
        console.error("[GUEST_PATCH]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

// DELETE - Delete a guest
export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")

        if (!id) {
            return new NextResponse("Guest ID required", { status: 400 })
        }

        await prisma.guest.delete({
            where: { id }
        })

        return new NextResponse(null, { status: 204 })
    } catch (error) {
        console.error("[GUEST_DELETE]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
