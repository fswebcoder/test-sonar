export default function parseUTCTime(time: string): Date {
  const [hh, mm] = time.split(":").map(Number);
  const [year, month, day] = [new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate()];
  return new Date(Date.UTC(year, month, day, hh, mm));
}