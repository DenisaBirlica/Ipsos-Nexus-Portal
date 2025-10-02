import React, { useState } from 'react';
import { useApp, DashboardLink } from '../../contexts/AppContext';
import { TrashIcon, PlusIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface LinkSpaceProps {
  spaceId: string;
  links: DashboardLink[];
}

const LinkSpace: React.FC<LinkSpaceProps> = ({ spaceId, links }) => {
  const { addLinkToSpace, removeLinkFromSpace } = useApp();
  const [newToolName, setNewToolName] = useState('');
  const [newToolUrl, setNewToolUrl] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (newToolName && newToolUrl) {
      addLinkToSpace(spaceId, { name: newToolName, url: newToolUrl });
      setNewToolName('');
      setNewToolUrl('');
      setShowAddForm(false);
    }
  };

  const handleCancelAdd = () => {
      setShowAddForm(false);
      setNewToolName('');
      setNewToolUrl('');
  }

  const confirmDelete = (linkId: string) => {
    removeLinkFromSpace(spaceId, linkId);
    setDeletingId(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {links.map(link => (
        <div 
          key={link.id}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '6px',
            padding: '0.5rem 0.75rem',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem'
          }}
        >
          <a 
            href={link.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ 
              color: 'white', 
              textDecoration: 'none', 
              flex: 1, 
              overflow: 'hidden', 
              textOverflow: 'ellipsis', 
              whiteSpace: 'nowrap',
              fontSize: '0.875rem'
            }}
          >
            {link.name}
          </a>
          {deletingId === link.id ? (
            <div style={{display: 'flex', alignItems: 'center', gap: '0.25rem'}}>
                <button onClick={() => confirmDelete(link.id)} style={{background:'none', border:'none', color:'#34D399', cursor: 'pointer', padding: '0.25rem', display: 'flex'}}><CheckIcon width={18}/></button>
                <button onClick={() => setDeletingId(null)} style={{background:'none', border:'none', color:'#F87171', cursor: 'pointer', padding: '0.25rem', display: 'flex'}}><XMarkIcon width={18}/></button>
            </div>
          ) : (
            <button
                onClick={() => setDeletingId(link.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', display: 'flex' }}
            >
                <TrashIcon style={{ width: '16px', height: '16px', color: 'rgba(255, 255, 255, 0.6)' }} />
            </button>
          )}
        </div>
      ))}

      {showAddForm ? (
         <div style={{ 
           marginTop: '0.5rem',
           display: 'flex',
           flexDirection: 'column',
           gap: '0.5rem',
           background: 'rgba(0, 0, 0, 0.2)',
           padding: '0.75rem',
           borderRadius: '8px'
         }}>
            <form onSubmit={handleAddLink} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <input
                type="text"
                placeholder="Link Name"
                value={newToolName}
                onChange={(e) => setNewToolName(e.target.value)}
                style={{ 
                  width: '100%',
                  padding: '0.75rem', 
                  borderRadius: '6px', 
                  border: 'none', 
                  background: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '0.875rem'
                }}
              />
              <input
                type="url"
                placeholder="URL (https://...)"
                value={newToolUrl}
                onChange={(e) => setNewToolUrl(e.target.value)}
                style={{ 
                  width: '100%',
                  padding: '0.75rem', 
                  borderRadius: '6px', 
                  border: 'none', 
                  background: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '0.875rem'
                }}
                required
              />
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  type="submit" 
                  style={{ 
                    flex: 1,
                    padding: '0.75rem 1rem', 
                    borderRadius: '6px', 
                    border: 'none', 
                    background: '#fbbf24', 
                    color: '#4c2b04', 
                    fontWeight: '600', 
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  Add
                </button>
                <button 
                  type="button" 
                  onClick={handleCancelAdd} 
                  style={{ 
                    flex: 1,
                    padding: '0.75rem 1rem', 
                    borderRadius: '6px', 
                    border: '1px solid rgba(255,255,255,0.3)', 
                    background: 'rgba(255,255,255,0.1)', 
                    color: 'white', 
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
      ) : (
        <button 
            onClick={() => setShowAddForm(true)}
            style={{
                background: 'none', 
                border: '1px dashed rgba(255,255,255,0.3)', 
                color: 'rgba(255,255,255,0.7)',
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.75rem', 
                width: '100%',
                marginTop: '0.25rem', 
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: '500',
                transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'none';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
            }}
        >
            <PlusIcon style={{width: '16px'}} /> Add a link
        </button>
      )}
    </div>
  );
};

export default LinkSpace;