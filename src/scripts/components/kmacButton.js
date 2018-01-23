import React, { Component } from 'react'
import AudioRenderer from './audioRenderer'
import FaceButton from './faceButton'
import KmacFace from './kmacFace'

class KmacButton extends Component {
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
            className={isPlaying ? 'is-playing' : ''}
            onClick={this.triggerPlay}
            textClassName={isLoading ? 'is-loading' : ''}
            renderImage={() => <KmacFace volume={volume} />}
          >
            {this.props.description}
          </FaceButton>
        )}
      />
    )
  }
}

export default KmacButton
