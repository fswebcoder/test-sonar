export interface IMoistureDeterminationValueEntity {
  value: string;
  label: string;
}

export interface IMoistureDeterminationResultValueEntity {
  tareWeight: IMoistureDeterminationValueEntity;
  wetWeight: IMoistureDeterminationValueEntity;
  dryWeight: IMoistureDeterminationValueEntity;
  moisture: IMoistureDeterminationValueEntity;
  done: { value: boolean; label: string };
}

export interface IMoistureDeterminationEntity {
  sampleId: string;
  analysisDate: Date;
  resultValue: IMoistureDeterminationResultValueEntity;
}
