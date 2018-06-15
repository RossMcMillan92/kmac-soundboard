import { Component } from 'react'
import { getBufferFromURL, playSound } from '../utils/audio'

const setState = (context, prop) => (value) => {
  context.setState({ [prop]: value })
  return value
}

class AudioRenderer extends Component {
  state = { currentlyPlayingCount: 0, isLoading: false, volume: 0 }

  componentDidMount = () => {
    this.volume = []
    this.analyser = this.props.audioContext.createScriptProcessor(8192, 1, 1)
    this.analyser.onaudioprocess = this.onAudioProcess
    if (this.props.preload === true) this.loadBuffer(false)
  }

  componentWillUpdate = (nextProps) => {
    if (!this.props.shouldPlay && nextProps.shouldPlay) {
      this.loadAndPlayCurrentBuffer()
    }
  }

  onAudioProcess = (e) => {
    for (let i = 0, len = e.outputBuffer.numberOfChannels; i < len; i++) {
      const out = e.outputBuffer.getChannelData(i)
      const int = e.inputBuffer.getChannelData(i)
      this.volume[i] = 0

      let maxVolume = 0
      for (let x = 0, len2 = int.length; x < len2; x++) {
        out[x] = int[x] // prevent feedback and we only need the input data
        maxVolume = int[x] > maxVolume ? int[x] : maxVolume
      }
      this.volume[i] = maxVolume
    }
  }

  loadAndPlayCurrentBuffer = () => {
    if (this.state.buffer) {
      this.playBuffer(this.state.buffer)
      return
    }
    this.loadBuffer()
  }

  loadBuffer = (shouldPlay = true) => {
    const { audioContext, src } = this.props

    setState(this, 'isLoading', true)
    getBufferFromURL(audioContext, src)
      .map(playSound(audioContext, this.analyser))
      .map(setState(this, 'buffer'))
      .fork(
        e => console.log(e),
        (buffer) => {
          setState(this, 'isLoading', false)
          if (shouldPlay) this.playBuffer(buffer)
        }
      )
  }

  playBuffer = (buffer) => {
    this.setState(state => ({
      currentlyPlayingCount: state.currentlyPlayingCount + 1
    }))
    const source = buffer.runIO()
    source.onended = () => {
      const { currentlyPlayingCount } = this.state
      this.setState(state => ({
        currentlyPlayingCount: state.currentlyPlayingCount - 1
      }))
      if (currentlyPlayingCount === 1) return
      source.disconnect(this.analyser)
    }
    requestAnimationFrame(this.loop)
  }

  loop = () => {
    this.setState({ volume: this.volume[0] })
    if (this.state.currentlyPlayingCount) requestAnimationFrame(this.loop)
  }

  render() {
    const { isLoading, currentlyPlayingCount, volume } = this.state

    return this.props.render
      ? this.props.render({
          isLoading,
          isPlaying: currentlyPlayingCount !== 0,
          play: this.playBuffer,
          volume
        })
      : null
  }
}

export default AudioRenderer
