export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function relativeTimeLabel(secondsAgo: number): string {
  if (secondsAgo < 60) return `${secondsAgo} seconds ago`;
  const mins = Math.floor(secondsAgo / 60);
  if (mins < 60) return `${mins} minute${mins === 1 ? "" : "s"} ago`;
  const hours = Math.floor(mins / 60);
  return `${hours} hour${hours === 1 ? "" : "s"} ago`;
}
