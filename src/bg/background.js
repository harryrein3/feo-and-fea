/*
  Background server, set up to handle API calls for translation.
*/
import $ from 'jquery'
import _ from 'lodash'

import '../../images/icons/basset@16.png'
import '../../images/icons/basset@32.png'
import '../../images/icons/basset@48.png'
import '../../images/icons/basset@128.png'

const GOOGLE_TRANSLATE_TOKEN = 'ya29.c.Ko8BwgcIALuIAgZKkuSp1juMD2UtLvctar0O8AVR2mUMowFlMtun5XtclPi-yaQkMDKzxOHyAYhtFk9PeSarX3XuX9I7xSfCFqw6eGH920jTl48k-Zg_GBCdAKAI5e7yXo5tgnelrfQ6dNGp7kK6yxQ4aCeAlO2D9G7kGbKM6HULssDvnTKGCJ9HiFwnguUPJ58'

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  const { event, data } = request;
  switch(event) {
    case 'TRANSLATE_TEXT':
      const { selection } = data || {} 
      $.ajax({
        url: 'https://translation.googleapis.com/language/translate/v2',
        headers: {
          'Authorization': `Bearer ${GOOGLE_TRANSLATE_TOKEN}`,
          'Content-Type': 'application/json'
        },
        method: 'POST',
        data: JSON.stringify({
          q: selection,
          source: 'es',
          target: 'en',
          format: 'text'
        }),
        success: data => {
          const result = _.get(data, ['data', 'translations', 0, 'translatedText']) 
          console.log('Translation complete!', result)
          chrome.tabs.getSelected(tab => { // deprecated, eventually remove
            chrome.tabs.sendMessage(tab.id, {
              type: 'TRANSLATION_COMPLETE',
              success: true,
              translation: result,
              raw_input: selection 
            }, null)
          })
        }, 
        error: err => {
          chrome.tabs.getSelected(tab => { // deprecated, eventually remove
            chrome.tabs.sendMessage(tab.id, {
              type: 'TRANSLATION_COMPLETE',
              success: false,
              translation: null,
              raw_input: selection,
              error: err
            }, null)
          })
        }
      });
      break;

    default:
      break;
  }
})
