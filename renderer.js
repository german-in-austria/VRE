// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var stylus = require('stylus')
var fs = require('fs')
var $ = require('jquery')
var url = require('url')
var shell = require('electron').shell

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

//open links externally by default


var app_modules = [
  {
    name : 'Diskussion',
    selector : '.mattermost',
    css : '/css/mattermost.styl',
    // debug : true
  },
  {
    name : 'DIÖ-Cloud',
    selector : '.cloud',
    css : '/css/owncloud.styl',
    js : '/js-injection/owncloud.js',
    // debug : true
  },
  {
    name : 'Aufgaben',
    selector : '.redmine',
    css : '/css/redmine.styl',
    //debug : true
  },
  {
    name : 'Kalender',
    selector : '.calendar',
    css : '/css/calendar.styl',
    // debug : true
  }
]

dioe = {
  openView : (el) => {
    var view_name = el.href.split('#')[1]
    localStorage.setItem('active_page', view_name)
    document.querySelector('.sidebar a.active').classList.remove('active')
    el.classList.add('active')
    document.querySelector('webview.active').classList.remove('active')
    document.querySelector('#'+view_name).classList.add('active')
  }
}

app_modules.map(app_module => {
  var el = document.querySelector(app_module.selector)
  el.addEventListener('dom-ready', () => {
    el.addEventListener('new-window', (e) => {
      var link_url = url.parse(e.url)
      shell.openExternal(e.url)
    })
    if (app_module.js != undefined) {
      var js = fs.readFileSync(__dirname+app_module.js, 'utf-8')
      el.executeJavaScript(js, () => {
        console.log('executed js')
      })
    }
    if (app_module.css != undefined) {
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
    }
  })
})
