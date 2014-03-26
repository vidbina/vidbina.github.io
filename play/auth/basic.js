console.log('basic authentication game v1.0');
require([
  '/play/auth/deps/underscore-min.js',
  '/play/auth/deps/backbone-min.js',
  '/play/auth/deps/jquery-1.10.2.min.js'
], function(underscore, backbone, jquery) {
  console.log('let us go');
  Backbone.$ = $;

  var game = {};
  _.extend(game, Backbone.Events);

  var LogView = Backbone.View.extend({
    tagName: "pre",
    initialize: function() {
      console.log("new log entry");
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
    updateConsole: function(view) {
      this.$(".client").append(view.render().el);
      this.$(".client")[0].scrollTop = this.$(".client")[0].scrollHeight;
    },
    hideDialog: function(next) {
      $('.login_dialog').addClass('animated slideOutRight');
      $('.login_dialog').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
        console.log('done');
        next();
      });
    }
    showDialog: function(next) {
      $('.login_dialog').addClass('animated slideInRight');
      $('.login_dialog').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
        console.log('done');
        next();
      });
    }
  });

  var gamescreen = new GameView({el: 'div #basic-auth-game'});

  var history = new Backbone.Collection;
  history.on('add', function(activity) {
    console.log('logging new item');
    gamescreen.updateConsole(new LogView({ model: activity }));
  });

  game.on("login", function(msg) {
    console.log("login triggered for " + JSON.stringify(msg));
    history.add({ message: "Beginning auth circus..." });
    gamescreen.hideDialog(function() {
      game.trigger("compose_base64", msg);
    });
  });
  
  game.on("compose_base64", function(msg) {
    var str = (msg[0] + ":" + msg[1]);
    var base = window.btoa(unescape(encodeURIComponent(str)));
    history.add({ 
      message: ( "Base64(" + str + ") = " + base)
    });
  });

  game.on("compose_request", function(data) {
    console.log("WIP");
  }

  //game.trigger("login", ["user", "pass"]);
});
