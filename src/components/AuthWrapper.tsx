
import React from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, LogIn, Sparkles, CheckCircle, Clock, TrendingUp } from 'lucide-react';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  return (
    <>
      <SignedOut>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50/50 to-purple-50 flex items-center justify-center relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>

          <Card className="relative p-12 max-w-lg w-full mx-4 bg-white/80 backdrop-blur-xl border-0 shadow-2xl rounded-3xl">
            <div className="text-center">
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="relative">
                  <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl shadow-2xl">
                    <Mic className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Say to Plan
                  </h1>
                  <div className="flex items-center gap-1 justify-center mt-1">
                    <Sparkles className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm text-gray-500 font-medium">AI-Powered</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                Transform your voice into organized tasks. 
                <br />
                <span className="font-semibold text-gray-700">Sign in to get started!</span>
              </p>

              {/* Feature highlights */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-2">
                    <Mic className="h-6 w-6 text-blue-600" />
                  </div>
                  <p className="text-xs text-gray-600 font-medium">Voice Input</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-2">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <p className="text-xs text-gray-600 font-medium">Smart Tasks</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-2">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <p className="text-xs text-gray-600 font-medium">Track Progress</p>
                </div>
              </div>

              <SignInButton mode="modal" fallbackRedirectUrl="/">
                <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-4 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  <LogIn className="h-5 w-5 mr-3" />
                  Sign In to Continue
                </Button>
              </SignInButton>
            </div>
          </Card>
        </div>
      </SignedOut>
      
      <SignedIn>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50/30 to-purple-50/20 relative">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/5 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-400/5 rounded-full blur-3xl"></div>
          </div>

          {/* Enhanced Header */}
          <header className="relative bg-white/70 backdrop-blur-xl border-b border-blue-100/50 px-6 py-4 shadow-lg">
            <div className="container mx-auto max-w-6xl flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                    <Mic className="h-7 w-7 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Say to Plan
                  </h1>
                  <div className="flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-yellow-500" />
                    <span className="text-xs text-gray-500 font-medium">AI-Powered Planning</span>
                  </div>
                </div>
              </div>
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "h-12 w-12 shadow-lg ring-2 ring-blue-500/20"
                  }
                }}
              />
            </div>
          </header>
          
          {/* Main Content */}
          <div className="relative pt-8">
            {children}
          </div>
        </div>
      </SignedIn>
    </>
  );
};
