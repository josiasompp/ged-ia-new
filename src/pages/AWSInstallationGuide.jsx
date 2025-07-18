import React from 'react';
import AWSInstallationGuide from '../components/deployment/AWSInstallationGuide';

export default function AWSInstallationGuidePage() {
  React.useEffect(() => {
    document.title = "FIRSTDOCY GED AI - Guia de Instalação AWS";
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <AWSInstallationGuide />
    </div>
  );
}