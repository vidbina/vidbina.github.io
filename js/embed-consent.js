// Third-party embeds sit inert in a <template> until the visitor asks for them.
// "Always load" keeps the provider's name and version in localStorage, nothing else.
// Bump a provider's version when what it receives changes, so visitors are asked again.
(function () {
  var storageKey = 'embed-consent';
  var providers = {
    twitter: {
      name: 'X (Twitter)',
      operator: 'X',
      policy: 'https://x.com/privacy',
      version: 1
    },
    youtube: {
      name: 'YouTube',
      operator: 'Google',
      policy: 'https://policies.google.com/privacy',
      version: 1
    }
  };
  var boxes = [];

  function stored() {
    try {
      return JSON.parse(localStorage.getItem(storageKey)) || {};
    } catch (e) {
      return {};
    }
  }

  function save(choices) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(choices));
    } catch (e) {
      // Without storage the visitor is simply asked again next time.
    }
  }

  function isAllowed(key) {
    return !!providers[key] && stored()[key] === providers[key].version;
  }

  function forProvider(key, action) {
    boxes.forEach(function (box) {
      if (box.key === key) action(box);
    });
  }

  function allow(key) {
    var choices = stored();
    choices[key] = providers[key].version;
    save(choices);
    forProvider(key, function (box) { box.load(); });
  }

  function forget(key) {
    var choices = stored();
    delete choices[key];
    save(choices);
    forProvider(key, function (box) { box.unload(); });
  }

  function button(label, onclick) {
    var el = document.createElement('button');
    el.type = 'button';
    el.textContent = label;
    el.addEventListener('click', onclick);
    return el;
  }

  function appendAll(parent, items) {
    items.forEach(function (item) {
      parent.appendChild(item);
      parent.appendChild(document.createTextNode(' '));
    });
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

  function setUp(el) {
    var template = el.querySelector('template');
    var link = el.querySelector(':scope > a');
    var key = el.getAttribute('data-provider');
    var provider = providers[key] || { name: key, operator: key };
    var slot = document.createElement('div');
    var bar = document.createElement('p');
    var box = { key: key };
    slot.className = 'consent-slot';
    bar.className = 'consent-bar';
    el.insertBefore(slot, template);
    el.insertBefore(bar, template);

    box.unload = function () {
      var quote = preview(template);
      var details = document.createElement('a');
      var actions = [details];
      details.href = '/imprint/#eingebettete-inhalte';
      details.textContent = 'Details and withdrawal';
      slot.textContent = '';
      if (quote) slot.appendChild(quote);
      bar.textContent = 'Loading this contacts ' + provider.name + '. ' +
        provider.operator + ' receives your IP address, may set cookies and ' +
        'may process your data outside the EU, where protection can be weaker. ' +
        'You can withdraw at any time, but that does not undo what was already sent. ';
      if (provider.policy) {
        var policy = document.createElement('a');
        policy.href = provider.policy;
        policy.textContent = 'Privacy policy';
        actions.push(policy);
      }
      if (link) actions.push(link);
      actions.push(button('Load once', function () {
        box.load();
        bar.querySelector('button').focus();
      }));
      if (providers[key]) {
        actions.push(button('Always load from ' + provider.name, function () {
          allow(key);
          bar.querySelector('button').focus();
        }));
      }
      appendAll(bar, actions);
    };

    box.load = function () {
      var allowed = isAllowed(key);
      slot.textContent = '';
      slot.appendChild(document.importNode(template.content, true));
      // widgets.js only scans the page once, when it first runs.
      if (window.twttr && window.twttr.widgets) window.twttr.widgets.load(slot);
      bar.textContent = allowed ?
        'Loaded from ' + provider.name + ' because you chose to always allow it. ' :
        'Loaded from ' + provider.name + '. ';
      appendAll(bar, [
        button('Reload', function () {
          box.load();
          bar.querySelector('button').focus();
        }),
        allowed ?
          button('Forget ' + provider.name, function () {
            forget(key);
            bar.querySelector('button').focus();
          }) :
          button('Remove', function () {
            box.unload();
            bar.querySelector('button').focus();
          })
      ]);
    };

    boxes.push(box);
    if (isAllowed(key)) box.load(); else box.unload();
  }

  // The list on the imprint page, so a choice can be withdrawn from one place.
  function listChoices(list) {
    var label = list.getAttribute('data-forget');
    var keys = Object.keys(stored()).filter(function (key) { return providers[key]; });
    if (!keys.length) return;
    list.textContent = '';
    keys.forEach(function (key) {
      var item = document.createElement('li');
      item.appendChild(document.createTextNode(providers[key].name + ' '));
      item.appendChild(button(label, function () {
        forget(key);
        item.remove();
        if (!list.children.length) {
          var none = document.createElement('li');
          none.textContent = list.getAttribute('data-none');
          list.appendChild(none);
        }
      }));
      list.appendChild(item);
    });
  }

  Array.prototype.forEach.call(document.querySelectorAll('.consent'), setUp);
  Array.prototype.forEach.call(document.querySelectorAll('.consent-choices'), listChoices);
})();
