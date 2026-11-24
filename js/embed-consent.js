---
---
// Third-party embeds sit inert in a <template> until the visitor asks for them.
// "Always load" keeps the provider's name and version in localStorage, nothing else.
// Bump a provider's version when what it receives changes, so visitors are asked again.
(function () {
  var storageKey = 'embed-consent';
  // One file per provider in _data/embeds/.
  var providers = {{ site.data.embeds | jsonify }};
  var boxes = [];
  var counts = {};

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

  // Links leave for another site, so they open in a new tab and say so.
  function external(a) {
    var icon = document.createElement('span');
    var hint = document.createElement('span');
    a.target = '_blank';
    a.rel = 'noopener';
    icon.className = 'consent-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = '\u2197';
    hint.className = 'consent-hint';
    hint.textContent = ' (opens in a new tab)';
    a.appendChild(icon);
    a.appendChild(hint);
    return a;
  }

  function linkTo(href, label) {
    var a = document.createElement('a');
    a.href = href;
    a.textContent = label;
    return a;
  }

  // The notice, then a row of actions and a row of links.
  function fill(bar, text, rows) {
    var note = document.createElement('p');
    note.textContent = text;
    bar.textContent = '';
    bar.appendChild(note);
    rows.forEach(function (items) {
      if (!items.length) return;
      var row = document.createElement('div');
      row.className = 'consent-actions';
      items.forEach(function (item) { row.appendChild(item); });
      bar.appendChild(row);
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
    var bar = document.createElement('div');
    var box = { key: key };
    slot.className = 'consent-slot';
    bar.className = 'consent-bar';
    el.insertBefore(slot, template);
    el.insertBefore(bar, template);
    if (link) external(link);

    box.unload = function () {
      var quote = preview(template);
      var actions = [];
      box.loaded = false;
      slot.textContent = '';
      if (quote) slot.appendChild(quote);
      actions.push(button('Load once', function () {
        box.load();
        bar.querySelector('button').focus();
      }));
      if (counts[key] > 1) {
        actions.push(button('Load all ' + counts[key] + ' once', function () {
          forProvider(key, function (other) {
            if (!other.loaded) other.load();
          });
          bar.querySelector('button').focus();
        }));
      }
      if (providers[key]) {
        actions.push(button('Always load from ' + provider.name, function () {
          allow(key);
          bar.querySelector('button').focus();
        }));
      }
      var links = [linkTo('/imprint/#eingebettete-inhalte', 'Details and withdrawal')];
      if (provider.policy) links.push(external(linkTo(provider.policy, 'Privacy policy')));
      if (link) links.push(link);
      fill(bar, 'Loading this contacts ' + provider.name + '. ' +
        provider.operator + ' receives your IP address, may set cookies and ' +
        'may process your data outside the EU, where protection can be weaker. ' +
        'You can withdraw at any time, but that does not undo what was already sent.',
        [actions, links]);
    };

    box.load = function () {
      var allowed = isAllowed(key);
      box.loaded = true;
      slot.textContent = '';
      slot.appendChild(document.importNode(template.content, true));
      // X's widgets.js and Instagram's embed.js only scan the page once, when
      // they first run, so embeds loaded after that need another scan.
      if (window.twttr && window.twttr.widgets) window.twttr.widgets.load(slot);
      if (window.instgrm) window.instgrm.Embeds.process();
      fill(bar, allowed ?
        'Loaded from ' + provider.name + ' because you chose to always allow it.' :
        'Loaded from ' + provider.name + '.', [[
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
      ]]);
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

  var gates = document.querySelectorAll('.consent');
  Array.prototype.forEach.call(gates, function (el) {
    var key = el.getAttribute('data-provider');
    counts[key] = (counts[key] || 0) + 1;
  });
  Array.prototype.forEach.call(gates, setUp);
  Array.prototype.forEach.call(document.querySelectorAll('.consent-choices'), listChoices);
})();
