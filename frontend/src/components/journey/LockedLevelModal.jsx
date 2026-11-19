import React from 'react';
import { Lock, ArrowRight } from 'lucide-react';
import Modal from '../shared/Modal';
import HexBadge from '../shared/HexBadge';
import { levelInfo, unlockRequirement } from '../../utils/journey';

export default function LockedLevelModal({ milestone, milestones, onClose, onGoToCurrent }) {
  const info = levelInfo(milestone.level);
  const current = milestones.find((m) => m.status === 'current');
  return (
    <Modal
      title={`Level ${milestone.level}: ${milestone.name}`}
      icon={<HexBadge size={46} tone="grey" icon={info.icon} />}
      onClose={onClose}
      actions={[
        <button key="close" className="tk-btn tk-btn--outline" onClick={onClose}>Close</button>,
        current && (
          <button key="go" className="tk-btn tk-btn--primary" onClick={onGoToCurrent}>
            Continue Level {current.level} <ArrowRight size={18} />
          </button>
        ),
      ]}
    >
      <p>{milestone.desc}</p>
      <div className="tk-unlock-note">
        <Lock size={18} />
        <span>{unlockRequirement(milestones, milestone.level) || 'This level is locked.'}</span>
      </div>
    </Modal>
  );
}
