export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/admin";
import { requireUid } from "@/server/auth";
import { assertRoomNotStale, touchRoomFields } from "@/server/game";

export async function POST(request: NextRequest) {
  try {
    const uid = await requireUid(request);
    const { roomCode, targetUid } = await request.json();

    const roomRef = adminDb.ref(`rooms/${roomCode}`);
    const snap = await roomRef.get();

    if (!snap.exists()) {
      return NextResponse.json({ error: "Room not found." }, { status: 404 });
    }

    const room = snap.val();
    assertRoomNotStale(room);

    if (room.status !== "playing") {
      return NextResponse.json({ error: "Game is not active." }, { status: 400 });
    }

    const me = room.players?.[uid];
    if (!me || !me.isDealer) {
      return NextResponse.json({ error: "Only dealer can reveal a player." }, { status: 403 });
    }

    const dealerHand = room.hands?.[uid];
    if (!dealerHand) {
      return NextResponse.json({ error: "Dealer hand not found." }, { status: 404 });
    }

    if ((dealerHand.score || 0) < 16) {
      return NextResponse.json(
        { error: "Dealer must have at least 16 points to reveal a player." },
        { status: 400 }
      );
    }

    const targetPlayer = room.players?.[targetUid];
    if (!targetPlayer || targetPlayer.isDealer) {
      return NextResponse.json({ error: "Invalid target player." }, { status: 400 });
    }

    const targetHand = room.hands?.[targetUid];
    if (!targetHand) {
      return NextResponse.json({ error: "Target hand not found." }, { status: 404 });
    }

    await roomRef.update({
      [`hands/${targetUid}/publicRevealed`]: true,
      ...touchRoomFields(),
    });

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("reveal-player error:", error);
    return NextResponse.json(
      { error: error.message || "internal" },
      { status: 500 }
    );
  }
}