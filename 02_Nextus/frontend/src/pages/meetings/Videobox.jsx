// src/components/Videobox.jsx
import React, { useEffect, useRef, useState } from "react";
import { useSocket } from "../../context/Socketcontext.jsx";

const Videobox = ({ roomId }) => {
  const { socket } = useSocket();
  const [inCall, setInCall] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);
  const localStream = useRef(null);

  useEffect(() => {
    if (!roomId || !socket) return;

    socket.emit("join-room", { roomId });

    peerConnection.current = new RTCPeerConnection();

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("webrtc-ice-candidate", { roomId, candidate: event.candidate });
      }
    };

    peerConnection.current.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    // --- Signaling handlers
    socket.on("webrtc-offer", async ({ sdp }) => {
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(sdp));
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);
      socket.emit("webrtc-answer", { roomId, sdp: answer });
    });

    socket.on("webrtc-answer", async ({ sdp }) => {
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(sdp));
    });

    socket.on("webrtc-ice-candidate", async ({ candidate }) => {
      try {
        await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.error("Error adding received ICE candidate", err);
      }
    });

    return () => {
      socket.emit("leave-room", { roomId });
      socket.off("webrtc-offer");
      socket.off("webrtc-answer");
      socket.off("webrtc-ice-candidate");
      peerConnection.current?.close();
      localStream.current?.getTracks().forEach((track) => track.stop());
    };
  }, [roomId, socket]);

  const startCall = async () => {
    localStream.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = localStream.current;
    }
    localStream.current.getTracks().forEach((track) =>
      peerConnection.current.addTrack(track, localStream.current)
    );

    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);
    socket.emit("webrtc-offer", { roomId, sdp: offer });

    setInCall(true);
  };

  const toggleMic = () => {
    if (localStream.current) {
      localStream.current.getAudioTracks().forEach((t) => (t.enabled = !t.enabled));
      setMicOn(!micOn);
      socket.emit("toggle-media", { roomId, kind: "audio", enabled: !micOn });
    }
  };

  const toggleCam = () => {
    if (localStream.current) {
      localStream.current.getVideoTracks().forEach((t) => (t.enabled = !t.enabled));
      setCamOn(!camOn);
      socket.emit("toggle-media", { roomId, kind: "video", enabled: !camOn });
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Video Call</h2>
      <div className="flex space-x-4">
        <video ref={localVideoRef} autoPlay playsInline muted className="w-1/2 rounded-lg shadow" />
        <video ref={remoteVideoRef} autoPlay playsInline className="w-1/2 rounded-lg shadow" />
      </div>

      <div className="flex space-x-3 mt-4">
        {!inCall && (
          <button
            onClick={startCall}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Start Call
          </button>
        )}
        {inCall && (
          <>
            <button
              onClick={toggleMic}
              className={`px-4 py-2 rounded-lg ${micOn ? "bg-red-500" : "bg-gray-500"} text-white`}
            >
              {micOn ? "Mute" : "Unmute"}
            </button>
            <button
              onClick={toggleCam}
              className={`px-4 py-2 rounded-lg ${camOn ? "bg-yellow-500" : "bg-gray-500"} text-white`}
            >
              {camOn ? "Camera Off" : "Camera On"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Videobox;
