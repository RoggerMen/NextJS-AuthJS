'use client';

import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';
import React, { FC, ReactNode } from 'react'

interface HandleSignOutComponentProps {
  children: ReactNode;
}
const HandleSignOutComponent: FC<HandleSignOutComponentProps> = ({children}) => {

    const handleSignOut = () => {
        signOut({ callbackUrl: "/" }).then(() => {
          localStorage.removeItem("welcomeModalShown");
        });
      };

  return (
    <Button
        onClick={handleSignOut}
        className="flex items-center gap-2 bg-zinc-950 hover:bg-gray-900 h-10 rounded-md justify-center text-sm w-fit px-6 text-zinc-100"
      >
        {children}
      </Button>
  )
}

export default HandleSignOutComponent
