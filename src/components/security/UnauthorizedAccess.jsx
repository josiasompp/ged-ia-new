import React from 'react';
import { Button } from '@/components/ui/button';
import { Lock, ShieldAlert, LogOut } from 'lucide-react';
import { User as UserEntity } from '@/api/entities';

export default function UnauthorizedAccess() {

  const handleLogout = async () => {
    await UserEntity.logout();
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-red-200">
          <Lock className="w-10 h-10 text-red-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800">Acesso Não Autorizado</h1>
        <p className="mt-4 text-gray-600">
          Seu email foi autenticado, mas não está cadastrado ou ativado na plataforma FIRSTDOCY.
        </p>
        <p className="mt-2 text-gray-500">
          Para obter acesso, por favor, entre em contato com o administrador da sua empresa e solicite seu cadastro.
        </p>
        <div className="mt-8">
          <Button onClick={handleLogout} className="w-full bg-red-600 hover:bg-red-700">
            <LogOut className="w-4 h-4 mr-2" />
            Sair e Tentar com Outra Conta
          </Button>
        </div>
        <div className="mt-12 text-xs text-gray-400">
          <ShieldAlert className="w-4 h-4 mx-auto mb-2" />
          Por motivos de segurança, apenas usuários previamente cadastrados podem acessar o sistema. Esta tentativa de acesso foi registrada.
        </div>
      </div>
    </div>
  );
}