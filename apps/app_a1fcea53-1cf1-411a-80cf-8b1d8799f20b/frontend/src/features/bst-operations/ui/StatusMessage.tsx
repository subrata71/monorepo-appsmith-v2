import { Alert, AlertDescription } from '@/shared/ui/alert';
import { CheckCircle, XCircle, Info } from 'lucide-react';
import type { StatusType } from '@/entities/bst';

interface StatusMessageProps {
  message: string;
  type: StatusType;
}

export const StatusMessage = ({ message, type }: StatusMessageProps) => {
  if (!message) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'info':
      default:
        return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  const getVariant = () => {
    switch (type) {
      case 'error':
        return 'destructive';
      default:
        return 'default';
    }
  };

  return (
    <Alert variant={getVariant()} className="flex items-center space-x-2">
      {getIcon()}
      <AlertDescription className="flex-1">{message}</AlertDescription>
    </Alert>
  );
};