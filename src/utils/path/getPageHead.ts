export function getPageHead(pathName: string) {
  if (pathName) {
    const segments = pathName.split("/");
    const lastSegment = segments[segments.length - 1];

    const words = lastSegment.includes("-")
      ? lastSegment.split("-")
      : [lastSegment];

    return words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
  return "Title";
}
