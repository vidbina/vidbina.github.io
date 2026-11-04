// Third-party embeds sit inert in a <template> until the visitor asks for them.
// Nothing is stored: reloading the page returns every embed to its unloaded state.
(function () {
  var providers = {
    twitter: {
      name: 'X (Twitter)',
      operator: 'X',
      policy: 'https://x.com/privacy'
    },
    youtube: {
      name: 'YouTube',
      operator: 'Google',
      policy: 'https://policies.google.com/privacy'
    }
  };

  function button(label, onclick) {
    var el = document.createElement('button');
    el.type = 'button';
    el.textContent = label;
    el.addEventListener('click', onclick);
    return el;
  }

  // A quoted post can be read without contacting anyone. The class comes off so
  // the provider's script leaves this copy alone once another embed has loaded.
  function preview(template) {
    var quote = template.content.querySelector('blockquote');
    if (!quote) return null;
    var copy = quote.cloneNode(true);
    copy.removeAttribute('class');
    Array.prototype.forEach.call(copy.querySelectorAll('img'), function (img) {
      img.remove();
    });
    return document.importNode(copy, true);
  }

  function setUp(box) {
    var template = box.querySelector('template');
    var link = box.querySelector(':scope > a');
    var key = box.getAttribute('data-provider');
    var provider = providers[key] || { name: key, operator: key };
    var slot = document.createElement('div');
    var bar = document.createElement('p');
    slot.className = 'consent-slot';
    bar.className = 'consent-bar';
    box.insertBefore(slot, template);
    box.insertBefore(bar, template);

    function unloaded() {
      var quote = preview(template);
      var load = button('Load from ' + provider.name, loaded);
      slot.textContent = '';
      if (quote) slot.appendChild(quote);
      bar.textContent = 'Loading this contacts ' + provider.name +
        '. ' + provider.operator + ' receives your IP address, may set cookies' +
        ' and may process your data outside the EU. ';
      if (provider.policy) {
        var policy = document.createElement('a');
        policy.href = provider.policy;
        policy.textContent = 'Privacy policy';
        bar.appendChild(policy);
        bar.appendChild(document.createTextNode('. '));
      }
      if (link) {
        bar.appendChild(link);
        bar.appendChild(document.createTextNode(' '));
      }
      bar.appendChild(load);
      return load;
    }

    function loaded() {
      var reload = button('Reload', loaded);
      slot.textContent = '';
      slot.appendChild(document.importNode(template.content, true));
      // widgets.js only scans the page once, when it first runs.
      if (window.twttr && window.twttr.widgets) window.twttr.widgets.load(slot);
      bar.textContent = 'Loaded from ' + provider.name + '. ';
      bar.appendChild(reload);
      bar.appendChild(document.createTextNode(' '));
      bar.appendChild(button('Remove', function () { unloaded().focus(); }));
      reload.focus();
    }

    unloaded();
  }

  Array.prototype.forEach.call(document.querySelectorAll('.consent'), setUp);
})();
