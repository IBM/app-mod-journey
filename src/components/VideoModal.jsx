import React from 'react';
import Modal from 'react-modal';

const modalStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    position: 'relative',
    top: 'auto',
    left: 'auto',
    right: 'auto',
    bottom: 'auto',
    margin: 'auto',
    transform: 'none',
    maxWidth: '90vw',
    maxHeight: '90vh',
    width: '900px',
    padding: '16px',
    background: '#fff',
    borderRadius: '4px',
    border: 'none',
  },
};

/**
 * Plays a YouTube embed in a responsive modal. Open while `url` is set.
 * The referrer policy matters: YouTube refuses to play an embed that arrives without a referrer (error 153).
 */
export default function VideoModal({ url, onClose }) {
  if (!url) {
    return null;
  }

  return (
    <Modal
      isOpen={true}
      onRequestClose={onClose}
      contentLabel="Playbook Modal"
      style={modalStyles}
    >
      <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
        <iframe
          data-cy='video-iframe'
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
          src={url}
          title="YouTube video player"
          referrerPolicy="strict-origin-when-cross-origin"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
      <div style={{ marginTop: '12px', textAlign: 'right' }}>
        <button
          data-cy='modal-close'
          style={{ padding: '6px 16px', cursor: 'pointer' }}
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </Modal>
  );
}
