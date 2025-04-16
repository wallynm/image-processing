import { useState, useCallback } from 'react';
export const useStatusMessages = () => {
    const [statusMessages, setStatusMessages] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
    const [step, setStep] = useState('initial');
    const createMessage = useCallback((text, type = 'info') => {
        setStatusMessages((prev) => [...prev, {
                text,
                type,
                id: Date.now() + Math.random()
            }]);
    }, []);
    const addMessage = useCallback(() => createMessage, [createMessage]);
    const addSuccessMessage = useCallback(() => (text) => createMessage(text, 'success'), [createMessage]);
    const addErrorMessage = useCallback(() => (text) => createMessage(text, 'error'), [createMessage]);
    const setErrorState = useCallback((message) => {
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
