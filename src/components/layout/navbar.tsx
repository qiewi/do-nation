// components/Navbar.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Logo from '@Images/logo.png';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface User {
  id: string;
  username: string;
  email: string;
  // Add any other user properties you need
}

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<User | null>(null);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Donation', path: '/homepage' },
    { name: 'History', path: '/history' },
  ];

  // Fetch user session on component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/user');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user); // Set user data if session exists

        }
      } catch (error) {
        console.error('Failed to fetch user session', error);
      }
    };

    fetchUser();
  }, []);

  // Handle sign-out
  const handleSignOut = async () => {
    try {
      const res = await fetch('/api/auth/signout', {
        method: 'POST',
      });

      if (res.ok) {
        setUser(null); // Clear user state
        toast.success('You have successfully signed out.');
        router.push('/auth'); // Redirect to sign-in page
      } else {
        toast.error('Failed to sign out. Please try again.');
      }
    } catch (error) {
      console.error('Sign-out error:', error);
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="flex justify-between items-center p-6 px-12 bg-white">
      <div className="flex flex-row items-center gap-6">
        {/* Logo navigates to '/' */}
        <Image
          src={Logo}
          alt="Logo"
          width={136}
          height={200}
          className="cursor-pointer"
          onClick={() => router.push('/')}
        />

        <h1 className="text-2xl text-neutral-300 font-normal">|</h1>

        {/* Navigation Links */}
        <div className="flex flex-row text-xl font-semibold items-center gap-8 ml-2">
          {navLinks.map((link) => (
            <h1
              key={link.name}
              onClick={() => router.push(link.path)}
              className={`cursor-pointer bg-transparent transition-transform duration-300 transform hover:scale-105 ${
                pathname === link.path
                  ? 'text-blue-500 underline decoration-blue-500 underline-offset-4'
                  : 'text-gray-800'
              }`}
            >
              {link.name}
            </h1>
          ))}
        </div>
      </div>

      {/* Conditional Button */}
      {user ? (
        <Button
          className="bg-red-500 font-semibold text-white text-xl px-6 py-2 rounded-xl hover:bg-red-600"
          onClick={handleSignOut}
        >
          Keluar
        </Button>
      ) : (
        <Button
          className="bg-[#4C84F6] font-semibold text-white text-xl px-6 py-2 rounded-xl hover:bg-blue-600"
          onClick={() => router.push('/auth')}
        >
          Masuk
        </Button>
      )}
    </div>
  );
};

export default Navbar;
