//this is arg-1.3.min.js
//it isn't in its own js file because I'm lazy
(function(global){global.MakeArg=function(){var Arg=function(){return Arg.get.apply(global,arguments)};Arg.version="1.3.0";Arg.parse=function(s){if(!s)return{};if(s.indexOf("=")===-1&&s.indexOf("&")===-1)return{};s=Arg._cleanParamStr(s);var obj={};var pairs=s.split("&");for(var pi in pairs){if(pairs.hasOwnProperty(pi)){var kvsegs=pairs[pi].split("=");var key=decodeURIComponent(kvsegs[0]),val=Arg.__decode(kvsegs[1]);Arg._access(obj,key,val)}}return obj};Arg.__decode=function(s){while(s&&s.indexOf("+")>-1){s=s.replace("+"," ")};s=decodeURIComponent(s);return s};Arg._access=function(obj,selector,value){var shouldSet=typeof value!=="undefined";var selectorBreak=-1;var coerce_types={'true':true,'false':false,'null':null};if(typeof selector=='string'||toString.call(selector)=='[object String]'){selectorBreak=selector.search(/[\.\[]/)}if(selectorBreak===-1){if(Arg.coerceMode){value=value&&!isNaN(value)?+value:value==='undefined'?undefined:coerce_types[value]!==undefined?coerce_types[value]:value}return shouldSet?(obj[selector]=value):obj[selector]}var currentRoot=selector.substr(0,selectorBreak);var nextSelector=selector.substr(selectorBreak+1);switch(selector.charAt(selectorBreak)){case'[':obj[currentRoot]=obj[currentRoot]||[];nextSelector=nextSelector.replace(']','');if(nextSelector.search(/[\.\[]/)===-1){nextSelector=parseInt(nextSelector,10)}return Arg._access(obj[currentRoot],nextSelector,value);case'.':obj[currentRoot]=obj[currentRoot]||{};return Arg._access(obj[currentRoot],nextSelector,value)}return obj};Arg.stringify=function(obj,keyPrefix){switch(typeof(obj)){case"object":var segs=[];var thisKey;for(var key in obj){if(!obj.hasOwnProperty(key))continue;var val=obj[key];if(typeof(key)==="undefined"||key.length===0||typeof(val)==="undefined"||val.length===0)continue;thisKey=keyPrefix?keyPrefix+"."+key:key;if(typeof obj.length!=="undefined"){thisKey=keyPrefix?keyPrefix+"["+key+"]":key}if(typeof val==="object"){segs.push(Arg.stringify(val,thisKey))}else{segs.push(encodeURIComponent(thisKey)+"="+encodeURIComponent(val))}}return segs.join("&")}return encodeURIComponent(obj)};Arg.url=function(){var sep=(Arg.urlUseHash?Arg.hashQuerySeperator:Arg.querySeperator);var segs=[location.pathname,sep];var args={};switch(arguments.length){case 1:segs.push(Arg.stringify(arguments[0]));break;case 2:segs[0]=Arg._cleanPath(arguments[0]);args=Arg.parse(arguments[0]);args=Arg.merge(args,arguments[1]);segs.push(Arg.stringify(args));break;case 3:segs[0]=Arg._cleanPath(arguments[0]);segs[1]=Arg.querySeperator;segs.push(Arg.stringify(arguments[1]));(typeof(arguments[2])==="string")?segs.push(Arg.hashSeperator):segs.push(Arg.hashQuerySeperator);segs.push(Arg.stringify(arguments[2]))}var s=segs.join("");if(s.indexOf(sep)==s.length-sep.length){s=s.substr(0,s.length-sep.length)}return s};Arg.urlUseHash=false;Arg.querySeperator="?";Arg.hashSeperator="#";Arg.hashQuerySeperator="#?";Arg.coerceMode=true;Arg.all=function(){var merged=Arg.parse(Arg.querystring()+"&"+Arg.hashstring());return Arg._all?Arg._all:Arg._all=merged};Arg.get=function(selector,def){var val=Arg._access(Arg.all(),selector);return typeof(val)==="undefined"?def:val};Arg.query=function(){return Arg._query?Arg._query:Arg._query=Arg.parse(Arg.querystring())};Arg.hash=function(){return Arg._hash?Arg._hash:Arg._hash=Arg.parse(Arg.hashstring())};Arg.querystring=function(){return Arg._cleanParamStr(location.search)};Arg.hashstring=function(){return Arg._cleanParamStr(location.hash)};Arg._cleanParamStr=function(s){if(s.indexOf(Arg.querySeperator)>-1)s=s.split(Arg.querySeperator)[1];if(s.indexOf(Arg.hashSeperator)>-1)s=s.split(Arg.hashSeperator)[1];if(s.indexOf("=")===-1&&s.indexOf("&")===-1)return"";while(s.indexOf(Arg.hashSeperator)==0||s.indexOf(Arg.querySeperator)==0)s=s.substr(1);return s};Arg._cleanPath=function(p){if(p.indexOf(Arg.querySeperator)>-1)p=p.substr(0,p.indexOf(Arg.querySeperator));if(p.indexOf(Arg.hashSeperator)>-1)p=p.substr(0,p.indexOf(Arg.hashSeperator));return p};Arg.merge=function(){var all={};for(var ai in arguments){if(arguments.hasOwnProperty(ai)){for(var k in arguments[ai]){if(arguments[ai].hasOwnProperty(k)){all[k]=arguments[ai][k]}}}}return all};return Arg};global.Arg=MakeArg()})(window);

// after render, seek to highlight

// these words signify the next line's type
// bearers are states that leave a non-bearer
// version to the next state
const stateMapping = {
  'Highlight': 'highlight-bearer',
  'Notebook': 'title-bearer',
  'Citation (APA)': 'citation',
  'Note -': 'note-bearer'
}

const initialHighlight = Arg('highlight')

var app = new Vue({
  el: '#formatted',
  data: {
    citation: null,
    nextType: null,
    text: document.getElementById('raw-notes').textContent.split('\n'),
    output: null
  },
  mounted: function () {
    this.generateFormatted()
  },
  methods: {
    generateFormatted: function () {
      function getType (_text) {
        for (var key in stateMapping) {
          if (stateMapping.hasOwnProperty(key)) {
            if (_text.indexOf(key) === 0) {
              return stateMapping[key]
            }
          }
        }
        return null
      }

      let output = []
      // {type: , content: }
      let lastState = null
      for (var i = 0; i < this.text.length; i++) {
        let content = this.text[i]
        let type = getType(content)
        if (type === 'citation') {
          this.citation = content
        }
        if (lastState && lastState.indexOf('-bearer') > -1) {
          type = lastState.replace('-bearer', '')
        }
        let tempOutput = {type: type, content: content}

        if (content.indexOf(initialHighlight) > -1 &&
            (type === 'highlight' || type === 'note')) {
          tempOutput['seek'] = true
          tempOutput.content = tempOutput.content.replace(initialHighlight,
            '<span class="queryhighlight">' + initialHighlight + '</span>')
        }
        output.push(tempOutput)
        lastState = type
      }

      this.output = output

      var clipboard = new ClipboardJS('.copy-btn')

      clipboard.on('success', function(e) {
        let tempText = e.trigger.innerHTML
        e.trigger.innerHTML = 'copied!'
        e.trigger.disabled = true
        setTimeout(function() {
          e.trigger.innerHTML = tempText
          e.trigger.disabled = false
        }, 2000)
      })

      // change to on output change
      setTimeout(function () {
        var el = document.querySelector('.seek')
        if (el) {
          el.scrollIntoView()
        }
      }, 100)
    }
  }
})

// For implementing search: elasticlunr that places seek class
// and triggers change of output and scrolling into view

// i can start collecting lunr stuff from notes and highlights in generateFormatted
