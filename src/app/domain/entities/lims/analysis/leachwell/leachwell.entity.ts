
export interface ILeachwellEntity {
    endDateTime: {
        value: string;
        unit: string;
    };
    realEndDateTime: {
        value: string;
        unit: string;
    };
    time: {
        value: number;
        label: string;
    };
    sample: {
        id: string;
        code: string;
    };
}