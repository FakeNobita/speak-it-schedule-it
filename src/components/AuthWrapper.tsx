
import React from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton, useClerk } from '@clerk/clerk-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, LogIn, Loader2 } from 'lucide-react';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const { loaded } = useClerk();

  // Show loading state while Clerk is initializing
  if (!loaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <Card className="p-8 max-w-md w-full mx-4 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
            <p className="text-gray-600">Loading...</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <>
      <SignedOut>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
          <Card className="p-8 max-w-md w-full mx-4 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="p-3 bg-blue-500 rounded-full">
                  <Mic className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800">Say to Plan</h1>
              </div>
              <p className="text-gray-600 mb-8 text-lg">
                Organize your day with your voice. Sign in to get started!
              </p>
              <SignInButton mode="modal" fallbackRedirectUrl="/">
                <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 text-lg font-semibold">
                  <LogIn className="h-5 w-5 mr-2" />
                  Sign In to Continue
                </Button>
              </SignInButton>
            </div>
          </Card>
        </div>
      </SignedOut>
      
      <SignedIn>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
          {/* Header with User Button */}
          <header className="bg-white/70 backdrop-blur-sm border-b border-blue-100 px-4 py-3">
            <div className="container mx-auto max-w-4xl flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-full">
                  <Mic className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">Say to Plan</h1>
              </div>
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "h-10 w-10"
                  }
                }}
              />
            </div>
          </header>
          
          {/* Main Content */}
          <div className="pt-4">
            {children}
          </div>
        </div>
      </SignedIn>
    </>
  );
};
