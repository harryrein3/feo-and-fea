/*
  These are the libraries that are bundled together from the 
  package.json folder, they are all external libraries we are
  using to make our job earier.
*/
import _ from 'lodash'
import $ from 'jquery'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

/*
  We will use these global variables to pass between functions.
*/
let selectedText = null 
let selectedContainerElement = null 

/*
  Waiting for a highlight event and sending the label to the background
  thread to be translated.
*/
const initializeHighlightListener = () => {
  document.addEventListener("mouseup",event=>{
    let selection = document.getSelection ? document.getSelection().toString() :  document.selection.createRange().toString();

    // TODO by FEA (help by feo): make sure selection is a full section of text
    // 1) Find the div on the page that has that selection
    // 2) Make sure the beginning and end part of the highlight contains the entire word not just part
    const feaSaysSo = true
    const selectionIsValid = feaSaysSo && selection.length > 0

    if (selectionIsValid) {
      selectedText = selection
      selectedContainerElement = event.target
      chrome.runtime.sendMessage({event: 'TRANSLATE_TEXT', data: {selection}})
    } else {
      selectedText = null
      selectedContainerElement = null
    }
  })
}

/*
  Getting the translation response from the background thread
*/
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { type, translation, raw_input, error } = request
  switch(type) {
    case 'TRANSLATION_COMPLETE':
      console.log('Translation complete', request)
      labelTranslation(translation, raw_input, error)
      break;
    default:
      break;
  }
})

/*
  Set up the UI to show the label for the translation
*/
let reactApp= null
const labelTranslation = (translation, raw_input, error) => {
  // Here we need to find the highlighted text and add a component hovering above it with the translation of the text.
<<<<<<< HEAD
  console.log('Got a translation', translation, raw_input)
  const rootElement = document.createElement('div')
  document.body.append(rootElement)
  const reactApp = ReactDOM.render(<App/>, rootElement);
=======
  const data = { translation, raw_input, error, visible: !reactApp }
  if (!reactApp) {
      const rootElement = document.createElement('div')
      rootElement.classList.add('travis-jr-root-container')
      const prevElement = document.querySelector('.travis-jr-root-container')
      document.body.append(rootElement)
      reactApp = ReactDOM.render(<App initialData={data}/>, rootElement);
  } else {
    reactApp.setData(data)
  }
>>>>>>> On page v1
}

$(document).ready(function(){
  initializeHighlightListener()
})


