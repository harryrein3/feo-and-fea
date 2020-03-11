/*
  Background server, set up to handle API calls for translation.
*/
import $ from 'jquery'
import _ from 'lodash'

const GOOGLE_TRANSLATE_TOKEN = 'ya29.c.Ko8BwQcc0V0Ab5DkEAITE-vJ4BCOaM3lsHNbtNVWu3ihCbrMpvC_R0WGYuK3LuXUVqOfCGNOnAPszR91lIh3-tvSUNgKFjWi0l-UwxAfMGMN-2qQt6BiFSXIWl68ZhEbEQbNIhiu-4o9jRB0D1ozWGYKWmaXJXnfFU17a_bvQiHhCtf0pJN2r6dy7GTG_83AtiQ'

import '../../images/icons/basset@16.png'
import '../../images/icons/basset@32.png'
import '../../images/icons/basset@48.png'
import '../../images/icons/basset@128.png'

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
          source: 'en',
          target: 'es',
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
