import { css as h, LitElement as p, html as u, svg as n } from 'https://www.unpkg.com/lit@latest?module';
import { property as l, customElement as m } from "https://www.unpkg.com/lit@latest/decorators.js?module";
var g = Object.defineProperty, d = Object.getOwnPropertyDescriptor, f = (e, s, i, r) => {
  for (var t = r > 1 ? void 0 : r ? d(s, i) : s, o = e.length - 1, c; o >= 0; o--)
    (c = e[o]) && (t = (r ? c(s, i, t) : c(t)) || t);
  return r && t && g(s, i, t), t;
};
const v = h`
  .background {
    fill: var(--background-color, #000000);
  }

  text {
    fill: var(--font-color, #ffffff);
    font-size: var(--font-size, 26px);
    stroke-width: var(--stroke-width, 1.2px);
    stroke: var(--stroke-color, #eeeeee);
  }
`, y = h`
  :host {
    display: block;
  }

  svg {
    height: 100%;
    width: 100%;
  }

  text {
    fill: #ffffff;
    dominant-baseline: hanging;
    font-family: monospace;
    font-size: 24px;
  }
`, b = (e) => n`
  <text id="chars">${e}</text>
`, x = (e, s = 0) => {
    const i = 360 / e, r = [];
    let t = s;
    for (let o = 0; o < e; o++)
      t += i, r.push(n`
      <use
        href="#chars"
        transform="rotate(${t}, 0, 0)">
      </use>
    `);
    return n`
    <g
      id="motif"
      transform="translate(50, 50)">
        ${r}
    </g>
  `;
  }, w = () => n`
  <clipPath id="rect-clip">
    <rect width="200" height="200"></rect>
  </clipPath>
`, P = () => n`
  <g clip-path="url(#rect-clip)">
    <use transform="translate(0, 0)" href="#motif"></use>
    <use transform="translate(0, 100)" href="#motif"></use>
    <use transform="translate(100, -50)" href="#motif"></use>
    <use transform="translate(100, 50)" href="#motif"></use>
    <use transform="translate(100, 150)" href="#motif"></use>
  </g>
`, O = () => n`
  <pattern
    id="repeat-pattern"
    x="-10"
    y="-10"
    width="200"
    height="200"
    patternUnits="userSpaceOnUse">
    ${P()}
  </pattern>
`;
let a = class extends p {
  constructor() {
    super(...arguments), this.chars = "T", this.numPrints = 7, this.rotationOffset = 0;
  }
  render() {
    return u`
      <svg>
        <defs>
          ${w()} ${b(this.chars)}
          ${x(this.numPrints, this.rotationOffset)}
          ${O()}
        </defs>

        <rect class="background" height="100%" width="100%"></rect>
        <rect fill="url(#repeat-pattern)" height="100%" width="100%"></rect>
      </svg>
    `;
  }
};
a.styles = [y, v];
f([
  l({ type: String })
], a.prototype, "chars", 2);
f([
  l({ type: Number, attribute: "num-prints" })
], a.prototype, "numPrints", 2);
f([
  l({
    type: Number,
    attribute: "rotation-offset"
  })
], a.prototype, "rotationOffset", 2);
a = f([
  m("fun-background")
], a);
export {
  a as MyElement
};
