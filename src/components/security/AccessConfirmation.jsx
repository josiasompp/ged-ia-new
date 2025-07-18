import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Lock, AlertTriangle, CheckCircle, Eye, EyeOff } from 'lucide-react';

export default function AccessConfirmation({ 
  isOpen, 
  onClose, 
  onConfirm, 
  feature, 
  user, 
  requirePassword = false,
  requiredRole = null 
}) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleConfirm = async () => {
    setIsVerifying(true);
    
    // Simular verificação
    setTimeout(() => {
      onConfirm(password, confirmationCode);
      setIsVerifying(false);
      handleClose();
    }, 1000);
  };

  const handleClose = () => {
    setPassword('');
    setConfirmationCode('');
    setShowPassword(false);
    onClose();
  };

  const getSecurityLevel = () => {
    if (feature.permissions?.includes('admin') || feature.permissions?.includes('super_admin')) {
      return { level: 'CRÍTICO', color: 'text-red-600', bg: 'bg-red-50 border-red-200' };
    } else if (feature.permissions?.includes('manager')) {
      return { level: 'ALTO', color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200' };
    } else {
      return { level: 'MÉDIO', color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200' };
    }
  };

  const security = getSecurityLevel();

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className={`w-5 h-5 ${security.color}`} />
            Confirmação de Acesso
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Alert className={security.bg}>
            <AlertTriangle className={`h-4 w-4 ${security.color}`} />
            <AlertDescription>
              <strong>Nível de Segurança: {security.level}</strong>
              <br />
              Você está tentando acessar: <strong>{feature.title}</strong>
            </AlertDescription>
          </Alert>

          <div className="space-y-3 text-sm text-gray-600">
            <p><strong>Funcionalidade:</strong> {feature.title}</p>
            <p><strong>Descrição:</strong> {feature.description}</p>
            <p><strong>Seu Papel:</strong> {user.role === 'admin' ? 'Administrador' : 'Usuário'}</p>
            <p><strong>Empresa:</strong> {user.company_id}</p>
          </div>

          {requirePassword && (
            <div className="space-y-2">
              <Label htmlFor="password">Confirme sua senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha para confirmar"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          )}

          {feature.requiresConfirmationCode && (
            <div className="space-y-2">
              <Label htmlFor="confirmationCode">Código de Confirmação</Label>
              <Input
                id="confirmationCode"
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
                placeholder="Digite o código enviado por email"
                maxLength={6}
              />
              <p className="text-xs text-gray-500">
                Um código foi enviado para {user.email}
              </p>
            </div>
          )}

          <Alert className="bg-blue-50 border-blue-200">
            <Lock className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-700">
              Este acesso será registrado nos logs de auditoria por questões de segurança.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={isVerifying || (requirePassword && !password) || (feature.requiresConfirmationCode && !confirmationCode)}
            className="bg-red-600 hover:bg-red-700"
          >
            {isVerifying ? (
              <>
                <Lock className="w-4 h-4 mr-2 animate-spin" />
                Verificando...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Confirmar Acesso
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}