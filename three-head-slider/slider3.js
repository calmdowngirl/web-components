const template = document.createElement('template')
template.innerHTML = `
<style>
.wrapper {
  width: 100%;
  display: flex;
  flex-direction: row;
}

.wrapper .text-label {
  width: 50px;
  height: fit-content;
  font-size: 11px;
  line-break: normal;
  word-break: keep-all;
  line-height: 110%;
  color: gray;
  border-radius: 5%;
  transform: translate(28px, 60px);
}

.middle {
  position: relative;
  width: 70%;
  max-width: 500px;
  margin: 4rem 0 1rem 0;
}

.slider {
  position: relative;
  z-index: 1;
  height: 10px;
  margin: 0 0.5rem 0 0.75rem;
}
.slider > .track {
  position: absolute;
  z-index: 1;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  border-radius: 5px;
  background-color: #c6c6c6;
}

.slider > .rangeLower {
  position: absolute;
  z-index: 2;
  top: 0;
  bottom: 0;
  border-radius: 5px 0 0 5px;
  background-image: linear-gradient(
    to right,
    red,
    orange,
    yellow,
    rgb(0, 255, 0)
  );
}

.slider > .rangeUpper {
  position: absolute;
  z-index: 2;
  top: 0;
  bottom: 0;
  border-radius: 0 5px 5px 0;
  background-image: linear-gradient(
    to left,
    red,
    orange,
    yellow,
    rgb(0, 255, 0)
  );
}

.slider > .thumb {
  position: absolute;
  cursor: grab;
  z-index: 3;
  width: 35px;
  height: 35px;
  top: -22px;
  border-radius: 50% 50% 0;
  color: #fff;
  background-color: #7d7d7d;
  transform: translate(-22px, -20px) rotate(45deg);
  display: flex;
  justify-content: center;
}
.slider > .thumb.left {
  transform: translate(-17px, 35px) rotate(-135deg);
}
.slider > .thumb.right {
  transform: translate(17px, 35px) rotate(-135deg);
}
.slider > .thumb.centre {
  transform: translate(18px, -18px) rotate(45deg);
}

.thumb-label,
.thumb-label-mid {
  padding-top: .5rem;
  transform: rotate(135deg);
  font-family: Roboto, Helvetica Neue, sans-serif;
  font-size: 10px;
  font-weight: 900;
  display: inline-block;
}
.thumb-label-mid {
  transform: rotate(-45deg);
}

.lock {
  position: absolute;
  transform: translateX(30px);
  margin: 0;
}
.check {
  margin-top: 1rem;
}

input[type='range'] {
  position: absolute;
  pointer-events: all;
  // -webkit-appearance: none;
  cursor: grab;
  top: -28px;
  z-index: 200;
  height: 10px;
  width: 100%;
  opacity: 0;
}
input[type='range']::-webkit-slider-thumb {
  cursor: grab;
  pointer-events: all;
  top: -32px;
  width: 30px;
  height: 30px;
  border-radius: 0;
  border: none;
  // -webkit-appearance: none;
}

#inputLeft,
#inputRight {
  transform: translateY(52px);
}
</style>

<div class="wrapper">
  <div class="lock">
    <input
      type="checkbox"
      class="check"
      id="lock"
    />
    <label for="lock">lock</label>
  </div>

  <div class="text-label" id="text-label-min">0</div>
  <div class="middle">
    <div class="multi-range-slider">
      <input
        type="range"
        id="inputLeft"
        step="1"
        min="0"
        max="100"
        value="0"
        onchange="setLeftValue()"
        oninput="setLeftValue()"
      />
      <input
        type="range"
        id="inputCentre"
        style="z-index: 200; left: 0%; right: 0%; width: 100%;"
        min="0"
        max="100"
        value="50"
        step="1"
        onchange="setCentreValue()"
        oninput="setCentreValue()"
      />
      <input
        type="range"
        id="inputRight"
        step="1"
        min="0"
        max="100"
        value="100"
        onchange="setRightValue()"
        oninput="setRightValue()"
      />
      <div class="slider">
        <div class="track"></div>
        <div
          id="rangeUpper"
          class="rangeUpper"
          style="left: 50%; right: 0%;"
        ></div>
        <div
          id="rangeLower"
          class="rangeLower"
          style="left: 0%; right: 50%;"
        ></div>
        <div
          id="thumbLeft"
          class="thumb left"
          style="left: 0%;"
          onmousedown="bringForward('left', true)"
          onmouseout="bringForward('left', false)"
        >
          <span class="thumb-label">0</span>
        </div>
        <div
          id="thumbRight"
          class="thumb right"
          style="right: 0%;"
          onmousedown="bringForward('right', true)"
          onmouseout="bringForward('right', false)"
        >
          <span class="thumb-label">100</span>
        </div>
        <div
          id="thumbCentre"
          class="thumb centre"
          style="right: 50%;"
          onmousedown="bringForward('mid', true)"
          onmouseout="bringForward('mid', false)"
        >
          <span class="thumb-label-mid">50</span>
        </div>
      </div>
    </div>
  </div>
  <div class="text-label" id="text-label-max">
  </div>
</div>
`

