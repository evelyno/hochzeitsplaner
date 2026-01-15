import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "../auth/[...nextauth]/route"

// GET - Fetch current user's event
export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        // For USER role, find their event
        if (session.user.role === 'USER' || session.user.role === 'CLIENT') {
            const event = await prisma.event.findFirst({
                where: { clientId: session.user.id },
                include: {
                    venue: {
                        select: {
                            name: true
                        }
                    }
                }
            })

            if (!event) {
                return new NextResponse("No event found", { status: 404 })
            }

            return NextResponse.json(event)
        }

        return new NextResponse("Invalid role", { status: 403 })
    } catch (error) {
        console.error("[USER_EVENT_GET]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
