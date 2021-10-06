import { parseISO, format } from "date-fns";

export default function Date({ dateString }: { dateString?: string | undefined }) {
  if (dateString === undefined) return <span>unknown</span>;
  const date = parseISO(dateString);
  return <time dateTime={dateString}>{format(date, "d LLLL yyyy")}</time>;
}
