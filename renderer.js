// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var stylus = require('stylus')
var fs = require('fs')
var $ = require('jquery')
var shell = require('electron').shell
var curr_wv = "mattermost"

console.log(shell)

var compileCSS = (path) => {
  var file = fs.readFileSync(__dirname + path, 'utf8')
  return new Promise((resolve, reject) => {
    stylus.render(file, {
      filename: path
    }, (err, css) => {
      if (!err) {
        resolve(css)
      } else {
        reject(err)
      }
    })
  })
}

//open links externally by default


var app_modules = [
  {
    name: 'Diskussion',
    selector: '.mattermost',
    css: '/css/mattermost.styl',
    js: '/js-injection/mattermost.js',
    // debug : true
  },
  {
    name: 'DIÖ-Cloud',
    selector: '.cloud',
    css: '/css/owncloud.styl',
    js: '/js-injection/owncloud.js',
    debug : true
  },
  {
    name: 'Aufgaben',
    selector: '.redmine',
    css: '/css/redmine.styl',
    //debug : true
  },
  {
    name: 'Kalender',
    selector: '.calendar',
    css: '/css/calendar.styl',
    // debug : true
  }
]

window.dioe = {
  openView: (el) => {
    var view_name = el.href.split('#')[1]
    if (view_name == "redmine") {
      document.querySelector('.backbutton').classList.remove('hidden')
    } else {
      document.querySelector('.backbutton').classList.add('hidden')
    }
    curr_wv = view_name
    localStorage.setItem('active_page', view_name)
    document.querySelector('.sidebar a.active').classList.remove('active')
    el.classList.add('active')
    document.querySelector('webview.active').classList.remove('active')
    document.querySelector('#' + view_name).classList.add('active')
  },
  goBack: (el) => {
    if (curr_wv == "redmine" && document.querySelector('webview.active').canGoBack()) {
      console.log("redmine back")
      document.querySelector('webview.active').goBack()
    }
  }
}

$(document).on('keydown', (e) => {
  if (e.originalEvent.metaKey === true && !isNaN(Number(e.key))) {
    console.log('cmd + ' + e.key)
    var index = Number(e.key) - 1
    var el = $('.sidebar a')[index]
    window.dioe.openView(el)
  }
})

app_modules.map(app_module => {
  var el = document.querySelector(app_module.selector)
  el.addEventListener('dom-ready', () => {
    el.addEventListener('new-window', (e) => {
      shell.openExternal(e.url)
    })
    if (app_module.js != undefined) {
      var js = fs.readFileSync(__dirname + app_module.js, 'utf-8')
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
          console.log(err)
        })
    }
  })
})
