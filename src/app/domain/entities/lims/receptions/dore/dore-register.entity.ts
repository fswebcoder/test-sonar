export interface IDoreRegisterEntity {
    receivedWeight: number;
    observation: string;
    image: {
        format: "image/jpeg" | "image/png" | "image/jpg" | "image/webp";
        base64: string;
    }
}