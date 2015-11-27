(function() {
  var getUriComponents = function getLocation(href) {
    var match = href.match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)(\/[^?#]*)(\?[^#]*|)(#.*|)$/);
    return match && {
      protocol: match[1],
      host: match[2],
      hostname: match[3],
      port: match[4],
      pathname: match[5],
      search: match[6],
      hash: match[7]
    }
  };

  if(window.location.hostname == 'localhost' || window.location.hostname == '127.0.0.1') return;

  var els = document.querySelectorAll('img.emoji');

  for (var i = 0; i < els.length; i++) {
    (function(el, id) {
      var image = new Image();
      image.onload = function() {
        el.src = this.src;
      };
      var path = getUriComponents(el.src)['pathname'].replace('/images', '');
      image.src = 'http://www.tortue.me' + path;
    })(els[i], i);
  }
})();
