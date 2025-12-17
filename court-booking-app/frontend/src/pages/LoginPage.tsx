import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { WarpBackground } from '../components/ui/warp-background';
import { Calendar, Mail, User, Lock } from 'lucide-react';
import { auth } from '../lib/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { authAPI } from '../services/api';

export const LoginPage: React.FC = () => {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      
      // Sign in with Google popup
      const userCredential = await signInWithPopup(auth, provider);
      
      // Get ID token
      const idToken = await userCredential.user.getIdToken();
      
      // Sync with backend
      const response = await authAPI.syncFirebaseUser(idToken);
      const backendUser = response.data.user;
      
      login(idToken, backendUser);
      navigate('/');
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in cancelled. Please try again.');
      } else if (err.code === 'auth/popup-blocked') {
        setError('Pop-up blocked. Please allow pop-ups for this site.');
      } else {
        setError(err.message || 'Failed to sign in with Google. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authAPI.sendOTP(email, name);
      setStep('otp');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.verifyOTP(email, name, otp);
      const { token, user } = response.data;
      login(token, user);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 md:p-8">
      <WarpBackground className="w-full max-w-md bg-white/95 backdrop-blur-sm">
        <Card className="border-0 shadow-none bg-transparent">
          <CardHeader className="space-y-1 text-center px-4 sm:px-6">
          <div className="flex justify-center mb-3 sm:mb-4">
            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-primary rounded-full flex items-center justify-center">
              <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold">Welcome to Court Booking</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            {showAdminLogin 
              ? 'Admin login with OTP verification' 
              : 'Sign in with your Google account to get started'}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          {!showAdminLogin ? (
            <div className="space-y-4">
              {error && (
                <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                  {error}
                </div>
              )}
              <Button 
                onClick={handleGoogleSignIn} 
                className="w-full flex items-center justify-center gap-2 sm:gap-3 h-11 sm:h-12 text-sm sm:text-base"
                disabled={loading}
                variant="outline"
              >
                {loading ? (
                  'Signing in...'
                ) : (
                  <>
                    <svg className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Sign in with Google
                  </>
                )}
              </Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    or
                  </span>
                </div>
              </div>
              <Button
                type="button"
                variant="link"
                className="w-full text-xs sm:text-sm"
                onClick={() => setShowAdminLogin(true)}
              >
                Not a user? Admin login here
              </Button>
              <p className="text-xs sm:text-sm text-center text-muted-foreground">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          ) : step === 'email' ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    className="pl-9"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-9"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              {error && (
                <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                  {error}
                </div>
              )}
              <Button type="submit" className="w-full h-10 sm:h-11 text-sm sm:text-base" disabled={loading}>
                {loading ? 'Sending...' : 'Send OTP'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full text-sm sm:text-base"
                onClick={() => {
                  setShowAdminLogin(false);
                  setError('');
                  setName('');
                  setEmail('');
                }}
              >
                Back to Google Sign-In
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">One-Time Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    className="pl-9 text-center text-base sm:text-lg tracking-widest"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength={6}
                    required
                  />
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  OTP sent to {email}
                </p>
              </div>
              {error && (
                <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                  {error}
                </div>
              )}
              <Button type="submit" className="w-full h-10 sm:h-11 text-sm sm:text-base" disabled={loading || otp.length !== 6}>
                {loading ? 'Verifying...' : 'Verify & Login'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full text-sm sm:text-base"
                onClick={() => {
                  setStep('email');
                  setOtp('');
                  setError('');
                }}
              >
                Back to Email
              </Button>
            </form>
          )}
        </CardContent>
        </Card>
      </WarpBackground>
    </div>
  );
};
