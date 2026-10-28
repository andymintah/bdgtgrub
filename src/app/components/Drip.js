// Ketchup drips along the bottom edge of the shopfront.
// [centre x, half width, drip length] in a 1440 x 64 box, cropped to the
// viewport width (slice) so the drips keep their shape on any screen.
const DRIPS = [
  [90, 16, 34], [250, 22, 52], [330, 12, 26], [520, 18, 44], [700, 26, 58],
  [790, 12, 30], [960, 20, 46], [1120, 14, 36], [1270, 24, 54], [1390, 12, 28],
];

const BAND = 14;

const dripPath = ([x, w, len]) => {
  const r = w * 0.55;
  const bottom = BAND + len;
  return [
    `M${x - w * 1.6} ${BAND}`,
    `C${x - w * 0.6} ${BAND} ${x - r} ${BAND + 4} ${x - r} ${BAND + 12}`,
    `L${x - r} ${bottom - r}`,
    `A${r} ${r} 0 0 0 ${x + r} ${bottom - r}`,
    `L${x + r} ${BAND + 12}`,
    `C${x + r} ${BAND + 4} ${x + w * 0.6} ${BAND} ${x + w * 1.6} ${BAND}`,
    'Z',
  ].join(' ');
};

export default function Drip() {
  return (
    <svg
      viewBox="0 0 1440 72"
      preserveAspectRatio="xMidYMin slice"
      className="block w-full h-[72px] -mt-px"
      aria-hidden="true"
    >
      <g fill="var(--color-ketchup)">
        <rect x="0" y="0" width="1440" height={BAND + 1} />
        {DRIPS.map((drip) => (
          <path key={drip[0]} d={dripPath(drip)} />
        ))}
      </g>
    </svg>
  );
}
