import _ from 'lodash'
import $ from 'jquery'
import ReactDOM from 'react-dom'
import App from './App'

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Got a message from the backend')
  const { type, translation, raw_input } = request
  switch(type) {
    case 'TRANSLATION_COMPLETE':
      console.log(raw_input, 'translates to', translation)
      break;
    default:
      break;
  }
})


const initializeHighlightListener = () => {
  document.addEventListener("mouseup",event=>{
    let selection = document.getSelection ? document.getSelection().toString() :  document.selection.createRange().toString();

    // TODO by FEA (help by feo): make sure selection is a full section of text
    // 1) Find the div on the page that has that selection
    // 2) Make sure the beginning and end part of the highlight contains the entire word not just part
    const feaSaysSo = true
    const selectionIsValid = feaSaysSo && selection.length > 0

    if (selectionIsValid) {
      chrome.runtime.sendMessage({event: 'TRANSLATE_TEXT', data: {selection}})
    }
  })
}

const labelTranslation = resp => {
  // Here we need to find the highlighted text and add a component hovering above it with the translation of the text.
  const { translation, success } = resp;

  console.warn('Need to label translation', resp)

  // const rootElement = document.createElement('div')
  // rootElement.classList.add('feo-and-fea-on-page-container')
  // document.body.append(rootElement)
  // reactApp = ReactDOM.render(<App/>, rootElement);
}



$(document).ready(function(){
  initializeHighlightListener()
})