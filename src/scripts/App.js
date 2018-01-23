import React, { Component } from "react"
import { hot } from "react-hot-loader"
import KmacButton from "./components/kmacButton"
import samples from "./utils/samples"
import getAbsolutePath from "./modules/getAbsolutePath"
import isPhoneGap from "./modules/isPhoneGap"

const absolutePath = getAbsolutePath()
const getSoundURL = path =>
  isPhoneGap || true
    ? `${absolutePath}${path}`
    : `https://raw.githubusercontent.com/RossMcMillan92/kmac-soundboard/master/src/static/${path}`

class App extends Component {
  state = { currentKeyCodeTriggered: null }

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

  renderButtons = () =>
    samples.map(({ description, url }, index) => {
      const keyCode = 97 + index < 123 ? 97 + index : 999
      return (
        <div
          className="grid__item grid__item--one-half grid__item--full@mobile u-flex-row u-mb1"
          key={description}
        >
          <KmacButton
            src={getSoundURL(url)}
            keyCodeTrigger={keyCode}
            description={`${description}`}
            audioContext={this.audioContext}
            shouldPlay={keyCode === this.state.currentKeyCodeTriggered}
          />
        </div>
      )
    })

  render = () => {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Kmac2021</h1>
        </header>
        <div className="group-capped group-spacing-x">
          <div className="grid">{this.renderButtons()}</div>
        </div>
      </div>
    )
  }
}

export default hot(module)(App)
