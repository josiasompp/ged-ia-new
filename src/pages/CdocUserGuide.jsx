import React from 'react';
import CdocGuide from '../components/documentation/CdocGuide';

export default function CdocUserGuide() {
  React.useEffect(() => {
    document.title = "FIRSTDOCY GED AI - Guia de Uso do CDOC";
  }, []);

  return (
    <div className="p-6">
      <CdocGuide />
    </div>
  );
}