class ThreeHeadSlider extends HTMLElement {
  static #hostWidth
  static #hostMin
  static #hostMax
  static #hostUom
  static #mid

  constructor() {
    super()
    const shadow = this.attachShadow({ mode: 'open' })
    shadow.append(template.content.cloneNode(true))

    ThreeHeadSlider.#hostWidth = (() => {
      if (shadow.host.hasAttribute('width'))
        return shadow.host.getAttribute('width')
      else return '100vw'
    })()
    ThreeHeadSlider.#hostMin = (() => {
      if (shadow.host.hasAttribute('min'))
        return shadow.host.getAttribute('min')
      else return '0'
    })()
    ThreeHeadSlider.#hostMax = (() => {
      if (shadow.host.hasAttribute('max'))
        return shadow.host.getAttribute('max')
      else return '100'
    })()
    ThreeHeadSlider.#mid = (() => {
      return Math.round((ThreeHeadSlider.#hostMax - ThreeHeadSlider.#hostMin) / 2)
    })()
    ThreeHeadSlider.#hostUom = (() => {
      if (shadow.host.hasAttribute('uom'))
        return shadow.host.getAttribute('uom')
      else return '%'
    })()

    shadow.querySelector('.wrapper').style.width = ThreeHeadSlider.#hostWidth
    shadow.querySelector('#text-label-max').innerHTML = `
        ${ThreeHeadSlider.#hostMax}${ThreeHeadSlider.#hostUom}
      `

    shadow.querySelectorAll('input[type="range"]')
      .forEach(elem => elem.setAttribute('min', ThreeHeadSlider.#hostMin))
    shadow.querySelector('#text-label-min').innerHTML = ThreeHeadSlider.#hostMin
    shadow.querySelector('#thumbLeft>.thumb-label').innerHTML =
      ThreeHeadSlider.#hostMin
    shadow.querySelectorAll('input[type="range"]')
      .forEach(elem => elem.setAttribute('max', ThreeHeadSlider.#hostMax))
    shadow.querySelector('#thumbRight>.thumb-label').innerHTML =
      ThreeHeadSlider.#hostMax
    shadow.querySelector('#thumbCentre>.thumb-label-mid').innerHTML =
      ThreeHeadSlider.#mid

    shadow.querySelector('#inputLeft').value = ThreeHeadSlider.#hostMin
    shadow.querySelector('#inputCentre').value = ThreeHeadSlider.#mid
    shadow.querySelector('#inputRight').value = ThreeHeadSlider.#hostMax
  }

  static get hostWidth() { return ThreeHeadSlider.#hostWidth }
  static get hostUom() { return ThreeHeadSlider.#hostUom }
  static get range() {
    return {
      min: ThreeHeadSlider.#hostMin,
      mid: ThreeHeadSlider.#mid,
      max: ThreeHeadSlider.#hostMax
    }
  }
}

customElements.define("three-head-slider", ThreeHeadSlider)

const slider = document.querySelector('three-head-slider').shadowRoot
const inputLeft = slider.querySelector('#inputLeft')
const inputRight = slider.querySelector('#inputRight')
const inputCentre = slider.querySelector('#inputCentre')
const thumbLeft = slider.querySelector('#thumbLeft')
const thumbRight = slider.querySelector('#thumbRight')
const thumbCentre = slider.querySelector('#thumbCentre')
const rangeLower = slider.querySelector('#rangeLower')
const rangeUpper = slider.querySelector('#rangeUpper')
const lock = slider.querySelector('#lock')
const thumbLeftLabel = slider.querySelector('#thumbLeft .thumb-label')
const thumbCentreLabel = slider.querySelector('#thumbCentre .thumb-label-mid')
const thumbRightLabel = slider.querySelector('#thumbRight .thumb-label')
const min = ThreeHeadSlider.range.min
const max = ThreeHeadSlider.range.max
let range = max - min
let inputMin = ThreeHeadSlider.range.min
let inputMax = ThreeHeadSlider.range.max
let inputMid = ThreeHeadSlider.range.mid

const isLocked = () => lock.checked === true

function setLeftValue() {
  let percent

  inputMin = fencing('min', inputLeft.value)
  thumbLeftLabel.innerHTML = inputMin

  percent = computePercent(inputMin)
  renderLeft(percent)

  if (isLocked()) {
    inputMax = fencing(
      'max',
      inputCentre.value + inputCentre.value - inputMin
    )
    thumbRightLabel.innerHTML = inputMax

    percent = computePercent(inputMax)
    renderRight(percent)

    inputMid = fencing(
      'mid',
      Math.round(inputMin + (inputMax - inputMin) / 2)
    )
    thumbCentreLabel.innerHTML = inputMid
    percent = computePercent(inputMid)

    renderCentre(percent)
  }
}

function setRightValue() {
  let percent

  inputMax = fencing('max', inputRight.value)
  thumbRightLabel.innerHTML = inputMax

  percent = computePercent(inputMax)
  renderRight(percent)

  if (isLocked()) {
    inputMin = fencing(
      'min',
      inputCentre.value - (inputMax - inputCentre.value)
    )
    thumbLeftLabel.innerHTML = inputMin

    percent = computePercent(inputMin)
    renderLeft(percent)

    inputMid = fencing(
      'mid',
      Math.round(inputMin + (inputMax - inputMin) / 2)
    )
    thumbCentreLabel.innerHTML = inputMid
    percent = computePercent(inputMid)
    renderCentre(percent)
  }
}

function setCentreValue() {
  let percent
  const diff = inputRight.value - inputLeft.value

  inputMid = fencing('mid', inputCentre.value)
  thumbCentreLabel.innerHTML = inputMid

  percent = computePercent(inputMid)
  renderCentre(percent)

  if (isLocked()) {
    inputMax = fencing(
      'max',
      Math.min(max, Math.round(inputMid + diff / 2))
    )
    thumbRightLabel.innerHTML = inputMax

    percent = computePercent(inputMax)
    renderRight(percent)

    inputMin = fencing('min', Math.round(inputMid - diff / 2))
    thumbLeftLabel.innerHTML = inputMin

    percent = computePercent(inputMin)
    renderLeft(percent)
  }
}

function renderCentre(percent) {
  thumbCentre.style.right = `${100 - percent}%`
  rangeUpper.style.left = `${percent}%`
  rangeLower.style.right = `${100 - percent}%`
}

function renderRight(percent) {
  thumbRight.style.right = `${100 - percent}%`
  rangeUpper.style.right = `${100 - percent}%`
}

function renderLeft(percent) {
  thumbLeft.style.left = `${percent}%`
  rangeLower.style.left = `${percent}%`
}

function computePercent(value) {
  return ((value - min) / range) * 100
}

const bringForward = (leftMidOrRight) => {
  thumbLeft.style.backgroundColor = ""
  thumbCentre.style.backgroundColor = ""
  thumbRight.style.backgroundColor = ""

  inputLeft.style.zIndex = '200'
  inputCentre.style.zIndex = '200'
  inputRight.style.zIndex = '200'

  switch (leftMidOrRight) {
    case 'left':
      thumbLeft.style.backgroundColor = '#000'
      inputLeft.style.zIndex = '500'
      inputLeft.focus()
      break
    case 'mid':
      thumbCentre.style.backgroundColor = '#000'
      inputCentre.style.zIndex = '500'
      inputCentre.focus()
      break
    case 'right':
      thumbRight.style.backgroundColor = '#000'
      inputRight.style.zIndex = '500'
      inputRight.focus()
      break
    default:
      break
  }
}


function fencing(minMidOrMax, value) {
  switch (minMidOrMax) {
    case 'min':
      value = Math.max(
        min,
        Math.min(
          Math.min(value, parseInt(inputRight.value)),
          parseInt(inputCentre.value)
        )
      )

      inputLeft.value = value.toString()
      thumbLeftLabel.innerHTML = inputLeft.value

      return Number(value)
    case 'mid':
      if (value > parseInt(inputRight.value))
        value = parseInt(inputRight.value)
      if (value < parseInt(inputLeft.value))
        value = parseInt(inputLeft.value)

      inputCentre.value = value.toString()
      thumbCentreLabel.innerHTML = inputCentre.value

      return Number(value)

    case 'max':
      value = Math.min(
        max,
        Math.max(
          Math.max(value, parseInt(inputLeft.value)),
          parseInt(inputCentre.value)
        )
      )

      inputRight.value = value.toString()
      thumbRightLabel.innerHTML = inputRight.value

      return Number(value)

    default:
      return NaN
  }
}
