import React from 'react';
import LocalDevelopmentSetup from '../components/development/LocalDevelopmentSetup';

export default function LocalDevelopmentSetupPage() {
  React.useEffect(() => {
    document.title = "FIRSTDOCY GED AI - Configuração para Desenvolvimento Local";
  }, []);

  return <LocalDevelopmentSetup />;
}