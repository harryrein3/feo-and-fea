/*
  Background server, set up to handle API calls for translation.
*/
import $ from 'jquery'
import _ from 'lodash'

import basset16 from '../../images/icons/basset@16.png'
import basset32 from '../../images/icons/basset@32.png'
import basset48 from '../../images/icons/basset@48.png'
import basset128 from '../../images/icons/basset@128.png'

import spanishBasset16 from '../../images/icons/spanishBasset@16.png'
import spanishBasset32 from '../../images/icons/spanishBasset@32.png'
import spanishBasset48 from '../../images/icons/spanishBasset@48.png'
import spanishBasset128 from '../../images/icons/spanishBasset@128.png'


const GOOGLE_TRANSLATE_TOKEN = 'ya29.c.Ko8Bwgf080dRwxsT5Qvpu-T5hFThWtT0snx_0KbOBu53-W4mNYcTZeD1dnp47Ao0LGBukaY1UvDaZPRZzIg60j-TcyHcP7eo3b_5UixKPH9gdIxz2H_JleqVaycLNqG2jE30MaQcrk5pAOx3E9KVBVBFe08wJG-rrbmmgOEblv-SMQ7aJhJuubZ8NAfE0DQNka8'

let isSpanish = false
chrome.browserAction.onClicked.addListener((tab) => { 
  isSpanish = !isSpanish      

  chrome.tabs.getSelected(tab => { // deprecated, eventually remove
    chrome.browserAction.setIcon({path: {
      "16": isSpanish ? spanishBasset16 : basset16,
      "32": isSpanish ? spanishBasset32 : basset32,
      "48": isSpanish ? spanishBasset48 : basset48,
      "128": isSpanish ? spanishBasset128 : basset128,
    }, tabId: tab.tabId})

  })

});


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
          source: isSpanish ? 'en' : 'es',
          target: isSpanish ? 'es' : 'en',
          format: 'text'
        }),
        success: data => {
          const result = _.get(data, ['data', 'translations', 0, 'translatedText']) 
          console.log('Translation complete2!', result)
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
