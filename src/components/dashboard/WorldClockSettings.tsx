import React, { useState } from 'react';
import { useApp, Space } from '../../contexts/AppContext';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface WorldClockSettingsProps {
  space: Space;
  onClose: () => void;
}

// A comprehensive list of IANA timezones with readable names
const timezones = [
  { value: 'America/New_York', label: 'New York (EST/EDT)' },
  { value: 'America/Chicago', label: 'Chicago (CST/CDT)' },
  { value: 'America/Denver', label: 'Denver (MST/MDT)' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (PST/PDT)' },
  { value: 'America/Anchorage', label: 'Anchorage (AKST/AKDT)' },
  { value: 'Pacific/Honolulu', label: 'Honolulu (HST)' },
  { value: 'America/Toronto', label: 'Toronto (EST/EDT)' },
  { value: 'America/Vancouver', label: 'Vancouver (PST/PDT)' },
  { value: 'America/Mexico_City', label: 'Mexico City (CST/CDT)' },
  { value: 'America/Sao_Paulo', label: 'São Paulo (BRT)' },
  { value: 'America/Buenos_Aires', label: 'Buenos Aires (ART)' },
  { value: 'Europe/London', label: 'London (GMT/BST)' },
  { value: 'Europe/Paris', label: 'Paris (CET/CEST)' },
  { value: 'Europe/Berlin', label: 'Berlin (CET/CEST)' },
  { value: 'Europe/Rome', label: 'Rome (CET/CEST)' },
  { value: 'Europe/Madrid', label: 'Madrid (CET/CEST)' },
  { value: 'Europe/Amsterdam', label: 'Amsterdam (CET/CEST)' },
  { value: 'Europe/Brussels', label: 'Brussels (CET/CEST)' },
  { value: 'Europe/Vienna', label: 'Vienna (CET/CEST)' },
  { value: 'Europe/Warsaw', label: 'Warsaw (CET/CEST)' },
  { value: 'Europe/Prague', label: 'Prague (CET/CEST)' },
  { value: 'Europe/Budapest', label: 'Budapest (CET/CEST)' },
  { value: 'Europe/Bucharest', label: 'Bucharest (EET/EEST)' },
  { value: 'Europe/Athens', label: 'Athens (EET/EEST)' },
  { value: 'Europe/Istanbul', label: 'Istanbul (TRT)' },
  { value: 'Europe/Moscow', label: 'Moscow (MSK)' },
  { value: 'Europe/Kiev', label: 'Kyiv (EET/EEST)' },
  { value: 'Africa/Cairo', label: 'Cairo (EET)' },
  { value: 'Africa/Johannesburg', label: 'Johannesburg (SAST)' },
  { value: 'Africa/Lagos', label: 'Lagos (WAT)' },
  { value: 'Africa/Nairobi', label: 'Nairobi (EAT)' },
  { value: 'Asia/Dubai', label: 'Dubai (GST)' },
  { value: 'Asia/Riyadh', label: 'Riyadh (AST)' },
  { value: 'Asia/Jerusalem', label: 'Jerusalem (IST/IDT)' },
  { value: 'Asia/Kolkata', label: 'Mumbai/Delhi (IST)' },
  { value: 'Asia/Karachi', label: 'Karachi (PKT)' },
  { value: 'Asia/Dhaka', label: 'Dhaka (BST)' },
  { value: 'Asia/Bangkok', label: 'Bangkok (ICT)' },
  { value: 'Asia/Singapore', label: 'Singapore (SGT)' },
  { value: 'Asia/Hong_Kong', label: 'Hong Kong (HKT)' },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Asia/Seoul', label: 'Seoul (KST)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEDT/AEST)' },
  { value: 'Australia/Melbourne', label: 'Melbourne (AEDT/AEST)' },
  { value: 'Australia/Brisbane', label: 'Brisbane (AEST)' },
  { value: 'Australia/Perth', label: 'Perth (AWST)' },
  { value: 'Pacific/Auckland', label: 'Auckland (NZDT/NZST)' },
  { value: 'Pacific/Fiji', label: 'Fiji (FJT)' }
].sort((a, b) => a.label.localeCompare(b.label));

const WorldClockSettings: React.FC<WorldClockSettingsProps> = ({ space, onClose }) => {
  const { updateSpace } = useApp();
  const [newTimezone, setNewTimezone] = useState('');

  const addTimezone = () => {
    if (newTimezone && !space.content.timezones.includes(newTimezone)) {
      const updatedTimezones = [...space.content.timezones, newTimezone];
      updateSpace({ ...space, content: { timezones: updatedTimezones } });
      setNewTimezone('');
    }
  };

  const removeTimezone = (tzToRemove: string) => {
    const updatedTimezones = space.content.timezones.filter((tz: string) => tz !== tzToRemove);
    updateSpace({ ...space, content: { timezones: updatedTimezones } });
  };

  // Get the label for a timezone value
  const getTimezoneLabel = (value: string) => {
    const tz = timezones.find(t => t.value === value);
    return tz ? tz.label : value.split('/').pop()?.replace('_', ' ');
  };

  return (
    <div style={{ padding: '0.5rem' }}>
      <p style={{ marginTop: 0, marginBottom: '1rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>Manage Timezones</p>
      
      <div style={{ marginBottom: '1rem', maxHeight: '200px', overflowY: 'auto' }}>
        {space.content.timezones.map((tz: string) => (
          <div key={tz} style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '0.5rem', 
            background: 'rgba(0,0,0,0.2)', 
            padding: '0.5rem 0.75rem', 
            borderRadius: '6px' 
          }}>
            <span style={{ fontSize: '0.875rem' }}>{getTimezoneLabel(tz)}</span>
            <button 
              onClick={() => removeTimezone(tz)} 
              style={{
                background:'none', 
                border:'none', 
                color:'rgba(255,255,255,0.6)', 
                cursor: 'pointer',
                padding: '0.25rem',
                display: 'flex',
                alignItems: 'center'
              }}
              title="Remove timezone"
            >
              <XMarkIcon width={16} />
            </button>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
        <select
          value={newTimezone}
          onChange={(e) => setNewTimezone(e.target.value)}
          style={{ 
            width: '100%',
            padding: '0.75rem', 
            borderRadius: '6px', 
            border: 'none', 
            background: 'rgba(255, 255, 255, 0.9)',
            fontSize: '0.875rem'
          }}
        >
          <option value="">Select a timezone...</option>
          {timezones
            .filter(tz => !space.content.timezones.includes(tz.value))
            .map(tz => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))
          }
        </select>

        <button 
          onClick={addTimezone} 
          disabled={!newTimezone}
          style={{ 
            padding: '0.75rem 1rem', 
            borderRadius: '6px', 
            border: 'none', 
            background: newTimezone ? '#fbbf24' : 'rgba(251, 191, 36, 0.5)', 
            color: '#4c2b04', 
            fontWeight: '600', 
            cursor: newTimezone ? 'pointer' : 'not-allowed',
            fontSize: '0.875rem'
          }}
        >
          Add Timezone
        </button>
      </div>
    </div>
  );
};

export default WorldClockSettings;