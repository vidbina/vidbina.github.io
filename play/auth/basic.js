console.log('basic authentication game v1.0');
require([
  '/play/auth/deps/underscore-min.js',
  '/play/auth/deps/backbone-min.js',
  '/play/auth/deps/jquery-1.10.2.min.js'
], function(underscore, backbone, jquery) {
  Backbone.$ = $;

  var game = {};
  _.extend(game, Backbone.Events);

  var LogView = Backbone.View.extend({
    tagName: "pre",
    initialize: function() {
    },
    template: _.template("<%= message %>"),
    render: function() {
      this.$el.html(this.template(this.model.attributes));
      return this;
    }
  });

  var BasicClient = Backbone.Model.extend({
    login: function(handle, username) {
      // Base64 tokens
      // issue request
    }
  });

  var GameView = Backbone.View.extend({
    id: "basic-auth-game",
    events: {
      "click .login_button": "login"
    },
    initialize: function() {
      console.log("init");
    },
    render: function(){
      console.log("render");
    },
    login: function() {
      var handle = $('#basic-auth-game .login_dialog .handle').val();
      var secret = $('#basic-auth-game .login_dialog .secret').val();
      game.trigger("login", [handle, secret]);
    },
    updateConsole: function(target, view) {
      this.$("." + target).append(view.render().el);
      this.$("." + target)[0].scrollTop = this.$("." + target)[0].scrollHeight;
    },
    animateToSegue: function(object, animation, next) {
      $('.' + object).addClass('animated ' + animation);
      $('.' + object).on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
        next();
      });
    },
    show: function(object, next) {
      _.defer(function(view) {
        switch(object) {
        case 'login_dialog':
          view.animateToSegue(object, 'bounceIn', next);
          break;
        default:
          view.animateToSegue(object, 'fadeInDown', next);
        }
      }, this);
    },
    hide: function(object, next) {
      _.defer(function(view) {
        switch(object) {
        case 'login_dialog':
          view.animateToSegue(object, 'bounceOut', next);
          break;
        default:
          view.animateToSegue(object, 'fadeOutDown', next);
        }
      }, this);
    }
  });

  var screen = new GameView({el: 'div #basic-auth-game'});

  var history = new Backbone.Collection;
  history.on('add', function(activity) {
    screen.updateConsole('client', new LogView({ model: activity }));
  });

  game.on("intro", function() {
    console.log('intro');
    history.add({ message: "/ o\\  simple demo of Basic auth" });
    history.add({ message: "\\_ /  " });
    history.add({ message: "&nbsp;&lt;|" });
    history.add({ message: "&nbsp;&lt;|" });
    history.add({ message: "&nbsp;&lt;|" });
    history.add({ message: "&nbsp;`" });
    screen.show('login_dialog', function() {
    });
  });

  game.on("login", function(msg) {
    console.log("login triggered for " + JSON.stringify(msg));
    // TODO: disable login button from this point onward
    screen.hide('login_dialog', function() {
      game.trigger("calc_base64", msg);
    });
  });
  
  game.on("calc_base64", function(msg) {
    var str = (msg[0] + ":" + msg[1]);
    var base = window.btoa(unescape(encodeURIComponent(str)));
    history.add({ 
      message: ( "Base64(" + str + ") = " + base)
    });
    game.trigger("compose_request", { auth: "Basic " + base } );
  });

  game.on("compose_request", function(data) {
    if(typeof(data) != "object") return;

    if(!data.method) data.method = "GET"
    if(!data.resource) data.resource= "/resource"
    if(!data.host) data.host = "example.com"
    
    var requestString = "";
    if(data.host) requestString += data.method + " " + data.resource + " HTTP/1.1\n"
    if(data.host) requestString += "  Host: " + data.host + "\n"
    if(data.auth) requestString += "  Authorization: " + data.auth + "\n"
    history.add({
      message: ( requestString )
    });
    var headers = {
      "Authorization": data.auth
    }

    _.delay(function() {
      game.trigger("send_request", { 
        headers: headers,
        body: null,
        params: null
      });
    }, 2000);
  });

  game.on("send_request", function(req) {
    screen.hide('client', function() {
      console.log('sent');
    });
  });

  game.trigger("intro");
  //game.trigger("login", ["user", "pass"]);
});
