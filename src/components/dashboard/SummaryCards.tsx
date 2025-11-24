import React from 'react';
import { useAuth } from '@/context/AuthContext';
import type { SummaryMetric } from '@/types/dashboard';
import { summaryMetrics } from '@/types/dashboard';

const SummaryCards: React.FC = () => {
  const { userRole } = useAuth();
  const visible = summaryMetrics.filter(
    (m: SummaryMetric) => !m.roles || (userRole && m.roles.includes(userRole)),
  );

  return (
    <div
      className="grid summary-cards"
      style={{
        display: 'grid',
        gap: '1rem',
        gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))',
      }}
    >
      {visible.map((m) => (
        <div
          key={m.id}
          className="card"
          style={{
            padding: '1rem',
            background: '#fff',
            border: '1px solid #e4e4e4',
            borderRadius: 8,
          }}
        >
          <div style={{ fontSize: '1.5rem' }}>{m.icon}</div>
          <div style={{ fontWeight: 600 }}>{m.label}</div>
          <div style={{ fontSize: '1.25rem' }}>{m.value}</div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
