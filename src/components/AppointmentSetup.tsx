import './AppointmentSetup.css'
import { PatientInfoPanel } from './PatientInfoPanel'
import { StartAppointmentPanel } from './StartAppointmentPanel'

interface AppointmentSetupProps {
  onStartAppointment?: (roomName: string, displayName: string, audioEnabled: boolean, videoEnabled: boolean) => void
  defaultRoomName?: string
}

export const AppointmentSetup = ({ onStartAppointment, defaultRoomName }: AppointmentSetupProps) => {
  return (
    <div className="appointment-setup-container">
      <PatientInfoPanel />
      <StartAppointmentPanel onStartAppointment={onStartAppointment} defaultRoomName={defaultRoomName} />
    </div>
  )
}

