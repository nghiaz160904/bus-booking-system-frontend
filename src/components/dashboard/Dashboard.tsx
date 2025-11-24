import React from 'react';
import SummaryCards from './SummaryCards';
import ActivityList from './ActivityList';
import RoleAdaptiveWidget from './RoleAdaptiveWidget';
import { useAuth } from '@/context/AuthContext';

const Dashboard: React.FC = () => {
  const { userRole, isLoadingUser } = useAuth();

  if (isLoadingUser) return <div>Loading...</div>;

  return (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h1 style={{ margin: 0 }}>Dashboard {userRole ? `(${userRole})` : ''}</h1>
      <SummaryCards />
      <div
        style={{
          display: 'grid',
          gap: '1.5rem',
          gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))',
        }}
      >
        <ActivityList />
        <RoleAdaptiveWidget />
      </div>
    </div>
  );
};

export default Dashboard;
