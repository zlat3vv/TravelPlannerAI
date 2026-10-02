import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { db } from "../../../../lib/db";

export async function GET(req, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const resolvedParams = await params;
        const tripId = parseInt(resolvedParams.id);

        if (isNaN(tripId)) {
            return NextResponse.json({ error: "Invalid trip ID" }, { status: 400 });
        }

        const rows = await db.query('SELECT * FROM trips WHERE id = ?', [tripId]);
        const trip = rows.length > 0 ? rows[0] : null;

        if (!trip) {
            return NextResponse.json({ error: "Trip not found" }, { status: 404 });
        }

        if (trip.userId !== parseInt(session.user.id)) {
            return NextResponse.json({ error: "Unauthorized access to trip" }, { status: 403 });
        }

        if (typeof trip.tripData === 'string') {
            try {
                trip.tripData = JSON.parse(trip.tripData);
            } catch (e) {
                console.error("Error parsing tripData JSON");
            }
        }

        return NextResponse.json(trip);
    } catch (error) {
        console.error("Error fetching trip:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
