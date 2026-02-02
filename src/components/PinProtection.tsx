import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Lock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PinProtectionProps {
  onSuccess: () => void;
  correctPin: string;
}

export function PinProtection({ onSuccess, correctPin }: PinProtectionProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const navigate = useNavigate();

  const handlePinChange = (value: string) => {
    setPin(value);
    setError(false);
    
    // Auto-submit when 4 digits entered
    if (value.length === 4) {
      if (value === correctPin) {
        onSuccess();
      } else {
        setError(true);
        setAttempts(prev => prev + 1);
        setTimeout(() => setPin(''), 500);
      }
    }
  };

  const handleBackToDashboard = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Admin Access</CardTitle>
          <CardDescription>
            Enter your 4-digit PIN to access the admin panel
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <InputOTP
              maxLength={4}
              value={pin}
              onChange={handlePinChange}
              disabled={attempts >= 5}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} className={error ? 'border-destructive' : ''} />
                <InputOTPSlot index={1} className={error ? 'border-destructive' : ''} />
                <InputOTPSlot index={2} className={error ? 'border-destructive' : ''} />
                <InputOTPSlot index={3} className={error ? 'border-destructive' : ''} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          {error && (
            <p className="text-center text-sm text-destructive">
              Incorrect PIN. {attempts >= 5 ? 'Too many attempts.' : `${5 - attempts} attempts remaining.`}
            </p>
          )}

          {attempts >= 5 && (
            <p className="text-center text-sm text-muted-foreground">
              Please try again later or contact support.
            </p>
          )}

          <Button
            variant="outline"
            className="w-full"
            onClick={handleBackToDashboard}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
