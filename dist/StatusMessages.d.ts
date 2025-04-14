export type StatusMessage = {
    id: number;
    text: string;
    type: 'success' | 'error' | 'info';
};
type StatusMessagesProps = {
    messages: StatusMessage[];
};
export declare function StatusMessages({ messages }: StatusMessagesProps): JSX.Element;
export {};
