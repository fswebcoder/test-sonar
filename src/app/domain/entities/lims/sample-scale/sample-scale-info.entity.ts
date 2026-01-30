export interface ISampleScaleInfo{
    scale: {
        ip: string,
        name: string,
        port: number
    },
    connection: {
        connected:boolean,
        message:string
    }
}