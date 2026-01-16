import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "../auth/[...nextauth]/route"

// GET - Fetch tasks for an event
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

        const tasks = await prisma.task.findMany({
            where: { eventId },
            orderBy: [
                { category: 'asc' },
                { order: 'asc' },
                { createdAt: 'asc' }
            ]
        })

        return NextResponse.json(tasks)
    } catch (error) {
        console.error("[TASK_GET]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

// POST - Create a new task
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const body = await req.json()
        const { eventId, description, category } = body

        if (!eventId || !description) {
            return new NextResponse("Missing required fields", { status: 400 })
        }

        // Get the highest order in the category
        const lastTask = await prisma.task.findFirst({
            where: { eventId, category: category || 'GENERAL' },
            orderBy: { order: 'desc' }
        })

        const task = await prisma.task.create({
            data: {
                eventId,
                description,
                category: category || 'GENERAL',
                order: (lastTask?.order || 0) + 1,
                isCompleted: false
            }
        })

        return NextResponse.json(task)
    } catch (error) {
        console.error("[TASK_POST]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

// PATCH - Update a task
export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const body = await req.json()
        const { id, description, isCompleted } = body

        if (!id) {
            return new NextResponse("Task ID required", { status: 400 })
        }

        const task = await prisma.task.update({
            where: { id },
            data: {
                ...(description !== undefined && { description }),
                ...(isCompleted !== undefined && { isCompleted })
            }
        })

        return NextResponse.json(task)
    } catch (error) {
        console.error("[TASK_PATCH]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

// DELETE - Delete a task
export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")

        if (!id) {
            return new NextResponse("Task ID required", { status: 400 })
        }

        await prisma.task.delete({
            where: { id }
        })

        return new NextResponse(null, { status: 204 })
    } catch (error) {
        console.error("[TASK_DELETE]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
