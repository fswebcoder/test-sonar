export const formatDate = (date: Date, includeTime: boolean = false) => {
    const year = date.getFullYear();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const dateFormatted = `${year}-${month}-${day}`;

    if (includeTime) {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${dateFormatted} ${hours}:${minutes}`;
    }

    return dateFormatted;
}