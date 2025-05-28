
export function shortenDistance(distance: string) {
  return distance
    .replace("about ", "")
    .replace("less than a minute ago", "just now")
    .replace(" minutes", "m")
    .replace(" minute", "m")
    .replace(" hours", "h")
    .replace(" hour", "h")
    .replace(" days", "d")
    .replace(" day", "d")
    .replace(" months", "mo")
    .replace(" month", "mo")
    .replace(" years", "y")
    .replace(" year", "y")
    
}