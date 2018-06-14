import 'react-fastclick'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './app'

window.trace = tag => d => console.log(tag, d) || d
ReactDOM.render(<App />, document.getElementById('root'))
