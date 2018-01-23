import React, { Component } from "react"
import { hot } from "react-hot-loader"
import KmacButton from "./components/kmacButton"
import samples from "./utils/samples"
import getAbsolutePath from "./modules/getAbsolutePath"
import isPhoneGap from "./modules/isPhoneGap"
import konamiListener from "./modules/konamiListener"

const absolutePath = getAbsolutePath()
const getSoundURL = path =>
  isPhoneGap || true
    ? `${absolutePath}${path}`
    : `https://raw.githubusercontent.com/RossMcMillan92/kmac-soundboard/master/src/static/${path}`

import EasterEggUrl from "static/videos/easter-v8.webm"
const FullScreenVideoPlayer = ({ onClick, onEnded, play, src }) => (
  <div
    onClick={onClick}
    className={`full-screen-video ${onClick ? "" : "u-is-hidden"} ${play ? "" : "u-is-invisible"}`}
  >
    <video className="full-screen-video__video" src={play ? src : null} autoPlay={play} onEnded={onEnded} />
  </div>
)

class App extends Component {
  state = { currentKeyCodeTriggered: null, easterEggIsPlaying: false }

  componentWillMount = () => {
    this.audioContext = new AudioContext()
  }

  componentDidMount = () => {
    this.addEventListeners()
  }

  componentWillUnmount = () => {
    this.removeEventListeners()
  }

  maybePlayFromKeyCode = e => {
    if (this.state.currentKeyCodeTriggered) return
    this.setState({ currentKeyCodeTriggered: e.keyCode })
    setTimeout(() => this.setState({ currentKeyCodeTriggered: null }), 100)
  }

  addEventListeners = () => {
    document.body.addEventListener("keypress", this.maybePlayFromKeyCode)
  }

  removeEventListeners = () => {
    document.body.removeEventListener("keypress", this.maybePlayFromKeyCode)
  }

  onClick = e => {
    this.startEasterEgg()
  }

  startEasterEgg = () => {
    this.setState({ easterEggIsPlaying: true })
  }

  onEasterEggEnd = () => {
    this.setState({ easterEggIsPlaying: false })
    this.maybePlayFromKeyCode({ keyCode: 105 })
  }

  renderButtons = () =>
    samples.map(({ description, url }, index) => {
      const isAlphabeticalKeycode = 97 + index < 123
      const keyCode = isAlphabeticalKeycode ? 97 + index : 999
      return (
        <div className="grid__item grid__item--one-half grid__item--full@mobile u-flex-row u-mb1" key={description}>
          <KmacButton
            src={getSoundURL(url)}
            description={`${description}`}
            audioContext={this.audioContext}
            shouldPlay={keyCode === this.state.currentKeyCodeTriggered}
          />
        </div>
      )
    })

  render = () => (
    <div className="App">
      <FullScreenVideoPlayer
        onClick={this.onClick}
        src={EasterEggUrl}
        play={this.state.easterEggIsPlaying}
        onEnded={this.onEasterEggEnd}
      />
      <div className="group-capped group-spacing-x">
        <h1 className="App-title">Kmac2021</h1>
        <div className="grid">{this.renderButtons()}</div>
      </div>
    </div>
  )
}

export default hot(module)(App)
