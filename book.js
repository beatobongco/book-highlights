var text = document.getElementById('raw-notes').textContent.split('\n')
var isTitle = false
var isHighlight = false
var isNote = false
var isAuthor = false

for (var i = 0; i < text.length; i++) {
  var _text = text[i].trim()
  var cls = null
  var elType = 'h3'
  if (text[i].length < 1) {
    continue
  }
  if (_text.indexOf('Highlight') === 0) {
    isHighlight = true
    cls = 'highlight'
    elType = 'small'
  } else if (isHighlight) {
    cls = 'quote'
    elType = 'blockquote'
    isHighlight = false
  }

  if (_text.indexOf('Notebook') === 0) {
    isTitle = true
  } else if (isTitle) {
    elType = 'h1'
    isTitle = false
    isAuthor = true
  } else if (isAuthor) {
    elType = 'div'
    isAuthor = false
  } else if (_text.indexOf('Citation (APA)') === 0) {
    cls = 'citation'
    elType = 'small'
  } else if (_text.indexOf('Note -') === 0) {
    isNote = true
    cls = 'note'
    elType = 'small'
  } else if (isNote) {
    cls = 'note'
    elType = 'div'
    isNote = false
  }

  var el = document.createElement(elType)
  el.appendChild(document.createTextNode(text[i]))
  var wrapper = document.createElement('div')
  wrapper.appendChild(el)
  wrapper.className = cls
  document.getElementById('formatted').appendChild(wrapper)
}
