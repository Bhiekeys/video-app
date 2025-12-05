import { useState, useRef, useEffect } from 'react'
import { MicIcon, VideoIcon, MessageSquareTextIcon, ScreenShareIcon, SettingsIcon } from '../assets/icons'
import videoMain from '../assets/video-main.png'

interface StartAppointmentPanelProps {
  onStartAppointment?: (roomName: string, displayName: string, audioEnabled: boolean, videoEnabled: boolean) => void
  defaultRoomName?: string
}

export const StartAppointmentPanel = ({ onStartAppointment, defaultRoomName }: StartAppointmentPanelProps) => {
  const [displayName, setDisplayName] = useState('')
  const [roomName, setRoomName] = useState(defaultRoomName || `room-${Date.now()}`)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [videoEnabled, setVideoEnabled] = useState(true)
  const [requestingPermissions, setRequestingPermissions] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Start/stop camera based on videoEnabled state
  useEffect(() => {
    const startCamera = async () => {
      if (videoEnabled && videoRef.current) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: true,
            audio: false // We'll get audio separately when starting
          })
          streamRef.current = stream
          if (videoRef.current) {
            videoRef.current.srcObject = stream
          }
        } catch (error) {
          console.error('Error accessing camera:', error)
          setVideoEnabled(false)
        }
      } else {
        // Stop the stream when video is disabled
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop())
          streamRef.current = null
        }
        if (videoRef.current) {
          videoRef.current.srcObject = null
        }
      }
    }

    startCamera()

    // Cleanup on unmount
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
        streamRef.current = null
      }
    }
  }, [videoEnabled])

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled)
  }

  const toggleVideo = () => {
    setVideoEnabled(!videoEnabled)
  }

  const handleStart = async () => {
    // Request permissions for enabled devices (we may already have video if enabled)
    if (audioEnabled || videoEnabled) {
      try {
        setRequestingPermissions(true)
        // Request full permissions - this ensures both are granted
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: audioEnabled, 
          video: videoEnabled 
        })
        // Stop this test stream - we just needed permission
        stream.getTracks().forEach(track => track.stop())
      } catch (error) {
        console.error('Error requesting permissions:', error)
        alert('Please allow access to the selected devices to continue')
        setRequestingPermissions(false)
        return
      }
    }
    
    // Stop preview stream - Jitsi will create its own
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    
    setRequestingPermissions(false)
    
    if (onStartAppointment) {
      onStartAppointment(roomName, displayName || 'Provider', audioEnabled, videoEnabled)
    }
  }

  return (
    <div className="start-appointment-panel">
      <div className="start-appointment-title">Start Appointment</div>
      
      <div className="start-appointment-video-preview">
        {videoEnabled ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="video-preview-element"
          />
        ) : (
          <img src={videoMain} alt="Video preview" />
        )}
      </div>

      <input
        type="text"
        className="start-appointment-input"
        placeholder="Room Name"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
      />

      <input
        type="text"
        className="start-appointment-input"
        placeholder="Display Name"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
      />

      <button 
        className="start-appointment-btn" 
        onClick={handleStart}
        disabled={requestingPermissions}
      >
        {requestingPermissions ? 'Requesting Permissions...' : 'Start Appointment'}
      </button>

      <div className="start-appointment-controls">
        <button 
          className={`control-btn-small ${!audioEnabled ? 'muted' : ''}`}
          onClick={toggleAudio}
          title={audioEnabled ? 'Mute Microphone' : 'Unmute Microphone'}
        >
          <MicIcon />
          <div className="chevron-up-small"></div>
        </button>
        <button 
          className={`control-btn-small ${!videoEnabled ? 'muted' : ''}`}
          onClick={toggleVideo}
          title={videoEnabled ? 'Turn off Video' : 'Turn on Video'}
        >
          <VideoIcon />
          <div className="chevron-up-small"></div>
        </button>
        <button className="control-btn-small" title="Chat">
          <MessageSquareTextIcon />
        </button>
        <button className="control-btn-small" title="Screen Share">
          <ScreenShareIcon />
        </button>
        <button className="control-btn-small" title="Settings">
          <SettingsIcon />
        </button>
      </div>

      {requestingPermissions && (
        <div className="device-status">
          <div className="status-dot-yellow"></div>
          <span>Requesting device permissions...</span>
        </div>
      )}
    </div>
  )
}

