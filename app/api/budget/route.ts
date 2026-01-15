import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "../auth/[...nextauth]/route"

// GET - Fetch budget items for an event
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

        const budgetItems = await prisma.budgetItem.findMany({
            where: { eventId },
            orderBy: { category: 'asc' }
        })

        return NextResponse.json(budgetItems)
    } catch (error) {
        console.error("[BUDGET_GET]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

// POST - Create a new budget item
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const body = await req.json()
        const { eventId, category, name, plannedAmount, vendor, notes } = body

        if (!eventId || !category || !name || plannedAmount === undefined) {
            return new NextResponse("Missing required fields", { status: 400 })
        }

        const budgetItem = await prisma.budgetItem.create({
            data: {
                eventId,
                category,
                name,
                plannedAmount: parseFloat(plannedAmount),
                vendor,
                notes
            }
        })

        return NextResponse.json(budgetItem)
    } catch (error) {
        console.error("[BUDGET_POST]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

// PATCH - Update a budget item
export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const body = await req.json()
        const { id, actualAmount, paidAmount, paymentStatus, vendor, notes } = body

        if (!id) {
            return new NextResponse("Budget item ID required", { status: 400 })
        }

        const budgetItem = await prisma.budgetItem.update({
            where: { id },
            data: {
                ...(actualAmount !== undefined && { actualAmount: parseFloat(actualAmount) }),
                ...(paidAmount !== undefined && { paidAmount: parseFloat(paidAmount) }),
                ...(paymentStatus && { paymentStatus }),
                ...(vendor !== undefined && { vendor }),
                ...(notes !== undefined && { notes })
            }
        })

        return NextResponse.json(budgetItem)
    } catch (error) {
        console.error("[BUDGET_PATCH]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

// DELETE - Delete a budget item
export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")

        if (!id) {
            return new NextResponse("Budget item ID required", { status: 400 })
        }

        await prisma.budgetItem.delete({
            where: { id }
        })

        return new NextResponse(null, { status: 204 })
    } catch (error) {
        console.error("[BUDGET_DELETE]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
