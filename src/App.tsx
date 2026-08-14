import React from 'react';
import { BioSiteProvider, useBioSite } from './context/BioSiteContext';
import { PublicBioSite } from './components/public/PublicBioSite';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminLayout } from './components/admin/AdminLayout';
import { CloudSyncLoader } from './components/common/CloudSyncLoader';

const AppContent: React.FC = () => {
  const { isAdminMode, adminAuth, isInitialLoading, siteSettings } = useBioSite();

  return (
    <>
      <CloudSyncLoader
        isLoading={isInitialLoading}
        brandName={siteSettings.brandName || 'Continental Studio'}
        logoUrl={siteSettings.logoUrl}
        message="Sincronizando dados exclusivos em tempo real..."
      />

      {isAdminMode ? (
        !adminAuth.isAuthenticated ? (
          <AdminLogin />
        ) : (
          <AdminLayout />
        )
      ) : (
        <PublicBioSite />
      )}
    </>
  );
};

export default function App() {
  return (
    <BioSiteProvider>
      <AppContent />
    </BioSiteProvider>
  );
}

