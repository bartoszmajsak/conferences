var bespoke = require('bespoke'),
  nebula = require('bespoke-theme-nebula'),
  keys = require('bespoke-keys'),
  touch = require('bespoke-touch'),
  bullets = require('bespoke-bullets'),
  scale = require('bespoke-scale'),
  backdrop = require('bespoke-backdrop'),
  overview = require('bespoke-overview'),
  onstage = require('bespoke-onstage'),
  hash = require('bespoke-hash');

var deck = bespoke.from('article', [
  nebula(),
  keys(),
  overview(),
  touch(),
  bullets('ul:not(.no-bullets) li, ol:not(.no-bullets) li, .bullet'),
  scale(),
  backdrop(),
  onstage(),
  hash()
]);

deck.on("activate", function(event) {
  console.log(event.index)
  if (event.slide.innerHTML.includes('asciinema')) {
    event.slide.getElementsByClassName('control-bar')[0].setAttribute('style', 'display:none')
    var click = new MouseEvent("click", {
        "view": window,
        "bubbles": true,
        "cancelable": false
    });
    var player = event.slide.getElementsByTagName('asciinema-player')[0]
    console.log('time', player.currentTime)
    player.currentTime = 0
    player.play()
  }

  if (event.slide.innerHTML.includes('video')) {
    var player = event.slide.getElementsByTagName('video')[0]
    player.currentTime = 0
    player.play()
  }

  // TODO reset gif
})

require('prism');
require('prism-clojure/prism.clojure.js');
