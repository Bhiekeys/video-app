import './App.css'
import videoMain from './assets/video-main.png'
import { JitsiMeet } from './components/JitsiMeet'
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
  // Generate a unique room name (you can replace this with your own logic)
  const roomName = `room-${Date.now()}`
  
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
      displayName: 'Provider',
    },
  })
  return (
    <div className="app-container">
      {/* Top Section - Patient Info and Actions */}
     
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
        {/* Video Section */}
        <div className="video-section">
          <div className="video-main">
            <div className="jitsi-container">
              <JitsiMeet
                roomName={roomName}
                domain="meet.migranium.com"
                userInfo={{
                  displayName: 'Provider',
                }}
                onApiReady={setApi}
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

        {/* Notes Section */}
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
