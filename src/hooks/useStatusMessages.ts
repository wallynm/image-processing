import { useState, useCallback } from 'react';

export interface StatusMessage {
  text: string;
  type: 'info' | 'success' | 'error';
  id: number;
}

export const useStatusMessages = () => {
  const [statusMessages, setStatusMessages] = useState<StatusMessage[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [step, setStep] = useState<string>('initial');

  const createMessage = useCallback((text: string, type: StatusMessage['type'] = 'info') => {
    setStatusMessages((prev) => [...prev, { 
      text,
      type,
      id: Date.now() + Math.random()
    }]);
  }, []);

  const addMessage = useCallback(() => createMessage, [createMessage]);
  const addSuccessMessage = useCallback(() => (text: string) => createMessage(text, 'success'), [createMessage]);
  const addErrorMessage = useCallback(() => (text: string) => createMessage(text, 'error'), [createMessage]);

  const setErrorState = useCallback((message: string) => {
    setErrorMessage(message);
    setStep('error');
  }, []);

  const clearStatusMessages = useCallback(() => {
    setStatusMessages([]);
  }, []);

  return {
    statusMessages,
    errorMessage,
    step,
    addMessage: addMessage(),
    addSuccessMessage: addSuccessMessage(),
    addErrorMessage: addErrorMessage(),
    setErrorState,
    clearStatusMessages,
    setStep
  };
}; 