import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Copyright, AlertTriangle, Lock, X } from 'lucide-react';

export default function LegalNotice() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se o usuário já viu o aviso legal
    const hasSeenNotice = localStorage.getItem('firstdocy_legal_notice_seen');
    
    if (!hasSeenNotice) {
      // Mostrar após um pequeno delay para não interferir no carregamento
      const timer = setTimeout(() => {
        setIsVisible(true);
        setIsLoading(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Marcar como visto para este usuário/dispositivo
    localStorage.setItem('firstdocy_legal_notice_seen', 'true');
    localStorage.setItem('firstdocy_legal_notice_date', new Date().toISOString());
  };

  const handleAccept = () => {
    handleClose();
    // Log da aceitação (opcional)
    console.log('FIRSTDOCY: Legal Notice Acknowledged');
  };

  if (isLoading || !isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="bg-gradient-to-br from-red-50 via-orange-50 to-red-100 border-2 border-red-300 shadow-2xl max-w-md w-full animate-in fade-in duration-300">
        <CardHeader className="pb-3 relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 h-6 w-6 text-red-600 hover:bg-red-200"
            onClick={handleClose}
          >
            <X className="w-4 h-4" />
          </Button>
          <CardTitle className="flex items-center gap-2 text-red-800 text-lg">
            <Shield className="w-5 h-5 animate-pulse" />
            Sistema Protegido
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-3 text-sm text-red-700">
            <div className="flex items-center gap-2 font-semibold text-base">
              <Copyright className="w-4 h-4" />
              <span>© {new Date().getFullYear()} FIRSTDOCY</span>
            </div>
            
            <div className="bg-red-100 p-3 rounded-lg border border-red-200">
              <p className="leading-relaxed font-medium mb-2">
                Sistema proprietário com proteção anti-IA integrada.
              </p>
              <p className="leading-relaxed">
                Uso exclusivo e licenciado da FIRSTDOCY.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2 bg-red-200 p-2 rounded-lg">
              <AlertTriangle className="w-4 h-4" />
              <span className="font-bold text-red-800">CÓPIA ESTRITAMENTE PROIBIDA</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Lock className="w-4 h-4" />
              <span>Proteção Ativa | Monitoramento Contínuo</span>
            </div>
          </div>

          <div className="text-sm text-red-600 border-t border-red-200 pt-3">
            <p className="font-semibold mb-1">AVISO LEGAL IMPORTANTE:</p>
            <p className="leading-relaxed">
              Violações de propriedade intelectual serão prosecutadas na máxima extensão da lei. 
              O uso deste sistema implica na aceitação dos termos de proteção.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleAccept}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              Li e Aceito
            </Button>
            <Button
              onClick={handleClose}
              variant="outline"
              className="flex-1 border-red-300 text-red-700 hover:bg-red-50"
            >
              Fechar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}