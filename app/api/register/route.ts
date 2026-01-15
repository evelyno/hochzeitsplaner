import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { email, password, venueName } = body

        if (!email || !password || !venueName) {
            return new NextResponse("Missing required fields", { status: 400 })
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        if (existingUser) {
            return new NextResponse("User already exists", { status: 409 })
        }

        // Create Venue first
        const venue = await prisma.venue.create({
            data: {
                name: venueName
            }
        })

        const hashedPassword = await hash(password, 12)

        // Create Operator User linked to Venue
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: venueName, // Default name to venue name for now
                role: "ADMIN",
                venueId: venue.id
            }
        })

        return NextResponse.json({
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        })
    } catch (error) {
        console.error("REGISTRATION_ERROR", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
