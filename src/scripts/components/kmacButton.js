import React from "react"
import ImageButton from "./imageButton"
import KmacFace from "./kmacFace"
import { getBufferFromURL, playSound, stopSource } from "../utils/audio"

const useAnimationFrame = (runningByDefault = true) => {
  const [isRunning, setIsRunning] = React.useState(runningByDefault)
  const [t, updateT] = React.useState(0)
  let raf

  React.useLayoutEffect(() => {
    const loop = t => {
      console.log("loop")
      updateT(t)
      raf = window.requestAnimationFrame(loop)
    }

    if (raf) window.cancelAnimationFrame(raf)
    if (isRunning) raf = window.requestAnimationFrame(loop)
    return () => {
      if (raf) window.cancelAnimationFrame(raf)
    }
  }, [isRunning])

  return [t, () => setIsRunning(true), () => setIsRunning(false)]
}

const getAudioAnalyser = audioContext => {
  const analyser = audioContext.createScriptProcessor(1024, 1, 1)
  const volume = []

  const onAudioProcess = e => {
    for (let channelIndex = 0, len = e.outputBuffer.numberOfChannels; channelIndex < len; channelIndex++) {
      const output = e.outputBuffer.getChannelData(channelIndex)
      const input = e.inputBuffer.getChannelData(channelIndex)
      volume[channelIndex] = 0

      let maxVolume = 0
      for (let frequencyIndex = 0, len2 = input.length; frequencyIndex < len2; frequencyIndex++) {
        output[frequencyIndex] = input[frequencyIndex] //prevent feedback and we only need the input data
        maxVolume = input[frequencyIndex] > maxVolume ? input[frequencyIndex] : maxVolume
      }
      volume[channelIndex] = maxVolume
    }
  }

  if (!analyser.onaudioprocess) analyser.onaudioprocess = onAudioProcess

  return {
    analyser,
    getVolume: () => volume[0]
  }
}

const useAudioAnalyser = audioContext => {
  const [analyser, setAnalyser] = React.useState({})

  React.useEffect(() => {
    const analyser = getAudioAnalyser(audioContext)
    setAnalyser(analyser)
  }, [])

  return [analyser.analyser, analyser.getVolume ? analyser.getVolume : () => 0]
}

const useAudioVisualiser = ({ audioContext, src }) => {
  const [sources, setSources] = React.useState([])
  const [buffer, setBuffer] = React.useState(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [analyser, getVolume] = useAudioAnalyser(audioContext)
  const [t, startRaf, pauseRaf] = useAnimationFrame(false)
  const [playCount, setPlayCount] = React.useState(0)
  const [volume, setVolume] = React.useState(null)

  React.useEffect(() => {
    if (!analyser || playCount === 0) return
    const loadBuffer = (shouldPlay = true) => {
      setIsLoading(true)
      getBufferFromURL(audioContext, src)
        .map(playSound(audioContext, analyser))
        .fork(
          e => console.log(e),
          buffer => {
            setBuffer(buffer)
            setIsLoading(false)
            if (shouldPlay) playBuffer(buffer)
          }
        )
    }

    const playBuffer = buffer => {
      console.log("buffer started!")
      const source = buffer.runIO()
      startRaf()
      setVolume(null)
      setIsPlaying(true)
      setSources([...sources, source])
      source.onended = () => {
        setIsPlaying(false)
        pauseRaf()
      }
    }

    const loadAndPlayCurrentBuffer = () => {
      if (buffer) {
        playBuffer(buffer)
        return
      }
      loadBuffer()
    }

    loadAndPlayCurrentBuffer()
  }, [analyser, playCount])

  const stop = () => {
    pauseRaf()
    sources.map(stopSource)
    setIsPlaying(false)
    setVolume(0)
  }

  return {
    volume: volume != null ? volume : getVolume(),
    play: () => setPlayCount(playCount + 1),
    stop,
    isLoading,
    isPlaying
  }
}

const KmacButton = ({ audioContext, description, src }) => {
  const { isLoading, isPlaying, play, stop, volume } = useAudioVisualiser({
    audioContext,
    src
  })

  return (
    <React.Fragment>
      <ImageButton
        className={isPlaying ? "is-playing" : ""}
        onClick={play}
        textClassName={isLoading ? "is-loading" : ""}
        renderImage={() => <KmacFace volume={volume} />}
      >
        {description}
      </ImageButton>
      <button onClick={stop}>x</button>
    </React.Fragment>
  )
}

export default KmacButton
