import { IOptionValue } from "@/shared/interfaces/option-value.interface";

export interface ISuppliersEntity{
    name:                          IOptionValue ;
    documentTypeId:                IOptionValue ;
    documentNumber:                IOptionValue ;
    verificationDigit:             IOptionValue ;
    shortName:                     IOptionValue ;
    isActive:                      IOptionValue ;
    refiningDiscountConcentrate:   IOptionValue ;
    refiningDiscountMineral:       IOptionValue ;
    goldProfitMarginConcentrate:   IOptionValue ;
    goldProfitMarginDore:          IOptionValue ;
    silverProfitMarginConcentrate: IOptionValue ;
    silverProfitMarginDore:        IOptionValue ;
    maxAdvanceFixingsGoldGrams:    IOptionValue ;
    maxAdvanceFixingsSilverGrams:  IOptionValue ;
    withholdingPercentage:         IOptionValue ;
    concentrateRecoveryPercentage: IOptionValue ;
    mineralRecoveryPercentage:     IOptionValue ;
    royaltyPercentage:             IOptionValue ;
    labRecovery:                   IOptionValue ;
    legalRepresentative:           IOptionValue ;
}