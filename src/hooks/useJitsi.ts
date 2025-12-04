import { useState, useEffect, useRef } from 'react'

interface UseJitsiOptions {
  roomName: string
  domain?: string
  userInfo?: {
    displayName?: string
    email?: string
  }
}

export const useJitsi = ({ roomName, domain = 'meet.migranium.com', userInfo }: UseJitsiOptions) => {
  const [api, setApi] = useState<any>(null)
  const [isAudioMuted, setIsAudioMuted] = useState(false)
  const [isVideoMuted, setIsVideoMuted] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [participantCount, setParticipantCount] = useState(1)
  const [callDuration, setCallDuration] = useState(0)
  const apiRef = useRef<any>(null)
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (api) {
      apiRef.current = api

      // Hide Jitsi UI elements
      try {
        api.executeCommand('toggleToolbar', false)
        api.executeCommand('toggleFilmstrip', false)
        api.executeCommand('setVideoQuality', 720)
        // Set spotlight view (one main video)
        api.executeCommand('setVideoLayout', { mode: 'spotlight' })
      } catch (error) {
        console.log('Error hiding Jitsi UI:', error)
      }

      // Listen to audio mute status
      api.addEventListener('audioMuteStatusChanged', ({ muted }: { muted: boolean }) => {
        setIsAudioMuted(muted)
      })

      // Listen to video mute status
      api.addEventListener('videoMuteStatusChanged', ({ muted }: { muted: boolean }) => {
        setIsVideoMuted(muted)
      })

      // Listen to screen sharing status
      api.addEventListener('screenSharingStatusChanged', ({ on }: { on: boolean }) => {
        setIsScreenSharing(on)
      })

      // Listen to participant count
      const updateParticipantCount = () => {
        try {
          const participants = api.getParticipantsInfo()
          setParticipantCount(participants.length + 1) // +1 for local participant
        } catch (error) {
          console.error('Error getting participants:', error)
        }
      }

      api.addEventListener('participantJoined', updateParticipantCount)
      api.addEventListener('participantLeft', updateParticipantCount)

      // Start call duration timer
      durationIntervalRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)

      // Get initial participant count
      try {
        const participants = api.getParticipantsInfo()
        setParticipantCount(participants.length + 1)
      } catch (error) {
        console.error('Error getting initial participants:', error)
      }
    }

    return () => {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current)
      }
    }
  }, [api])

  const toggleAudio = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand('toggleAudio')
    }
  }

  const toggleVideo = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand('toggleVideo')
    }
  }

  const toggleScreenShare = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand('toggleShareScreen')
    }
  }

  const toggleChat = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand('toggleChat')
    }
  }

  const raiseHand = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand('toggleRaiseHand')
    }
  }

  const toggleTileView = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand('toggleTileView')
    }
  }

  const hangup = () => {
    if (apiRef.current) {
      apiRef.current.dispose()
    }
  }

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  return {
    api,
    setApi,
    isAudioMuted,
    isVideoMuted,
    isScreenSharing,
    participantCount,
    callDuration: formatDuration(callDuration),
    toggleAudio,
    toggleVideo,
    toggleScreenShare,
    toggleChat,
    raiseHand,
    toggleTileView,
    hangup
  }
}

