import { useState } from 'react'
import { JitsiMeeting } from '@jitsi/react-sdk'

interface JitsiMeetProps {
  roomName: string
  domain?: string
  userInfo?: {
    displayName?: string
    email?: string
  }
  onApiReady?: (api: any) => void
  containerStyle?: React.CSSProperties
}

export const JitsiMeet = ({ 
  roomName, 
  domain = 'meet.migranium.com',
  userInfo,
  onApiReady,
  containerStyle
}: JitsiMeetProps) => {
  const [jitsiApi, setJitsiApi] = useState<any>(null)

  const handleApiReady = (api: any) => {
    setJitsiApi(api)
    
    // Hide all Jitsi UI elements
    if (api) {
      // Execute commands to hide UI
      api.executeCommand('toggleToolbar', false)
      api.executeCommand('toggleFilmstrip', false)
      
      // Inject CSS to hide elements
      const iframe = api.getIFrame()
      if (iframe && iframe.contentDocument) {
        const style = iframe.contentDocument.createElement('style')
        style.textContent = `
          .watermark,
          .leftwatermark,
          .rightwatermark,
          [class*="watermark"],
          [id*="watermark"],
          .poweredby,
          [class*="powered"],
          .toolbox,
          [class*="toolbox"],
          .toolbar,
          [class*="toolbar"],
          .filmstrip,
          [class*="filmstrip"],
          .videocontainer__toolbar,
          [class*="videocontainer__toolbar"],
          .connection-indicator,
          [class*="connection-indicator"],
          .subject,
          [class*="subject"],
          .header,
          [class*="header"],
          .header-text,
          [class*="header-text"],
          .videocontainer__background,
          .videocontainer__background--dark {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            height: 0 !important;
            width: 0 !important;
            overflow: hidden !important;
          }
          #jitsi-meet {
            background: #000000 !important;
          }
        `
        iframe.contentDocument.head.appendChild(style)
      }
    }
    
    if (onApiReady) {
      onApiReady(api)
    }
  }

  const config = {
    startWithAudioMuted: false,
    startWithVideoMuted: false,
    enableWelcomePage: false,
    disableDeepLinking: true,
    prejoinPageEnabled: false,
    disableInviteFunctions: true,
    enableLayerSuspension: true,
    enableNoAudioDetection: true,
    enableNoisyMicDetection: true,
    enableTalkWhileMuted: false,
    enableRemb: true,
    enableTcc: true,
    useStunTurn: true,
    videoQuality: {
      maxBitrate: 1280,
      minBitrate: 320,
      idealBitrate: 720
    },
    // Hide UI elements
    hideDisplayName: true,
    hideEmailInSettings: true,
    disableThirdPartyRequests: false,
    // Video layout
    defaultLanguage: 'en',
    // Disable features we don't need
    disableRemoteMute: false,
    enableClosePage: false,
    enableInsecureRoomNameWarning: false,
    // Background
    defaultBackground: '#000000'
  }

  const interfaceConfig = {
    TOOLBAR_BUTTONS: [],
    SETTINGS_SECTIONS: [],
    HIDE_INVITE_MORE_HEADER: true,
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
    TOOLBAR_ALWAYS_VISIBLE: false,
    INITIAL_TOOLBAR_TIMEOUT: 0,
    TOOLBAR_TIMEOUT: 0,
    DEFAULT_BACKGROUND: '#000000',
    SHOW_JITSI_WATERMARK: false,
    SHOW_WATERMARK_FOR_GUESTS: false,
    SHOW_BRAND_WATERMARK: false,
    SHOW_POWERED_BY: false,
    SHOW_DEEP_LINKING_IMAGE: false,
    GENERATE_ROOMNAMES_ON_WELCOME_PAGE: false,
    DISPLAY_WELCOME_PAGE_CONTENT: false,
    DISPLAY_WELCOME_PAGE_TOOLBAR_ADDITIONAL_CONTENT: false,
    APP_NAME: 'Migranium',
    NATIVE_APP_NAME: 'Migranium',
    PROVIDER_NAME: 'Migranium',
    DEFAULT_REMOTE_DISPLAY_NAME: 'Participant',
    DEFAULT_LOCAL_DISPLAY_NAME: 'me',
    CONNECTION_INDICATOR_AUTO_HIDE_ENABLED: true,
    CONNECTION_INDICATOR_AUTO_HIDE_TIMEOUT: 0,
    CONNECTION_INDICATOR_DISABLED: true,
    VIDEO_LAYOUT_FIT: 'both',
    FILM_STRIP_MAX_HEIGHT: 0,
    VERTICAL_FILMSTRIP: false,
    ENABLE_DIAL_OUT: false,
    ENABLE_FILE_UPLOAD: false,
    CLOSE_PAGE_GENERATES_LEAVE: true,
    SHOW_PROMOTIONAL_CLOSE_PAGE: false,
    MOBILE_APP_PROMO: false,
    MOBILE_APP_PROMO_ENABLED: false,
    MOBILE_APP_PROMO_TIMEOUT: 0,
    DISABLE_VIDEO_BACKGROUND: true,
    HIDE_INVITE_MORE_HEADER: true
  }

  return (
    <div style={{ width: '100%', height: '100%', ...containerStyle }}>
       <style>{
        `.toolbox-content-wrapper {
          display: none !important;
        }`
        }</style>
      <JitsiMeeting
        domain={domain}
        roomName={roomName}
        config={config}
        interfaceConfig={interfaceConfig}
        userInfo={userInfo}
        onApiReady={handleApiReady}
        getIFrameRef={(iframeRef) => {
          if (iframeRef) {
            iframeRef.style.height = '100%'
            iframeRef.style.width = '100%'
            iframeRef.style.border = 'none'
            iframeRef.style.borderRadius = '12px'
            iframeRef.style.background = '#000000'
            
            // Wait for iframe to load, then inject CSS
            iframeRef.onload = () => {
              try {
                const iframeDoc = iframeRef.contentDocument || iframeRef.contentWindow?.document
                if (iframeDoc) {
                  const style = iframeDoc.createElement('style')
                  style.textContent = `
                    .watermark,
                    .leftwatermark,
                    .rightwatermark,
                    [class*="watermark"],
                    [id*="watermark"],
                    .poweredby,
                    [class*="powered"],
                    .toolbox,
                    [class*="toolbox"],
                    .toolbar,
                    [class*="toolbar"],
                    .filmstrip,
                    [class*="filmstrip"],
                    .videocontainer__toolbar,
                    [class*="videocontainer__toolbar"],
                    .connection-indicator,
                    [class*="connection-indicator"],
                    .subject,
                    [class*="subject"],
                    .header,
                    [class*="header"],
                    .header-text,
                    [class*="header-text"],
                    .videocontainer__background,
                    .videocontainer__background--dark {
                      display: none !important;
                      visibility: hidden !important;
                      opacity: 0 !important;
                      height: 0 !important;
                      width: 0 !important;
                      overflow: hidden !important;
                    }
                    #jitsi-meet,
                    body {
                      background: #000000 !important;
                    }
                  `
                  iframeDoc.head.appendChild(style)
                }
              } catch (e) {
                console.log('Cannot access iframe content (cross-origin):', e)
              }
            }
          }
        }}
      />
    </div>
  )
}
