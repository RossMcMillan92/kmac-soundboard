import React, { Component } from "react"
import AudioRenderer from "./audioRenderer"
import ImageButton from "./imageButton"
import KmacFace from "./kmacFace"
import { sendClickEvent } from "../modules/tracking"

class KmacButton extends Component {
  state = { shouldPlay: false }

  componentWillUpdate = nextProps => {
    if (!this.props.shouldPlay && nextProps.shouldPlay) this.triggerPlay()
  }

  triggerPlay = () => {
    if (this.state.shouldPlay) return
    sendClickEvent(this.props.description)
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
          <ImageButton
            className={isPlaying ? "is-playing" : ""}
            onClick={this.triggerPlay}
            textClassName={isLoading ? "is-loading" : ""}
            renderImage={() => <KmacFace volume={volume} />}
          >
            {this.props.description}
          </ImageButton>
        )}
      />
    )
  }
}

export default KmacButton
