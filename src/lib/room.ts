import { onValue, ref } from "firebase/database";
import { db } from "./firebase";
import { PresenceMap, RoomData } from "./types";

export function subscribeRoom(roomCode: string, callback: (room: RoomData | null) => void) {
  const roomRef = ref(db, `rooms/${roomCode}`);
  return onValue(roomRef, (snapshot) => {
    callback(snapshot.exists() ? (snapshot.val() as RoomData) : null);
  });
}

export function subscribePresence(roomCode: string, callback: (presence: PresenceMap) => void) {
  const presenceRef = ref(db, `presence/${roomCode}`);
  return onValue(presenceRef, (snapshot) => {
    callback((snapshot.exists() ? snapshot.val() : {}) as PresenceMap);
  });
}
