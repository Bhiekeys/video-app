import { useState, useEffect } from 'react'
import './App.css'
import videoMain from './assets/video-main.png'
import { JitsiMeet } from './components/JitsiMeet'
import { AppointmentSetup } from './components/AppointmentSetup'
import { useJitsi } from './hooks/useJitsi'
import {
  FlagIcon,
  InfoIcon,
  TestTubeIcon,
  WaypointsIcon,
  BadgeCheckIcon,
  MicIcon,
  VideoIcon,
  MessageSquareTextIcon,
  ScreenShareIcon,
  HandIcon,
  UsersIcon,
  SettingsIcon,
  MicOffIcon,
  PaperclipIcon,
  MicIconSmall,
  SendIcon,
  ViewToggleIcon,
} from './assets/icons'

function App() {
  const [appointmentStarted, setAppointmentStarted] = useState(false)
  const [roomName, setRoomName] = useState(`room-${Date.now()}`)
  const [displayName, setDisplayName] = useState('Provider')
  const [startWithAudioMuted, setStartWithAudioMuted] = useState(false)
  const [startWithVideoMuted, setStartWithVideoMuted] = useState(false)
  
  const {
    setApi,
    isAudioMuted,
    isVideoMuted,
    isScreenSharing,
    participantCount,
    callDuration,
    toggleAudio,
    toggleVideo,
    toggleScreenShare,
    toggleChat,
    raiseHand,
    toggleTileView,
  } = useJitsi({
    roomName,
    domain: 'meet.migranium.com',
    userInfo: {
      displayName: displayName,
    },
  })

  // Inject CSS to hide Jitsi pre-join screen and watermark
  useEffect(() => {
    if (appointmentStarted) {
      const style = document.createElement('style')
      style.id = 'jitsi-prejoin-hide'
      style.textContent = `
        /* Hide Jitsi pre-join/premeeting screen */
        .css-1dtlqni-content,
        .premeeting-screen,
        .css-1a5i9rv-container,
        [class*="premeeting"],
        [class*="prejoin"],
        [class*="Prejoin"],
        [class*="PreMeeting"] {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          height: 0 !important;
          width: 0 !important;
          overflow: hidden !important;
        }
        
        /* Hide Jitsi watermark */
        .watermark,
        div.watermark,
        a.watermark,
        [class*="watermark"],
        [class*="Watermark"],
        div[class*="leftwatermark"],
        a[aria-label*="Jitsi Meet"],
        a[class*="watermark"] {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
        }
        
        /* Ensure the meeting iframe is visible */
        #jitsiConferenceFrame0 {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
        
        /* Hide any join meeting buttons that might appear */
        [class*="joinButton"],
        [class*="JoinButton"],
        button[aria-label*="Join"],
        button[aria-label*="join"] {
          display: none !important;
        }
      `
      document.head.appendChild(style)
      
      return () => {
        const existingStyle = document.getElementById('jitsi-prejoin-hide')
        if (existingStyle) {
          document.head.removeChild(existingStyle)
        }
      }
    }
  }, [appointmentStarted])

  const handleStartAppointment = (newRoomName: string, newDisplayName: string, audioEnabled: boolean, videoEnabled: boolean) => {
    setRoomName(newRoomName)
    setDisplayName(newDisplayName)
    setStartWithAudioMuted(!audioEnabled)
    setStartWithVideoMuted(!videoEnabled)
    setAppointmentStarted(true)
  }

  // Show appointment setup screen first
  if (!appointmentStarted) {
    return <AppointmentSetup onStartAppointment={handleStartAppointment} defaultRoomName={roomName} />
  }

  // Show video call interface after appointment is started
  return (
    <div className="app-container">     
      <div className="top-section">
        <div className="patient-info">
          <div className="patient-details">
            <div className="patient-name">Lindsay Walton</div>
            <div className="appointment-type">Follow-Up Consultation</div>
          </div>
          <div className="patient-actions">
            <div className="flag-badge">
              <FlagIcon />
            </div>
            <button className="icon-button-sm">
              <InfoIcon />
            </button>
          </div>
        </div>
        <div className="action-buttons">
          <button className="btn-outline">
            Request Test
            <TestTubeIcon />
          </button>
          <button className="btn-outline">
            Refer Patient
            <WaypointsIcon />
          </button>
          <button className="btn-outline">
            Mark for Follow-up
          </button>
          <button className="btn-primary">
            Mark as Served
            <BadgeCheckIcon />
          </button>
        </div>
      </div>

      {/* Video and Notes Section - Side by Side */}
      <div className="video-notes-container">
        <div className="video-section">
          <div className="video-main">
            <div className="jitsi-container">
              <JitsiMeet
                roomName={roomName}
                domain="meet.migranium.com"
                userInfo={{
                  displayName: displayName,
                }}
                onApiReady={setApi}
                startWithAudioMuted={startWithAudioMuted}
                startWithVideoMuted={startWithVideoMuted}
                containerStyle={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '12px',
                  overflow: 'hidden',
                }}
              />
            </div>
            <div className="video-side">
              <img src={videoMain} alt="Side video" className="video-image" />
              {isAudioMuted && (
                <button className="mic-off-badge">
                  <MicOffIcon />
                </button>
              )}
            </div>
            <div className="video-controls-overlay">
              <div className="timer">{callDuration}</div>
              <div className="control-buttons">
                <button 
                  className={`control-btn ${isAudioMuted ? 'muted' : ''}`}
                  onClick={toggleAudio}
                  title={isAudioMuted ? 'Unmute' : 'Mute'}
                >
                  <MicIcon />
                  <div className="chevron-up"></div>
                </button>
                <button 
                  className={`control-btn ${isVideoMuted ? 'muted' : ''}`}
                  onClick={toggleVideo}
                  title={isVideoMuted ? 'Turn on video' : 'Turn off video'}
                >
                  <VideoIcon />
                  <div className="chevron-up"></div>
                </button>
                <button 
                  className="control-btn"
                  onClick={toggleChat}
                  title="Toggle chat"
                >
                  <MessageSquareTextIcon />
                </button>
                <button 
                  className={`control-btn ${isScreenSharing ? 'active' : ''}`}
                  onClick={toggleScreenShare}
                  title={isScreenSharing ? 'Stop sharing' : 'Share screen'}
                >
                  <ScreenShareIcon />
                </button>
                <button 
                  className="control-btn"
                  onClick={raiseHand}
                  title="Raise hand"
                >
                  <HandIcon />
                  <div className="chevron-up"></div>
                </button>
                <button 
                  className="control-btn"
                  title="Participants"
                >
                  <UsersIcon />
                  <div className="participant-count">{participantCount}</div>
                </button>
                <button 
                  className="control-btn"
                  onClick={toggleTileView}
                  title="Toggle view"
                >
                  <ViewToggleIcon />
                </button>
                <button 
                  className="control-btn"
                  title="Settings"
                >
                  <SettingsIcon />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="notes-section">
          <div className="tabs">
            <button className="tab active">Notes</button>
            <button className="tab">Patient Charts</button>
          </div>
          <div className="notes-content">
            <div className="notes-scroll-area">
              <div className="notes-placeholder"></div>
              <div className="scrollbar">
                <div className="scrollbar-thumb"></div>
              </div>
            </div>
            <div className="notes-input-area">
              <div className="input-container">
                <button className="input-icon-btn">
                  <PaperclipIcon />
                </button>
                <input type="text" placeholder="Add Note Here..." className="notes-input" />
                <button className="input-icon-btn">
                  <MicIconSmall />
                </button>
              </div>
              <button className="send-btn">
                <SendIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App