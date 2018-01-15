import "react-fastclick"
import React from "react"
import ReactDOM from "react-dom"

import "./index.css"
import "./grid.css"
import "./utilities.css"

import App from "./App"
import registerServiceWorker from "./registerServiceWorker"

window.trace = tag => d => console.log(tag, d) || d

ReactDOM.render(<App />, document.getElementById("root"))
registerServiceWorker()
