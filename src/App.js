import React, { Component } from "react"
import AudioRenderer from "./audioRenderer"
import FaceButton from "./faceButton"
import KmacFace from "./kmacFace"
import samples from "./samples"
import "./App.css"

class AudioButton extends Component {
  state = { shouldPlay: false }

  componentWillUpdate = nextProps => {
    if (!this.props.shouldPlay && nextProps.shouldPlay) this.triggerPlay()
  }

  triggerPlay = () => {
    if (this.state.shouldPlay) return
    this.setState({ shouldPlay: true })
    requestAnimationFrame(() => this.setState({ shouldPlay: false }))
  }

  render = () => {
    return (
      <AudioRenderer
        audioContext={this.props.audioContext}
        src={this.props.src}
        shouldPlay={this.state.shouldPlay}
        render={({ isLoading, isPlaying, volume }) => (
          <FaceButton
            className={isPlaying ? "is-playing" : ""}
            onClick={this.triggerPlay}
            textClassName={isLoading ? "is-loading" : ""}
            renderImage={() => <KmacFace volume={volume} />}
          >
            {this.props.description}
          </FaceButton>
        )}
      />
    )
  }
}

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
          <AudioButton
            src={url}
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

export default App
