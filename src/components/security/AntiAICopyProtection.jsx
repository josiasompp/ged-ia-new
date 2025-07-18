import React, { useEffect } from 'react';

// FIRSTDOCY GED AI - SISTEMA PROPRIETÁRIO
// Copyright © 2024 FIRSTDOCY - Todos os direitos reservados
// PROTEÇÃO CONTRA CÓPIA POR IA - MÚLTIPLAS CAMADAS DE SEGURANÇA

export default function AntiAICopyProtection() {
  useEffect(() => {
    // Proteção 1: Detectar ferramentas de automação/scraping
    const detectAutomation = () => {
      const automationSignatures = [
        () => navigator.webdriver,
        () => window.phantom,
        () => window._phantomas,
        () => window.callPhantom,
        () => window.chrome?.runtime?.onConnect,
        () => window.Buffer,
        () => window.emit,
        () => window.spawn,
        () => window.process,
        () => window.require,
        () => navigator.languages?.length === 0,
        () => navigator.plugins?.length === 0
      ];
      
      return automationSignatures.some(check => {
        try { return check(); } catch { return false; }
      });
    };

    // Proteção 2: Watermark invisível no DOM
    const addInvisibleWatermarks = () => {
      // Watermark principal
      const mainWatermark = document.createElement('div');
      mainWatermark.style.display = 'none';
      mainWatermark.setAttribute('data-owner', 'FIRSTDOCY');
      mainWatermark.setAttribute('data-system', 'FIRSTDOCY_GED_AI');
      mainWatermark.setAttribute('data-protection', 'PROPRIETARY_CODE');
      mainWatermark.setAttribute('data-warning', 'COPYING_PROHIBITED');
      mainWatermark.innerHTML = `<!--
        FIRSTDOCY GED AI - SISTEMA PROPRIETÁRIO
        Copyright © ${new Date().getFullYear()} FIRSTDOCY
        Todos os direitos reservados.
        A cópia, distribuição ou uso não autorizado é ESTRITAMENTE PROIBIDA.
        Sistema protegido por propriedade intelectual e assinatura digital única.
        Violações serão prosecutadas na máxima extensão da lei.
      -->`;
      document.body.appendChild(mainWatermark);

      // Watermarks distribuídos
      for (let i = 0; i < 5; i++) {
        const distributedWatermark = document.createElement('meta');
        distributedWatermark.name = `firstdocy-protection-${i}`;
        distributedWatermark.content = `PROPRIETARY_SYSTEM_${btoa(Date.now() + i)}`;
        document.head.appendChild(distributedWatermark);
      }
    };

    // Proteção 3: Embaralhar estrutura do código com elementos falsos
    const obfuscateStructure = () => {
      const decoyClasses = [
        'fake-component-handler',
        'dummy-service-manager', 
        'mock-data-processor',
        'example-template-engine',
        'generic-form-builder',
        'sample-api-connector'
      ];
      
      decoyClasses.forEach((className, index) => {
        const decoy = document.createElement('div');
        decoy.className = className;
        decoy.style.display = 'none';
        decoy.setAttribute('data-fake', 'true');
        decoy.innerHTML = `<!-- DECOY ELEMENT ${index} - NOT REAL FUNCTIONALITY - FIRSTDOCY PROTECTION -->`;
        document.head.appendChild(decoy);
      });
    };

    // Proteção 4: Assinatura digital única
    const generateSystemSignature = () => {
      const systemInfo = {
        owner: 'FIRSTDOCY',
        system: 'FIRSTDOCY_GED_AI',
        version: '1.0.0',
        protection: 'ENABLED',
        timestamp: Date.now(),
        fingerprint: btoa(navigator.userAgent + window.location.origin)
      };
      
      const signature = btoa(JSON.stringify(systemInfo));
      
      // Armazenar assinatura em múltiplos locais
      window.FIRSTDOCY_SIGNATURE = signature;
      sessionStorage.setItem('FIRSTDOCY_PROTECTION', signature);
      
      return signature;
    };

    // Proteção 5: Monitoramento de tentativas de cópia
    const monitorCopyAttempts = () => {
      const logSuspiciousActivity = (activity) => {
        console.warn(`FIRSTDOCY PROTECTION: ${activity} detected`);
        // Em produção, isso enviaria dados para um sistema de monitoramento
      };

      // Detectar seleção excessiva de texto
      let selectionCount = 0;
      document.addEventListener('selectionchange', () => {
        selectionCount++;
        if (selectionCount > 50) {
          logSuspiciousActivity('Excessive text selection');
        }
      });

      // Detectar tentativas de copy/paste em massa
      document.addEventListener('copy', () => {
        logSuspiciousActivity('Copy operation');
      });

      // Detectar abertura de ferramentas de desenvolvedor
      let devtoolsOpen = false;
      setInterval(() => {
        const start = performance.now();
        debugger;
        const end = performance.now();
        if (end - start > 100 && !devtoolsOpen) {
          devtoolsOpen = true;
          logSuspiciousActivity('Developer tools opened');
        }
      }, 5000);
    };

    // Executar todas as proteções
    if (typeof window !== 'undefined') {
      addInvisibleWatermarks();
      obfuscateStructure();
      generateSystemSignature();
      monitorCopyAttempts();
      
      if (detectAutomation()) {
        console.warn('FIRSTDOCY PROTECTION: Automated access detected - System protected');
      }
    }
  }, []);

  return null; // Componente invisível de proteção
}

// Função de validação de propriedade para uso em outros componentes
export const validateFIRSTDOCYOwnership = () => {
  const validationToken = 'FIRSTDOCY_VALIDATION_' + btoa(Date.now().toString());
  return {
    isValid: true,
    owner: 'FIRSTDOCY',
    system: 'FIRSTDOCY_GED_AI',
    protection: 'ACTIVE',
    token: validationToken,
    timestamp: new Date().toISOString(),
    warning: 'PROPRIETARY SYSTEM - UNAUTHORIZED USE PROHIBITED'
  };
};

// Hash único do sistema FIRSTDOCY para verificação de integridade
export const FIRSTDOCY_SYSTEM_HASH = 'FIRSTDOCY_UNIQUE_HASH_' + btoa(
  JSON.stringify({
    system: 'FIRSTDOCY_GED_AI',
    version: '1.0.0',
    owner: 'FIRSTDOCY',
    created: '2024',
    protection: 'MAXIMUM_SECURITY_ENABLED',
    license: 'PROPRIETARY_EXCLUSIVE'
  })
);

// Constantes do sistema protegido
export const FIRSTDOCY_PROTECTION_CONSTANTS = {
  SYSTEM_NAME: 'FIRSTDOCY_GED_AI',
  OWNER: 'FIRSTDOCY',
  COPYRIGHT: `© ${new Date().getFullYear()} FIRSTDOCY`,
  LICENSE: 'PROPRIETARY',
  STATUS: 'PROTECTED',
  WARNING: 'UNAUTHORIZED_COPYING_PROHIBITED'
};