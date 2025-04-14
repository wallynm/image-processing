import React from 'react';
export type ProcessingSummary = {
    total: number;
    processed: number;
    skipped: number;
    errors: number;
};
type SummaryViewProps = {
    summary: ProcessingSummary;
};
export declare function SummaryView({ summary }: SummaryViewProps): React.JSX.Element;
export {};
