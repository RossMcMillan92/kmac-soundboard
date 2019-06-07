import React, { Component } from "react"
import AudioRenderer from "./audioRenderer"
import ImageButton from "./imageButton"
import KmacFace from "./kmacFace"
import { sendClickEvent } from "../modules/tracking"
import { getBufferFromURL, playSound } from "../utils/audio"

const useAudioVisualiser = ({ audioContext, src }) => {
  const [stateVolume, setVolume] = React.useState(0)
  const [isLoading, setIsLoading] = React.useState(false)
  const [buffer, setBuffer] = React.useState(null)
  const [shouldPlay, setShouldPlay] = React.useState(false)
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [stateAF, setStateAF] = React.useState(null)
  let af

  let volume = []
  const getAnalyser = () => {
    let analyser = audioContext.createScriptProcessor(1024, 1, 1)
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

    analyser.onaudioprocess = onAudioProcess

    return analyser
  }

  React.useEffect(() => {
    console.log("isPlaying", isPlaying)
    const loop = () => {
      setVolume(volume[0])
      console.log("isPlaying", isPlaying)
      if (shouldPlay) {
        setStateAF(requestAnimationFrame(loop))
      }
    }

    const loadAndPlayCurrentBuffer = () => {
      if (buffer) {
        playBuffer(buffer)
        return
      }
      loadBuffer()
    }

    const loadBuffer = (shouldPlay = true) => {
      setIsLoading(true)
      getBufferFromURL(audioContext, src)
        .map(playSound(audioContext, getAnalyser()))
        .map(buffer => {
          setBuffer(buffer)
          return buffer
        })
        .fork(
          e => console.log(e),
          buffer => {
            setIsLoading(false)
            if (shouldPlay) playBuffer(buffer)
          }
        )
    }

    const playBuffer = buffer => {
      console.log("buffer started!")
      const source = buffer.runIO()
      source.onended = () => {
        console.log("buffer ended!")
        setIsPlaying(false)
        setShouldPlay(false)
      }
    }

    if (!shouldPlay && isPlaying && stateAF) {
      console.log("stop!")
      setVolume(0)
      setIsPlaying(false)
      setShouldPlay(false)
      cancelAnimationFrame(stateAF)
    }
    if (shouldPlay && isPlaying === false) {
      console.log("play!")
      setIsPlaying(true)
      loop()
      loadAndPlayCurrentBuffer()
    }
    return () => {
      if (!shouldPlay && stateAF) cancelAnimationFrame(stateAF)
    }
  }, [isPlaying, shouldPlay, stateAF])

  return [{ volume: stateVolume, isLoading, isPlaying }, setShouldPlay]
}

const KmacButton = ({ audioContext, description, src }) => {
  const [{ isLoading, isPlaying, volume }, play] = useAudioVisualiser({
    audioContext,
    src
  })

  return (
    <ImageButton
      className={isPlaying ? "is-playing" : ""}
      onClick={() => play(!isPlaying)}
      textClassName={isLoading ? "is-loading" : ""}
      renderImage={() => <KmacFace volume={volume} />}
    >
      {description}
    </ImageButton>
  )
}

export default KmacButton
