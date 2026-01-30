import { createSelector } from "@ngrx/store";
import { CommonState } from "@/store/models/common/common.model";
import { StoreState } from '../../store.state';

export const selectCommonState = (state: StoreState) => state.common;

export const selectCommonDepartments = createSelector(
    selectCommonState,
    (state: CommonState) => state.departments
);

export const selectCommonCities = createSelector(
    selectCommonState,
    (state: CommonState) => state.cities
);

export const selectCommonDoreSampleTypes = createSelector(
    selectCommonState,
    (state: CommonState) => state.doreSampleTypes
);

export const selectCommonPrinters = createSelector(
    selectCommonState,
    (state: CommonState) => state.printers
);

export const selectCommonDocumentTypes = createSelector(
    selectCommonState,
    (state: CommonState) => state.documentTypes
);

export const selectCommonRoles = createSelector(
    selectCommonState,
    (state: CommonState) => state.roles
);


export const getRolActive = createSelector(
    selectCommonState,
    (state: CommonState) => state.roles
);

export const getPersonnelPositions = createSelector(
    selectCommonState,
    (state: CommonState) => state.personnelPositions
);


export const getPersonnel = createSelector(
    selectCommonState,
    (state: CommonState) => state.personnel
);

export const getShiftsConfig = createSelector(
    selectCommonState,
    (state: CommonState) => state.shiftsConfig
);

export const getPumps = createSelector(
    selectCommonState,
    (state: CommonState) => state.pumps
);

export const getAnalysisTypes = createSelector(
    selectCommonState,
    (state: CommonState) => state.analysisTypes
);

export const getSampleTypes = createSelector(
    selectCommonState,
    (state: CommonState) => state.sampleTypes
);

export const selectCommonSampleTypes = createSelector(
    selectCommonState,
    (state: CommonState) => state.sampleTypes
);

export const getSuppliers = createSelector(
    selectCommonState,
    (state: CommonState) => state.suppliers
);

export const getVehicleTypes = createSelector(
    selectCommonState,
    (state: CommonState) => state.vehicleTypes
);

export const getMaterialTypes = createSelector(
    selectCommonState,
    (state: CommonState) => state.materialTypes
);

export const getStorageZones = createSelector(
    selectCommonState,
    (state: CommonState) => state.storageZones
);

export const getDrivers = createSelector(
    selectCommonState,
    (state: CommonState) => state.drivers
);

export const getVehicles = createSelector(
    selectCommonState,
    (state: CommonState) => state.vehicles
);

export const getMills = createSelector(
    selectCommonState,
    (state: CommonState) => state.mills
);

export const getBigBagTypes = createSelector(
    selectCommonState,
    (state: CommonState) => state.bigBagTypes
);