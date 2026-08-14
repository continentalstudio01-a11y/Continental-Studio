import React from 'react';
import { BioSiteProvider, useBioSite } from './context/BioSiteContext';
import { PublicBioSite } from './components/public/PublicBioSite';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminLayout } from './components/admin/AdminLayout';

const AppContent: React.FC = () => {
  const { isAdminMode, adminAuth } = useBioSite();

  if (isAdminMode) {
    if (!adminAuth.isAuthenticated) {
      return <AdminLogin />;
    }
    return <AdminLayout />;
  }

  return <PublicBioSite />;
};

export default function App() {
  return (
    <BioSiteProvider>
      <AppContent />
    </BioSiteProvider>
  );
}
