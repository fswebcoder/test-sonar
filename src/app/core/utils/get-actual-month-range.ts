export const getActualMonthRange = () => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date()
    return {
        startDate: firstDay,
        endDate: lastDay
    };
};
