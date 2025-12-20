class RoomsStore {
  constructor() {
    this.roomParticipants = new Map(); // roomId -> [{socketId, userId, name, role}]
    this.socketToRooms = new Map();    // socketId -> Set<roomId>
  }

  addParticipant(roomId, participant) {
    if (!roomId || !participant?.socketId) return;

    const arr = this.roomParticipants.get(roomId) || [];
    const exists = arr.some(p => p.socketId === participant.socketId);
    if (!exists) arr.push(participant); // avoid duplicates
    this.roomParticipants.set(roomId, arr);

    const rs = this.socketToRooms.get(participant.socketId) || new Set();
    rs.add(roomId);
    this.socketToRooms.set(participant.socketId, rs);
  }

  removeParticipant(roomId, socketId) {
    if (!roomId || !socketId) return;

    const arr = this.roomParticipants.get(roomId) || [];
    const next = arr.filter(p => p.socketId !== socketId);
    if (next.length) this.roomParticipants.set(roomId, next);
    else this.roomParticipants.delete(roomId);

    const rs = this.socketToRooms.get(socketId);
    if (rs) {
      rs.delete(roomId);
      if (!rs.size) this.socketToRooms.delete(socketId);
    }
  }

  getParticipants(roomId) {
    return this.roomParticipants.get(roomId) || [];
  }

  getRoomsBySocket(socketId) {
    return Array.from(this.socketToRooms.get(socketId) || []);
  }

  clearAll() {
    this.roomParticipants.clear();
    this.socketToRooms.clear();
  }
}

export const roomsStore = new RoomsStore();
