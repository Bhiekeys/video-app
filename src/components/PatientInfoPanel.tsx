import { InfoIcon } from '../assets/icons'

interface PatientInfoPanelProps {
  patientName?: string
  appointmentType?: string
  providerName?: string
  locationName?: string
  medium?: string
  referralInfo?: string
  healthCardNo?: string
  phoneNumber?: string
  email?: string
  date?: string
  time?: string
  priority?: string
  checkedIn?: boolean
}

export const PatientInfoPanel = ({
  patientName = 'Lindsay Walton',
  appointmentType = 'Follow-Up Consultation',
  providerName = '[Provider Name]',
  locationName = '[Location Name]',
  medium = 'In Person',
  referralInfo = 'Referral from Dr Oda Nobunaga',
  healthCardNo = '839283482948',
  phoneNumber = '+61480013910',
  email = 'emily@gmail.com',
  date = '12 Apr 2025',
  time = '12:30 pm - 4:00 pm',
  priority = 'Default Priority',
  checkedIn = true
}: PatientInfoPanelProps) => {
  const infoRows = [
    { label: 'Provider', value: providerName },
    { label: 'Location', value: locationName },
    { label: 'Medium', value: medium },
    { label: 'Appointment Type', value: referralInfo },
    { label: 'Health Card No.', value: healthCardNo },
    { label: 'Phone Number', value: phoneNumber },
    { label: 'Email Address', value: email },
    { label: 'Date', value: date },
    { label: 'Time', value: time }
  ]

  return (
    <div className="patient-info-panel">
      <div className="patient-info-panel-header">
        <div className="patient-info-panel-title">
          <div className="patient-info-panel-name">{patientName}</div>
          <div className="patient-info-panel-type">{appointmentType}</div>
        </div>
        <button className="patient-info-panel-info-btn">
          <InfoIcon />
        </button>
      </div>

      <div className="patient-info-panel-badges">
        <div className="patient-info-badge priority-badge">
          <div className="flag-icon-red"></div>
          <span>{priority}</span>
        </div>
        {checkedIn && (
          <div className="patient-info-badge checked-in-badge">
            <div className="status-dot"></div>
            <span>Checked In</span>
          </div>
        )}
      </div>

      <div className="patient-info-panel-table">
        {infoRows.map((row, index) => (
          <div key={index} className="patient-info-row">
            <div className="patient-info-label">{row.label}</div>
            <div className="patient-info-value">{row.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

