import React from 'react';
import GedGuide from '../components/documentation/GedGuide';

export default function GedUserGuide() {
  React.useEffect(() => {
    document.title = "FIRSTDOCY GED AI - Guia de Uso do GED";
  }, []);

  return (
    <div className="p-6">
      <GedGuide />
    </div>
  );
}