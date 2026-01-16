import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import fs from 'fs'
import path from 'path'
import { writeFile } from 'fs/promises'

export async function GET(request: Request) {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email! },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                partnerName: true,
                phone: true,
                weddingDate: true
            }
        })
        return NextResponse.json(user)
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
        const formData = await request.formData()
        const name = formData.get('name') as string
        const partnerName = formData.get('partnerName') as string
        const phone = formData.get('phone') as string
        const weddingDate = formData.get('weddingDate') as string
        const file = formData.get('image') as File | null

        let imageUrl = undefined

        if (file && file.size > 0) {
            const buffer = Buffer.from(await file.arrayBuffer())
            const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
            const filename = Date.now() + "_" + safeName

            const uploadDir = path.join(process.cwd(), "public/uploads")
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true })
            }

            await writeFile(path.join(uploadDir, filename), buffer)
            imageUrl = `/uploads/${filename}`
        }

        const updateData: any = { name, partnerName, phone }
        if (weddingDate) updateData.weddingDate = new Date(weddingDate)
        if (imageUrl) updateData.image = imageUrl

        const user = await prisma.user.update({
            where: { email: session.user.email! },
            data: updateData
        })

        return NextResponse.json(user)

    } catch (error) {
        console.error("Error updating profile:", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
