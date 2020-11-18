// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"epB2":[function(require,module,exports) {
var $siteList = $('.siteList');
var $lastLi = $siteList.find('li.last');
var x = localStorage.getItem('x');
var xObject = JSON.parse(x);
var hashMap = xObject || [];
var isMenu = [];
var buttonCount = 3;

var simplifyUrl = function simplifyUrl(url) {
  return url.replace('http:', '').replace('https:', '').replace('//', '').replace('www.', '').replace(/\/.*/, '');
};

var writeBack = function writeBack() {
  var string = JSON.stringify(hashMap);
  localStorage.setItem('x', string);
};

var render = function render() {
  $siteList.find('li:not(.last)').remove();

  for (var i = 0; i < hashMap.length; i++) {
    isMenu[i] = false;
  }

  hashMap.forEach(function (item, index) {
    var $li = $("\n            <li>\n                <a href=\"".concat('//' + item.url, "\">\n                    <div class=\"menu\">\n                        <div class=\"select\">\n                            <div class=\"modifyDomainNameButton\">\u4FEE\u6539\u57DF\u540D</div>\n                            <div class=\"modifyNameButton\">\u4FEE\u6539\u5907\u6CE8</div>\n                            <div class=\"deleteButton\">\u5220\u9664</div>\n                        </div>\n                        <svg class=\"icon\" aria-hidden=\"true\">\n                            <use xlink:href=\"#icon-more\"></use>\n                        </svg>\n                    </div>\n                    <div class=\"site\">\n                        <div class=\"logo\">").concat(item.logo.toLocaleUpperCase(), "</div>\n                        <div class=\"text\">").concat(item.text, "</div>\n                    </div>\n                </a>\n            </li>\n    ")).insertBefore($lastLi);
  });
  Array.from(document.querySelectorAll('.siteList a .icon')).forEach(function (item, index) {
    item.addEventListener('click', function (e) {
      e.preventDefault();

      if (e.currentTarget.previousSibling.previousSibling !== null) {
        e.currentTarget.previousSibling.previousSibling.style.display = !isMenu[index] ? "block" : "none";
      }

      isMenu[index] = !isMenu[index];
    });
  });
  Array.from(document.querySelectorAll('.menu [class$=Button]')).forEach(function (item, index) {
    item.addEventListener('click', function (e) {
      e.preventDefault();
      var classValue = e.currentTarget.getAttribute("class");

      if (classValue === 'modifyDomainNameButton') {
        var newValue = window.prompt("input the new Domain Name");
        if (newValue) hashMap[index / buttonCount >> 0].url = simplifyUrl(newValue);
      } else if (classValue === 'modifyNameButton') {
        var _newValue = window.prompt("input the new Name");

        if (_newValue) hashMap[index / buttonCount >> 0].text = _newValue;
      } else if (classValue === 'deleteButton') {
        hashMap.splice(index / buttonCount >> 0, 1);
      }

      writeBack();
      render();
    });
  });
};

window.onbeforeunload = writeBack;
$('.addButton').on('click', function () {
  if (hashMap.length >= 8) {
    alert("快捷方式不能超过8个");
    return;
  }

  var url = window.prompt('请输入域名');
  var text = window.prompt('请输入名称');

  if (url !== null && text != null) {
    hashMap.push({
      logo: simplifyUrl(url)[0],
      url: simplifyUrl(url),
      text: text
    });
    writeBack();
    render();
  }
});
document.addEventListener('keypress', function (e) {
  var key = e.key;
  hashMap.forEach(function (item, index) {
    if (item.logo.toLocaleLowerCase() === key) {
      window.open('//' + item.url);
      return;
    }
  });
});
document.querySelector('html').style.height = window.innerHeight + 'px'; // console.log(document.querySelector('html').style.height)

render();
},{}]},{},["epB2"], null)
//# sourceMappingURL=main.3aaf3670.js.map