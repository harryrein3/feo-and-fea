import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import styles from './App.lazy.scss'

class App extends Component {
  static propTypes = {
    // data: PropTypes.object.isRequired,
  }

  componentDidMount() {
    styles.use();
  }
  
  render() {
    return (
      <div>
        This is a placeholder for our app!
      </div>
    )
  }
}

export default App
