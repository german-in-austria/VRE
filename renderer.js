// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var stylus = require('stylus')
var fs = require('fs')
var compileCSS = (path) => {
  var file = fs.readFileSync(__dirname+path, 'utf8')
  return new Promise((resolve, reject) => {
    stylus.render(file, {filename : path}, (err, css) => {
      if (!err) {
        resolve(css)
      }else{
        reject(err)
      }
    })
  })
}


var app_modules = [
  {
    name : 'Diskussion',
    selector : '.mattermost',
    css : '/css/mattermost.styl',
    debug : false
  },
  {
    name : 'Aufgaben',
    selector : '.redmine',
    css : '/css/redmine.styl',
    debug : true
  }
]

app_modules.map(app_module => {
  var el = document.querySelector(app_module.selector)
  el.addEventListener('dom-ready', () => {
    compileCSS(app_module.css)
    .then((css) => {
      if (app_module.debug) {
        el.openDevTools()
      }
      return el.insertCSS(css)
    })
    .catch((err) => {
      console.log(err);
    })
  })
})
