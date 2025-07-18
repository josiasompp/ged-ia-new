import React from 'react';
import SystemAnalysis from '../components/system/SystemAnalysis';

export default function SystemAnalysisPage() {
  React.useEffect(() => {
    document.title = "FIRSTDOCY GED AI - Análise do Sistema";
  }, []);

  return (
    <div className="p-6">
      <SystemAnalysis />
    </div>
  );
}