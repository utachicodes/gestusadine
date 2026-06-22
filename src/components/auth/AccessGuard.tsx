import * as React from 'react';

interface AccessGuardProps {
  children: React.ReactNode;
  requiredTier?: string;
  fallback?: React.ReactNode;
}

export const AccessGuard: React.FC<AccessGuardProps> = ({ children }) => {
  return <>{children}</>;
};
