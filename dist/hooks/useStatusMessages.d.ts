export interface StatusMessage {
    text: string;
    type: 'info' | 'success' | 'error';
    id: number;
}
export declare const useStatusMessages: () => {
    statusMessages: StatusMessage[];
    errorMessage: string | null;
    step: string;
    addMessage: (text: string, type?: StatusMessage["type"]) => void;
    addSuccessMessage: (text: string) => void;
    addErrorMessage: (text: string) => void;
    setErrorState: (message: string) => void;
    clearStatusMessages: () => void;
    setStep: import("react").Dispatch<import("react").SetStateAction<string>>;
};
