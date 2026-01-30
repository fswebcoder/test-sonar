
export interface ILaboratoryReceptionParams {
  sampleCode: string
  requiredAnalyses: IRequiredAnalysis[]
}

export interface IRequiredAnalysis {
  analysisId: string
  quantity: number
}
