import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function POST(request: Request) {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const body = await request.json()
        const { playlistUrl, eventId, category } = body

        if (!playlistUrl || !eventId) {
            return new NextResponse("Missing required fields", { status: 400 })
        }

        // Extract playlist ID from URL
        const playlistIdMatch = playlistUrl.match(/playlist\/([a-zA-Z0-9]+)/)
        if (!playlistIdMatch) {
            return new NextResponse("Invalid Spotify playlist URL", { status: 400 })
        }
        const playlistId = playlistIdMatch[1]

        // Get Spotify access token using Client Credentials
        const clientId = process.env.SPOTIFY_CLIENT_ID
        const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

        if (!clientId || !clientSecret) {
            return new NextResponse("Spotify API credentials not configured", { status: 500 })
        }

        const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64')
            },
            body: 'grant_type=client_credentials'
        })

        if (!tokenResponse.ok) {
            return new NextResponse("Failed to authenticate with Spotify", { status: 500 })
        }

        const tokenData = await tokenResponse.json()
        const accessToken = tokenData.access_token

        // Fetch playlist from Spotify
        const playlistResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })

        if (!playlistResponse.ok) {
            return new NextResponse("Failed to fetch playlist from Spotify", { status: 404 })
        }

        const playlistData = await playlistResponse.json()
        const tracks = playlistData.tracks.items

        // Import tracks to database
        const importedSongs = []
        for (const item of tracks) {
            if (!item.track) continue

            const track = item.track
            const title = track.name
            const artist = track.artists.map((a: any) => a.name).join(', ')

            const song = await prisma.playlistSong.create({
                data: {
                    eventId,
                    title,
                    artist,
                    category: category || 'GENERAL',
                    notes: `Imported from Spotify playlist: ${playlistData.name}`
                }
            })

            importedSongs.push(song)
        }

        return NextResponse.json({
            success: true,
            count: importedSongs.length,
            playlistName: playlistData.name,
            songs: importedSongs
        })

    } catch (error) {
        console.error("Error importing Spotify playlist:", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
