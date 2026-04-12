export const parseDateString = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export function parseDate(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function numberOrInfinity(number: number, dotted: boolean = false) {
  if (number === 0) {
    if (dotted) {
      return <span className="not-italic text-xs align-middle">...</span>;
    } else
      return (
        <span className="rotate-90 inline-block not-italic align-middle">
          8
        </span>
      );
  }

  return number;
}
