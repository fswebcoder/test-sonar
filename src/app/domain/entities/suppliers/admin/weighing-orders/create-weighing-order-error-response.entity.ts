import IValueLabel from "@/shared/interfaces/value-label.interface";
import { HttpErrorResponse } from "@angular/common/http";

export interface ICreateWeighingOrderErrorResponse extends HttpErrorResponse{
    error: {
        data: IValueLabel<string>[];
    };
}