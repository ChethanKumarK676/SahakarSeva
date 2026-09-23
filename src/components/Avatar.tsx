/* Avatar
 * Procedural avatar — a coloured circle with the worker's initials. No
 * external image dependencies, so the build is self-contained. The hue
 * comes from the worker record so the same person always has the same
 * colour across screens.
 */
export function Avatar({
  name,
  hue,
  size = 44
}: {
  name: string;
  hue: number;
  size?: number;
}) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div
      className="rounded-full flex items-center justify-center font-bold text-white shrink-0"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, hsl(${hue},55%,42%), hsl(${(hue + 30) % 360},65%,32%))`,
        fontSize: size * 0.36
      }}
    >
      {initials}
    </div>
  );
}
