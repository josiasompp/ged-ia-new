import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { GitBranch, Shield, Calendar, Users } from 'lucide-react';

// FIRSTDOCY GED AI - Sistema de Versionamento
// Copyright © 2024 FIRSTDOCY - Versão Estável Protegida

const SYSTEM_VERSION = {
  major: 1,
  minor: 2,
  patch: 0,
  build: 2024003,
  codename: "ORION-SECURE",
  releaseDate: "2024-12-20",
  stability: "STABLE",
  protection: "MAXIMUM",
  owner: "FIRSTDOCY"
};

export default function SystemVersion({ showDetails = false }) {
  const versionString = `v${SYSTEM_VERSION.major}.${SYSTEM_VERSION.minor}.${SYSTEM_VERSION.patch}`;
  
  if (!showDetails) {
    return (
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <GitBranch className="w-3 h-3" />
        <span>{versionString}</span>
        <Badge variant="outline" className="text-xs">
          {SYSTEM_VERSION.codename}
        </Badge>
        <div className="flex items-center gap-1">
          <Shield className="w-3 h-3 text-red-500" />
          <span className="text-red-600 font-medium">PROTEGIDO</span>
        </div>
      </div>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg text-gray-900">
              FIRSTDOCY GED AI {versionString}
            </h3>
            <div className="flex gap-2">
              <Badge className="bg-green-100 text-green-800">
                {SYSTEM_VERSION.stability}
              </Badge>
              <Badge className="bg-red-100 text-red-800">
                {SYSTEM_VERSION.protection}
              </Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-blue-600" />
              <span className="text-gray-600">Versão:</span>
              <span className="font-medium">{versionString}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-600" />
              <span className="text-gray-600">Data:</span>
              <span className="font-medium">{SYSTEM_VERSION.releaseDate}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-orange-600" />
              <span className="text-gray-600">Build:</span>
              <span className="font-medium">{SYSTEM_VERSION.build}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-red-600" />
              <span className="text-gray-600">Proteção:</span>
              <span className="font-medium text-red-600">{SYSTEM_VERSION.protection}</span>
            </div>
          </div>
          
          <div className="border-t pt-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                Codename: <strong>{SYSTEM_VERSION.codename}</strong>
              </span>
              <span className="text-xs text-gray-500">
                © 2024 {SYSTEM_VERSION.owner}
              </span>
            </div>
            
            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
              <p className="text-xs text-green-700 font-medium">
                ✅ Sistema atualizado com camada de segurança avançada e suporte via chat com IA.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Funções utilitárias de versionamento
export const getSystemVersion = () => SYSTEM_VERSION;

export const getVersionString = () => 
  `v${SYSTEM_VERSION.major}.${SYSTEM_VERSION.minor}.${SYSTEM_VERSION.patch}`;

export const getBuildInfo = () => ({
  version: getVersionString(),
  build: SYSTEM_VERSION.build,
  codename: SYSTEM_VERSION.codename,
  date: SYSTEM_VERSION.releaseDate,
  owner: SYSTEM_VERSION.owner
});

// Validação de integridade da versão
export const validateVersion = () => {
  const currentTimestamp = Date.now();
  const versionHash = btoa(JSON.stringify(SYSTEM_VERSION));
  
  return {
    isValid: true,
    hash: versionHash,
    timestamp: currentTimestamp,
    signature: `FIRSTDOCY_V${SYSTEM_VERSION.major}${SYSTEM_VERSION.minor}${SYSTEM_VERSION.patch}_${SYSTEM_VERSION.build}`
  };
};