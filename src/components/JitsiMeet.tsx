import { JitsiMeeting } from '@jitsi/react-sdk'
import { useEffect } from 'react'

interface JitsiMeetProps {
  roomName: string
  domain?: string
  userInfo?: {
    displayName?: string
    email?: string
  }
  onApiReady?: (api: any) => void
  containerStyle?: React.CSSProperties
  startWithAudioMuted?: boolean
  startWithVideoMuted?: boolean
}

const APP_NAME = 'Migranium'

export const JitsiMeet = ({ 
  roomName, 
  domain = 'meet.migranium.com',
  userInfo,
  onApiReady,
  containerStyle,
  startWithAudioMuted = false,
  startWithVideoMuted = false
}: JitsiMeetProps) => {
  
  // Inject CSS to hide pre-join screen and watermark
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      .css-1dtlqni-content,
      .premeeting-screen,
      .css-1a5i9rv-container,
      [class*="premeeting"],
      [class*="prejoin"],
      [class*="Prejoin"] {
        display: none !important;
      }
      
      /* Aggressively hide watermark */
      .watermark,
      .leftwatermark,
      div.watermark,
      a.watermark,
      [class*="watermark"],
      [class*="leftwatermark"] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
        width: 0 !important;
        height: 0 !important;
      }
      
      #jitsiConferenceFrame0 {
        display: block !important;
      }
    `
    document.head.appendChild(style)
    
    // Watch for watermark elements and hide them immediately
    const observer = new MutationObserver((mutations) => {
      const watermarks = document.querySelectorAll('[class*="watermark"], .watermark, .leftwatermark')
      watermarks.forEach((el) => {
        if (el instanceof HTMLElement) {
          el.style.display = 'none'
          el.style.visibility = 'hidden'
          el.style.opacity = '0'
          el.remove()
        }
      })
    })
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    })
    
    return () => {
      document.head.removeChild(style)
      observer.disconnect()
    }
  }, [])

  const handleApiReady = (api: any) => {
    if (api) {
      // Hide toolbar and filmstrip
      api.executeCommand('toggleToolbar', false)
      api.executeCommand('toggleFilmstrip', false)
      
      // Set audio/video state
      if (startWithAudioMuted) {
        api.executeCommand('toggleAudio')
      }
      if (startWithVideoMuted) {
        api.executeCommand('toggleVideo')
      }
      
      // Remove watermark from inside the iframe
      setTimeout(() => {
        try {
          const iframe = document.querySelector('#jitsiConferenceFrame0') as HTMLIFrameElement
          if (iframe && iframe.contentWindow) {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document
            const watermarks = iframeDoc.querySelectorAll('[class*="watermark"], .watermark, .leftwatermark')
            watermarks.forEach((el) => {
              if (el instanceof HTMLElement) {
                el.style.display = 'none'
                el.style.visibility = 'hidden'
                el.remove()
              }
            })
            
            // Add CSS to the iframe to prevent watermark from appearing
            const style = iframeDoc.createElement('style')
            style.textContent = `
              .watermark,
              .leftwatermark,
              [class*="watermark"] {
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
              }
            `
            iframeDoc.head.appendChild(style)
          }
        } catch (e) {
          console.log('Could not access iframe content:', e)
        }
      }, 1000)
      
      // Keep checking and removing watermark
      const interval = setInterval(() => {
        try {
          const iframe = document.querySelector('#jitsiConferenceFrame0') as HTMLIFrameElement
          if (iframe && iframe.contentWindow) {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document
            const watermarks = iframeDoc.querySelectorAll('[class*="watermark"], .watermark, .leftwatermark')
            watermarks.forEach((el) => {
              if (el instanceof HTMLElement) {
                el.style.display = 'none'
                el.remove()
              }
            })
          }
        } catch (e) {
          // Ignore errors
        }
      }, 500)
      
      // Clean up interval after 10 seconds
      setTimeout(() => clearInterval(interval), 10000)
    }
    onApiReady?.(api)
  }

  const config = {
    startWithAudioMuted: startWithAudioMuted,
    startWithVideoMuted: startWithVideoMuted,
    enableWelcomePage: false,
    disableDeepLinking: true,
    prejoinPageEnabled: false,
    prejoinConfig: {
      enabled: false,
    },
    skipPrejoin: true,
    disableInviteFunctions: true,
    enableLayerSuspension: true,
    enableNoAudioDetection: true,
    enableNoisyMicDetection: false,
    enableTalkWhileMuted: false,
    enableRemb: true,
    enableTcc: true,
    useStunTurn: true,
    videoQuality: { maxBitrate: 1280, minBitrate: 320, idealBitrate: 720 },
    hideDisplayName: true,
    hideEmailInSettings: true,
    disableThirdPartyRequests: false,
    defaultLanguage: 'en',
    disableRemoteMute: false,
    enableClosePage: true,
    enableInsecureRoomNameWarning: false,
    defaultBackground: '#000000',
    skipPrejoinButton: true,
    requireDisplayName: false,
    externalAPIEnabled: true,
    // Additional settings to bypass pre-join
    // prejoinPageEnabled: false,
    disablePreJoinPageVideo: true,
    disablePreJoinPageAudio: true,
    autoKnockLobby: false,
    enableLobbyChat: false,
    // Disable watermarks
    watermarkLink: '',
    hideConferenceSubject: true,
    hideConferenceTimer: false,
    hideParticipantsStats: true
  }

  const interfaceConfig = {
    TOOLBAR_BUTTONS: [],
    TOOLBAR_ALWAYS_VISIBLE: false,
    INITIAL_TOOLBAR_TIMEOUT: 0,
    TOOLBAR_TIMEOUT: 0,
    DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
    DISABLE_FOCUS_INDICATOR: true,
    DISABLE_DOMINANT_SPEAKER_INDICATOR: true,
    DISABLE_PARTICIPANTS_INDICATOR: true,
    DISABLE_TRANSCRIPTION_SUBTITLES: true,
    DISABLE_VIDEO_BACKGROUND: true,
    DISABLE_RINGING: true,
    DISABLE_PRESENCE_STATUS: true,
    DISABLE_RECORDING: true,
    DISABLE_REMOTE_VIDEO_MENU: true,
    DISABLE_WELCOME_PAGE: true,
    DISABLE_PREJOIN_PAGE: true,
    SHOW_JITSI_WATERMARK: false,
    SHOW_WATERMARK_FOR_GUESTS: false,
    SHOW_BRAND_WATERMARK: false,
    SHOW_POWERED_BY: false,
    SHOW_DEEP_LINKING_IMAGE: false,
    CONNECTION_INDICATOR_AUTO_HIDE_ENABLED: true,
    CONNECTION_INDICATOR_AUTO_HIDE_TIMEOUT: 0,
    CONNECTION_INDICATOR_DISABLED: true,
    APP_NAME: APP_NAME,
    NATIVE_APP_NAME: APP_NAME,
    PROVIDER_NAME: APP_NAME,
    DEFAULT_REMOTE_DISPLAY_NAME: 'Participant',
    DEFAULT_LOCAL_DISPLAY_NAME: 'me',
    SETTINGS_SECTIONS: [],
    HIDE_INVITE_MORE_HEADER: true,
    DEFAULT_BACKGROUND: '#000000',
    VIDEO_LAYOUT_FIT: 'both',
    FILM_STRIP_MAX_HEIGHT: 0,
    VERTICAL_FILMSTRIP: false,
    ENABLE_DIAL_OUT: false,
    ENABLE_FILE_UPLOAD: false,
    CLOSE_PAGE_GENERATES_LEAVE: true,
    SHOW_PROMOTIONAL_CLOSE_PAGE: false,
    GENERATE_ROOMNAMES_ON_WELCOME_PAGE: false,
    DISPLAY_WELCOME_PAGE_CONTENT: false,
    DISPLAY_WELCOME_PAGE_TOOLBAR_ADDITIONAL_CONTENT: false,
    MOBILE_APP_PROMO: false,
    MOBILE_APP_PROMO_ENABLED: false,
    MOBILE_APP_PROMO_TIMEOUT: 0
  }

  return (
    <div style={{ width: '100%', height: '100%', ...containerStyle }}>
      <JitsiMeeting
        domain={domain}
        roomName={roomName}
        configOverwrite={config}
        interfaceConfigOverwrite={interfaceConfig}
        userInfo={{
          displayName: userInfo?.displayName || 'Provider',
          email: userInfo?.email || ''
        }}
        onApiReady={handleApiReady}
        getIFrameRef={(iframeRef) => {
          if (!iframeRef) return
          
          const iframe = iframeRef as HTMLIFrameElement
          Object.assign(iframe.style, {
            height: '100%',
            width: '100%',
            border: 'none',
            borderRadius: '12px',
            background: '#000000'
          })
        }}
      />
    </div>
  )
}