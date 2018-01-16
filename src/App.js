import React, { Component } from "react"
import AudioButton from "./audioButton"
import samples from "./samples"
import "./App.css"

class App extends Component {
  componentWillMount = () => {
    this.audioContext = new AudioContext()
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Kmac2021</h1>
        </header>
        <div className="group-capped group-spacing-x">
          <div className="grid">
            {samples.map(({ description, url }) => (
              <div
                className="grid__item grid__item--one-half grid__item--full@mobile u-flex-row"
                key={description}
              >
                <AudioButton
                  audioContext={this.audioContext}
                  className="u-mb1"
                  description={description}
                  soundUrl={url}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
}

export default App
