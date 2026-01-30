import { authProvider } from "./auth/auth.provider";
import { commonProvider } from "./common/common.provider";
import { atomicAbsorptionProvider } from "./lims/analysis/atomic-absorption.provider";
import { moistureDeterminationProvider } from "./lims/analysis/moisture-determination.provider";
import { leachwellProvider } from "./lims/analysis/leachwell.provider";
import { xrfProvider } from "./lims/analysis/xrf.provider";
import { samplesProvider } from "./lims/management/samples.provider";
import { limsProvide } from "./lims/samples/samples.provide";
import { provideDore } from "./lims/management/dore.provider";
import { miningTitlesProvider } from "./suppliers/mining-titles.provider";
import { provideDoreReceptions } from "./lims/receptions/dore-receptions.provider";
import { quarteringsReceptionsProvider } from "./lims/receptions/quarterings-receptions.provider";
import { defaultAnalysisProvider } from "./lims/analysis/default-analysis.provider";
import { retallaProvider } from "./lims/analysis/retalla.provider";
import { ovenProvider } from "./lims/analysis/oven.provider";
import { laboratoryReceptionProvider } from "./lims/receptions/laboratory-receptions.provider";
import { suppliersProvider } from "./suppliers/suppliers.provider";
import { rolesProvider } from "./admin/roles/roles.provider";
import { usersProvider } from "./admin/users/users.provider";
import furnaceProvider from "./lims/furnaces/furnace.provider";
import fireAssayProvider from "./lims/analysis/fire-assay.provider";
import currentShiftProvider from "./plant/shift/current-shift.provider";
import millingManagementProvider from "./plant/milling/milling-management.provider";
import shiftConfigProvider from "./plant/shift/shift-config.provider";
import { sampleTypeProvider } from "./lims/sample-types/sample-types.provider";
import sampleSendingProvider from '@core/providers/lims/receptions/sample-sending.provider';
import pendingReceptionsProvider from "./lims/receptions/pending-receptions.provider";
import vehiclesProvider from "./scale/vehicles.provider";
import driversProvider from "./scale/drivers.provider";
import observersProvider from "./scale/observers.provider";
import materialTypesProvider from "./scale/material-types.provider";
import ordersProvider from "./scale/orders.provider";
import weightRegisterProvider from "./scale/weight-register.provider";
import scaleDashboardProvider from "./scale/dashboard.provider";
import { socketModuleProvider } from "./socket-module/socket-module.provider";
import { sampleScaleProvider } from "./lims/sample-scale/sample-scale.provider";
import bigBagsProvider from "./plant/drying/big-bags.provider";
import weighingOrdersProvider from "./suppliers/weighing-orders.provider";
import supplierDashboardProvider from "./suppliers/supplier-dashboard.provider";
import { minesAdminProvider } from "./suppliers/admin/mines/mines-admin.provider";
import { supplierContactsProvider } from "./suppliers/notifications/supplier-contacts.provider";
import { supplierNotificationConfigsProvider } from "./suppliers/notifications/supplier-notification-configs.provider";

export const ALL_REPOSITORIES = [
    authProvider(),
    commonProvider(),
    atomicAbsorptionProvider(),
    moistureDeterminationProvider(),
    leachwellProvider(),
    xrfProvider(),
    limsProvide(),
    samplesProvider(),
    provideDore(),
    miningTitlesProvider(),
    provideDoreReceptions(),
    quarteringsReceptionsProvider(),
    defaultAnalysisProvider(),
    retallaProvider(),
    ovenProvider(),
    laboratoryReceptionProvider(),
    suppliersProvider(),
    rolesProvider(),
    usersProvider(),
    furnaceProvider(),
    fireAssayProvider(),
    currentShiftProvider(),
    millingManagementProvider(),
    shiftConfigProvider(),
    sampleTypeProvider(),
    sampleSendingProvider(),
    pendingReceptionsProvider(),
    vehiclesProvider(),
    driversProvider(),
    observersProvider(),
    materialTypesProvider(),
    ordersProvider(),
    weightRegisterProvider(),
    scaleDashboardProvider(),
    socketModuleProvider(),
    sampleScaleProvider(),
    bigBagsProvider(),
    weighingOrdersProvider(),
    supplierDashboardProvider(),
    minesAdminProvider(),
    supplierContactsProvider(),
    supplierNotificationConfigsProvider()
];
