import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "../auth/[...nextauth]/route"

// GET - Fetch vendors for an event
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

        const vendors = await prisma.vendor.findMany({
            where: { eventId },
            orderBy: { category: 'asc' }
        })

        return NextResponse.json(vendors)
    } catch (error) {
        console.error("[VENDOR_GET]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

// POST - Create a new vendor
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const body = await req.json()
        const {
            eventId,
            category,
            companyName,
            contactPerson,
            email,
            phone,
            website,
            status,
            quotedPrice,
            finalPrice,
            notes
        } = body

        if (!eventId || !category || !companyName) {
            return new NextResponse("Missing required fields", { status: 400 })
        }

        const vendor = await prisma.vendor.create({
            data: {
                eventId,
                category,
                companyName,
                contactPerson,
                email,
                phone,
                website,
                status: status || 'RESEARCHING',
                quotedPrice: quotedPrice ? parseFloat(quotedPrice) : undefined,
                finalPrice: finalPrice ? parseFloat(finalPrice) : undefined,
                notes
            }
        })

        return NextResponse.json(vendor)
    } catch (error) {
        console.error("[VENDOR_POST]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

// PATCH - Update a vendor
export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const body = await req.json()
        const { id, ...updateData } = body

        if (!id) {
            return new NextResponse("Vendor ID required", { status: 400 })
        }

        // Convert price fields to floats if they exist
        if (updateData.quotedPrice) updateData.quotedPrice = parseFloat(updateData.quotedPrice)
        if (updateData.finalPrice) updateData.finalPrice = parseFloat(updateData.finalPrice)
        if (updateData.depositPaid) updateData.depositPaid = parseFloat(updateData.depositPaid)

        const vendor = await prisma.vendor.update({
            where: { id },
            data: updateData
        })

        return NextResponse.json(vendor)
    } catch (error) {
        console.error("[VENDOR_PATCH]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

// DELETE - Delete a vendor
export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")

        if (!id) {
            return new NextResponse("Vendor ID required", { status: 400 })
        }

        await prisma.vendor.delete({
            where: { id }
        })

        return new NextResponse(null, { status: 204 })
    } catch (error) {
        console.error("[VENDOR_DELETE]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
