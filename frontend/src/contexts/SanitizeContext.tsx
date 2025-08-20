import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SanitizeContextType {
  sanitize: boolean;
  setSanitize: (value: boolean) => void;
}

const SanitizeContext = createContext<SanitizeContextType | undefined>(undefined);

export const SanitizeProvider = ({ children }: { children: ReactNode }) => {
  const [sanitize, setSanitize] = useState(true);
  return (
    <SanitizeContext.Provider value={{ sanitize, setSanitize }}>
      {children}
    </SanitizeContext.Provider>
  );
};

export const useSanitize = () => {
  const context = useContext(SanitizeContext);
  if (!context) {
    throw new Error('useSanitize must be used within a SanitizeProvider');
  }
  return context;
}; 