import { useState } from 'react'
import { AppointmentSetup } from './AppointmentSetup'
import { JitsiMeet } from './JitsiMeet'

/**
 * Example usage of the AppointmentSetup component
 * This shows how to integrate the appointment setup screen with the video call
 */
export const AppointmentSetupExample = () => {
  const [appointmentStarted, setAppointmentStarted] = useState(false)
  const [displayName, setDisplayName] = useState('Provider')
  const roomName = `room-${Date.now()}`

  const handleStartAppointment = (name: string) => {
    setDisplayName(name)
    setAppointmentStarted(true)
  }

  if (appointmentStarted) {
    return (
      <div style={{ width: '100vw', height: '100vh' }}>
        <JitsiMeet
          roomName={roomName}
          domain="meet.migranium.com"
          userInfo={{
            displayName: displayName,
          }}
        />
      </div>
    )
  }

  return <AppointmentSetup onStartAppointment={handleStartAppointment} />
}

