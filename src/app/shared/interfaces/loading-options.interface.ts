export type LoadingType = 'dots' | 'pulse' | 'wave' | 'circle';

export interface LoadingOptions {
    type?: LoadingType;
    size?: 'small' | 'medium' | 'large';
    color?: string;
    message?: string;
    showMessage?: boolean;
    overlay?: boolean;
    overlayColor?: string;
    fullscreen?: boolean;
}
