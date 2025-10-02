import React, { useState, useRef, useEffect } from 'react';
import { 
  MagnifyingGlassIcon,
  MicrophoneIcon,
  SpeakerWaveIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useSearch } from '../../contexts/SearchContext';

interface SearchInterfaceProps {
  onSearch?: (query: string, sources?: string[]) => void;
}

const SearchInterface: React.FC<SearchInterfaceProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [selectedSources, setSelectedSources] = useState<string[]>(['all']);
  const [isRecording, setIsRecording] = useState(false);
  const [showSourceSelector, setShowSourceSelector] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [micPermissionError, setMicPermissionError] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { performSearch, isLoading } = useSearch();

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  // Available search sources
  const searchSources = [
    { id: 'all', name: 'All Sources', icon: '🌐', description: 'Search across all platforms' },
    { id: 'kb', name: 'Knowledge Base', icon: '📚', description: 'Internal knowledge base' },
    { id: 'confluence', name: 'Confluence', icon: '🔗', description: 'Confluence wiki pages' },
    { id: 'sharepoint', name: 'SharePoint', icon: '📄', description: 'SharePoint documents' },
  ];

  // Check if mobile and iOS on mount
  useEffect(() => {
    const checkMobile = () => {
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const ios = /iPad|iPhone|iPod/.test(navigator.userAgent);
      // Check if it's Chrome on iOS (CriOS = Chrome iOS)
      const isChromeIOS = /CriOS/i.test(navigator.userAgent);
      
      setIsMobile(mobile);
      // Only disable for iOS if it's NOT Chrome
      setIsIOS(ios && !isChromeIOS);
    };
    checkMobile();
  }, []);

  // Sync recording state with actual listening state
  useEffect(() => {
    setIsRecording(listening);
  }, [listening]);

  useEffect(() => {
    if (transcript) {
      let cleanedTranscript = transcript
        .replace(/^I\.\s*/i, '')
        .replace(/^I\s*/i, '')
        .replace(/\s+/g, ' ')
        .trim();
      
      setQuery(cleanedTranscript);
    }
  }, [transcript]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [query]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      if (isRecording) {
        stopListening();
      }
      
      if (onSearch) {
        onSearch(query, selectedSources);
      } else {
        await performSearch(query);
      }
      
      setQuery(''); // Clear input after search
    }
  };

  const handleSourceToggle = (sourceId: string) => {
    if (sourceId === 'all') {
      setSelectedSources(['all']);
    } else {
      const newSources = selectedSources.includes('all') ? [] : [...selectedSources];
      
      if (newSources.includes(sourceId)) {
        const filtered = newSources.filter(id => id !== sourceId);
        setSelectedSources(filtered.length === 0 ? ['all'] : filtered);
      } else {
        setSelectedSources([...newSources, sourceId]);
      }
    }
  };

  const startListening = async () => {
    if (!browserSupportsSpeechRecognition) {
      return;
    }

    setMicPermissionError(false);
    resetTranscript();
    setQuery('');

    try {
      // Start speech recognition - browser will handle permission
      await SpeechRecognition.startListening({ 
        continuous: true,
        language: 'en-US',
        interimResults: true
      });
      setIsRecording(true);
    } catch (err: any) {
      console.error("Speech recognition error:", err);
      setMicPermissionError(true);
      setIsRecording(false);
      
      // Show helpful error message
      if (err.message && err.message.includes('not-allowed')) {
        alert("Microphone permission denied.\n\nTo enable:\n1. Tap the lock/info icon in the address bar\n2. Tap 'Permissions' or 'Site settings'\n3. Enable 'Microphone'\n4. Refresh and try again");
      }
    }
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
    setIsRecording(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuery(e.target.value);
  };

  const getSelectedCount = () => {
    if (selectedSources.includes('all')) return 'All';
    if (selectedSources.length === 1) return '1 source';
    return `${selectedSources.length} sources`;
  };

  const isSourceActive = () => {
    return !selectedSources.includes('all') && selectedSources.length > 0;
  };

  // Check if voice search is available
  const isVoiceSearchAvailable = browserSupportsSpeechRecognition && !isIOS;

  return (
    <div className="search-interface">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-container">
          <div className="search-input-wrapper">
            <textarea
              ref={textareaRef}
              value={query}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about your company resources..."
              className="search-textarea"
              rows={1}
              disabled={isLoading}
              style={{ resize: 'none', overflow: 'hidden' }}
            />
          </div>

          <div className="search-controls">
            <div className="search-actions">
              {isVoiceSearchAvailable && (
                <button
                  type="button"
                  onClick={isRecording ? stopListening : startListening}
                  className={`action-button ${isRecording ? 'recording' : ''} ${micPermissionError ? 'error' : ''}`}
                  title={isRecording ? 'Stop recording' : isMobile ? 'Tap to speak' : 'Start voice search'}
                >
                  {isRecording ? (
                    <SpeakerWaveIcon className="icon" />
                  ) : (
                    <MicrophoneIcon className="icon" />
                  )}
                </button>
              )}

              {/* Globe Focus Button - Minimalistic */}
              <button
                type="button"
                onClick={() => setShowSourceSelector(!showSourceSelector)}
                className={`focus-globe-button ${showSourceSelector ? 'active' : ''} ${isSourceActive() ? 'has-selection' : ''}`}
                title={`Search focus: ${getSelectedCount()}`}
              >
                <GlobeAltIcon className="globe-icon" />
                {isSourceActive() && <div className="selection-dot"></div>}
              </button>
            </div>

            <button
              type="submit"
              disabled={!query.trim() || isLoading}
              className="search-button"
            >
              <MagnifyingGlassIcon className="icon" />
            </button>
          </div>

          {isRecording && (
            <div className="recording-indicator">
              <div className="recording-dot"></div>
              <span>{isMobile ? 'Listening... (tap mic to stop)' : 'Listening...'}</span>
            </div>
          )}
        </div>

        {/* Source Selector Panel - Multiple Selection */}
        {showSourceSelector && (
          <div className="source-selector-panel">
            <div className="source-selector-header">
              <h3>Choose your search sources</h3>
              <p>Select one or multiple platforms to search</p>
            </div>
            <div className="source-options-grid">
              {searchSources.map(source => (
                <button
                  key={source.id}
                  type="button"
                  className={`source-option-card ${selectedSources.includes(source.id) ? 'selected' : ''}`}
                  onClick={() => handleSourceToggle(source.id)}
                >
                  <div className="source-option-icon">{source.icon}</div>
                  <div className="source-option-content">
                    <h4>{source.name}</h4>
                    <p>{source.description}</p>
                  </div>
                  <div className={`source-checkbox ${selectedSources.includes(source.id) ? 'checked' : ''}`}>
                    {selectedSources.includes(source.id) && <span className="checkmark">✓</span>}
                  </div>
                </button>
              ))}
            </div>
            
            {/* Selection Summary */}
            <div className="selection-summary">
              <span className="selection-text">
                {selectedSources.includes('all') 
                  ? 'Searching all sources' 
                  : selectedSources.length === 0
                    ? 'No sources selected'
                    : `Searching ${selectedSources.length} source${selectedSources.length > 1 ? 's' : ''}`
                }
              </span>
            </div>
          </div>
        )}
      </form>

      {/* Help text for voice search */}
      {!isVoiceSearchAvailable && (
        <p style={{ textAlign: 'center', marginTop: '1rem', color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
          {isIOS 
            ? '🎤 Voice search is not supported in Safari on iOS. Please use Chrome or text input.'
            : !browserSupportsSpeechRecognition
              ? '🎤 Voice search not supported. Try Chrome browser.'
              : '🎤 Voice search available'}
        </p>
      )}
      
      {micPermissionError && (
        <p style={{ textAlign: 'center', marginTop: '0.5rem', color: 'rgba(239, 68, 68, 0.9)', fontSize: '0.9rem' }}>
          ⚠️ Microphone permission denied. Check site permissions in browser settings.
        </p>
      )}
    </div>
  );
};

export default SearchInterface;