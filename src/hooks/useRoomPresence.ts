'use client';

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { onDisconnect, ref, remove, set } from "firebase/database";
import { auth, db } from "@/lib/firebase";
import { authedPostKeepalive } from "@/lib/api";

export function useRoomPresence(roomCode?: string) {
  const [uid, setUid] = useState<string | null>(auth.currentUser?.uid || null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUid(user?.uid || null);
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    if (!roomCode || !uid) return;

    const presenceRef = ref(db, `presence/${roomCode}/${uid}`);

    set(presenceRef, {
      uid,
      online: true,
      ts: Date.now(),
    }).catch(() => undefined);

    onDisconnect(presenceRef)
      .remove()
      .catch(() => undefined);

    const leave = () => {
      authedPostKeepalive("/api/leave-room", { roomCode }).catch(() => undefined);
      remove(presenceRef).catch(() => undefined);
    };

    const onPageHide = () => leave();

    window.addEventListener("pagehide", onPageHide);
    window.addEventListener("beforeunload", onPageHide);

    return () => {
      window.removeEventListener("pagehide", onPageHide);
      window.removeEventListener("beforeunload", onPageHide);
      remove(presenceRef).catch(() => undefined);
    };
  }, [roomCode, uid]);
}