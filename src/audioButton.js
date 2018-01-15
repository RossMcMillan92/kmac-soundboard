import React, { Component } from "react"
import { getBufferFromURL, playSound } from "./utils/audio"
import KmacFace from "./kmacFace"

class AudioButton extends Component {
  state = { isLoading: false, isPlaying: false, volume: 0 }

  componentDidMount = () => {
    this.analyser = this.props.audioContext.createScriptProcessor(1024, 1, 1)
    this.analyser.onaudioprocess = this.onAudioProcess
  }

  onAudioProcess = e => {
    var out = e.outputBuffer.getChannelData(0)
    var int = e.inputBuffer.getChannelData(0)
    this.max = 0

    for (var i = 0; i < int.length; i++) {
      out[i] = int[i] //prevent feedback and we only need the input data
      this.max = int[i] > this.max ? int[i] : this.max
    }
  }

  onClick = () => {
    if (this.state.buffer) {
      this.playBuffer(this.props.audioContext, this.analyser)(this.state.buffer)
      return
    }
    this.loadBuffer()
  }

  loadBuffer = () => {
    const { audioContext, soundUrl } = this.props

    this.setState({ isLoading: true })
    getBufferFromURL(audioContext, soundUrl)
      .map(playSound(audioContext, this.analyser))
      .map(buffer => {
        this.setState({ buffer })
        return buffer
      })
      .fork(e => console.log(e), this.playBuffer(audioContext, this.analyser))
  }

  playBuffer = (audioContext, analyser) => buffer => {
    this.setState({ isLoading: false, isPlaying: true })
    const source = buffer.runIO()
    source.onended = () => {
      this.setState({ isPlaying: false })
      source.disconnect(analyser)
      analyser.disconnect(audioContext.destination)
    }
    requestAnimationFrame(this.loop)
  }

  loop = () => {
    this.setState({ volume: this.max })
    if (this.state.isPlaying) requestAnimationFrame(this.loop)
  }

  render() {
    return (
      <button
        className={`audio-button ${
          this.state.isPlaying ? "is-playing" : ""
        } ${this.props.className || ""}`}
        onClick={this.onClick}
      >
        <div className="audio-button__image">
          <KmacFace volume={this.state.volume} />
        </div>
        <div
          className={`audio-button__text ${this.state.isLoading &&
            "is-loading"}`}
        >
          {this.props.description}
        </div>
      </button>
    )
  }
}

export default AudioButton
