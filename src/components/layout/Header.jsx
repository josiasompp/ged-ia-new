import React, { useState, useEffect } from 'react';
import { User as UserEntity } from '@/api/entities';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown, LogOut, Settings } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';


export default function Header() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await UserEntity.me();
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await UserEntity.logout();
    window.location.href = createPageUrl('LandingPage');
  };

  if (isLoading) {
    return (
      <header className="flex h-16 shrink-0 items-center justify-end px-6 bg-white border-b">
        <Skeleton className="h-8 w-32 rounded-md" />
      </header>
    );
  }

  return (
    <header className="flex h-16 shrink-0 items-center justify-end px-6 bg-white border-b">
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                 <AvatarFallback className="bg-gradient-to-br from-blue-500 to-green-500 text-white font-bold">
                    {user.full_name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                 </AvatarFallback>
              </Avatar>
              <div className="text-left hidden md:block">
                <p className="text-sm font-medium">{user.full_name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link to={createPageUrl('Settings')}>
                <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configurações</span>
                </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:bg-red-50 focus:text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link to={createPageUrl('SecureAccess')}>
            <Button>Login</Button>
        </Link>
      )}
    </header>
  );
}