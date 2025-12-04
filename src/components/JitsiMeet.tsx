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

const APP_NAME = 'Migranium'
const WATERMARK_SELECTORS = '.watermark, .leftwatermark, .rightwatermark, div.watermark.leftwatermark, div.watermark.rightwatermark, [class*="watermark"], [id*="watermark"]'
const HIDE_STYLES = 'display: none !important; visibility: hidden !important; opacity: 0 !important; height: 0 !important; width: 0 !important; overflow: hidden !important;'

export const JitsiMeet = ({ 
  roomName, 
  domain = 'meet.migranium.com',
  userInfo,
  onApiReady,
  containerStyle
}: JitsiMeetProps) => {
  const handleApiReady = (api: any) => {
    if (api) {
      api.executeCommand('toggleToolbar', false)
      api.executeCommand('toggleFilmstrip', false)
    }
    onApiReady?.(api)
  }

  const setupIframeStyles = (iframeDoc: Document) => {
    if (iframeDoc.getElementById('jitsi-custom-hide-styles')) return

    const style = iframeDoc.createElement('style')
    style.id = 'jitsi-custom-hide-styles'
    style.textContent = `
      ${WATERMARK_SELECTORS},
      .poweredby, [class*="powered"],
      .toolbox, [class*="toolbox"],
      .toolbar, [class*="toolbar"],
      .filmstrip, [class*="filmstrip"],
      .videocontainer__toolbar, [class*="videocontainer__toolbar"],
      .connection-indicator, [class*="connection-indicator"],
      .subject, [class*="subject"],
      .header, [class*="header"],
      .header-text, [class*="header-text"],
      .videocontainer__background, .toolbox-content-wrapper, .videocontainer__background--dark {
        ${HIDE_STYLES}
      }
      #jitsi-meet, body {
        background: #000000 !important;
      }
    `
    iframeDoc.head.appendChild(style)

    const hideWatermarks = () => {
      iframeDoc.querySelectorAll(WATERMARK_SELECTORS).forEach((el: Element) => {
        const htmlEl = el as HTMLElement
        Object.assign(htmlEl.style, {
          display: 'none',
          visibility: 'hidden',
          opacity: '0',
          height: '0',
          width: '0',
          overflow: 'hidden'
        })
      })
    }

    hideWatermarks()

    const observer = new MutationObserver(hideWatermarks)
    observer.observe(iframeDoc.body || iframeDoc.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'id']
    })
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
    videoQuality: { maxBitrate: 1280, minBitrate: 320, idealBitrate: 720 },
    hideDisplayName: true,
    hideEmailInSettings: true,
    disableThirdPartyRequests: false,
    defaultLanguage: 'en',
    disableRemoteMute: false,
    enableClosePage: false,
    enableInsecureRoomNameWarning: false,
    defaultBackground: '#000000'
  }

  const interfaceConfig = {
    // Toolbar settings
    TOOLBAR_BUTTONS: [],
    TOOLBAR_ALWAYS_VISIBLE: false,
    INITIAL_TOOLBAR_TIMEOUT: 0,
    TOOLBAR_TIMEOUT: 0,
    
    // Disable features
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
    
    // Hide watermarks and branding
    SHOW_JITSI_WATERMARK: false,
    SHOW_WATERMARK_FOR_GUESTS: false,
    SHOW_BRAND_WATERMARK: false,
    SHOW_POWERED_BY: false,
    SHOW_DEEP_LINKING_IMAGE: false,
    
    // Connection indicator
    CONNECTION_INDICATOR_AUTO_HIDE_ENABLED: true,
    CONNECTION_INDICATOR_AUTO_HIDE_TIMEOUT: 0,
    CONNECTION_INDICATOR_DISABLED: true,
    
    // App branding
    APP_NAME: APP_NAME,
    NATIVE_APP_NAME: APP_NAME,
    PROVIDER_NAME: APP_NAME,
    
    // Display names
    DEFAULT_REMOTE_DISPLAY_NAME: 'Participant',
    DEFAULT_LOCAL_DISPLAY_NAME: 'me',
    
    // Other settings
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

  const trySetupStyles = (iframe: HTMLIFrameElement) => {
    try {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
      if (iframeDoc?.head) {
        setupIframeStyles(iframeDoc)
      } else {
        setTimeout(() => trySetupStyles(iframe), 100)
      }
    } catch (e) {
      console.log('Cannot access iframe content (cross-origin):', e)
    }
  }

  return (
    <div style={{ width: '100%', height: '100%', ...containerStyle }}>
      <JitsiMeeting
        domain={domain}
        roomName={roomName}
        configOverwrite={config}
        interfaceConfigOverwrite={interfaceConfig}
        {...(userInfo?.displayName ? { userInfo: { displayName: userInfo.displayName, email: userInfo.email || '' } } : {})}
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
          
          iframe.onload = () => setTimeout(() => trySetupStyles(iframe), 200)
          setTimeout(() => trySetupStyles(iframe), 500)
        }}
      />
    </div>
  )
}
