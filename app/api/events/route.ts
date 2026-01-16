import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "../auth/[...nextauth]/route"
import { defaultChecklistItems } from "@/lib/default-checklist"

// GET - Fetch events for a venue
export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const venueId = searchParams.get("venueId") || session.user.venueId

        if (!venueId) {
            return new NextResponse("Venue ID required", { status: 400 })
        }

        const events = await prisma.event.findMany({
            where: { venueId },
            include: {
                client: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: { date: 'asc' }
        })

        return NextResponse.json(events)
    } catch (error) {
        console.error("[EVENT_GET]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

// POST - Create a new event/client
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const body = await req.json()
        const { clientName, clientEmail, clientPassword, eventName, eventDate, budget, venueId } = body

        if (!clientName || !eventName || !eventDate) {
            return new NextResponse("Missing required fields", { status: 400 })
        }

        const finalVenueId = venueId || session.user.venueId

        if (!finalVenueId) {
            return new NextResponse("Venue ID required", { status: 400 })
        }

        // Use provided password or generate a random one
        const password = clientPassword || Math.random().toString(36).slice(-10)

        // Create client user and event in a transaction
        const result = await prisma.$transaction(async (tx) => {
            // Create client user
            const client = await tx.user.create({
                data: {
                    name: clientName,
                    email: clientEmail || `${clientName.toLowerCase().replace(/\s+/g, '.')}@temp.com`,
                    password: await import('bcryptjs').then(bcrypt => bcrypt.hash(password, 10)),
                    role: 'USER'
                }
            })

            // Create event
            const event = await tx.event.create({
                data: {
                    name: eventName,
                    date: new Date(eventDate),
                    budget: budget ? parseFloat(budget) : null,
                    venueId: finalVenueId,
                    clientId: client.id
                },
                include: {
                    client: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                }
            })


            // Create default checklist items with calculated due dates
            const weddingDate = new Date(eventDate)
            const taskPromises = defaultChecklistItems.map((item: any) => {
                const dueDate = new Date(weddingDate)
                dueDate.setDate(dueDate.getDate() - item.daysBeforeWedding)

                return tx.task.create({
                    data: {
                        description: item.title,
                        category: item.category,
                        order: item.order,
                        dueDate: dueDate,
                        eventId: event.id,
                        isCompleted: false
                    }
                })
            })

            await Promise.all(taskPromises)

            return { event, password }
        })

        return NextResponse.json(result)
    } catch (error) {
        console.error("[EVENT_POST]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
