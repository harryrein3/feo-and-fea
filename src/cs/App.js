import React from 'react'
import classnames from 'classnames'
import styles from './App.lazy.scss'

class App extends React.Component {
  componentDidMount() {
    styles.use();
    setTimeout(() => {
        this.setState({visible: true})
    }, 400)
  }

  setData = data => {
    this.setState({...data})
    if (!this.state.visible) {
        this.setState({visible: true})
    }
  }

  // These state elements are passed down through the contentScript.
  state = {
    ...this.props.initialData,
  }
  
  render() {
    const { raw_input, translation, error, visible } = this.state;
    return (
      <div className={classnames('travis-outer-container', {visible})}>
        <div className='travis-inner-container'>
            <div className='travis-translation-container'>
                {
                  error ?
                    <div>
                        <div className='translated-from'>There was an error</div>
                        <div className='translated-to'>{error.responseText}</div>
                    </div>
                    :
                    <div>
                        <div className='translated-from'>{raw_input}</div>
                        <div className='translated-middle'>to</div>
                        <div className='translated-to'>{translation}</div>
                    </div>
                }
            </div>
            <div onClick={() => this.setState({visible: false})}className='close-icon'>x</div>
          </div>
      </div>
    )
  }
}

export default App
