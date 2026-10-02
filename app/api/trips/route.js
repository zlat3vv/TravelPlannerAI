import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { db } from "../../../lib/db";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const trips = await db.query('SELECT * FROM trips WHERE userId = ? ORDER BY createdAt DESC', [parseInt(session.user.id)]);
        
        trips.forEach(trip => {
            if (typeof trip.tripData === 'string') {
                try { trip.tripData = JSON.parse(trip.tripData); } catch (e) {}
            }
        });

        return NextResponse.json(trips);
    } catch (error) {
        console.error("Error fetching trips:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
