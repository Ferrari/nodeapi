const NODE_HOST = "http://nodejs.org/api";
const LATEST = NODE_HOST + '/all.json';

var fs = require('fs');
var util = require('util');
var request = require('request');
var clc = require('cli-color');
var S = require('string');

module.exports = function(args) {
  if (args.list) {
    loadApi(function(err, docs) {
      if (err) displayError("Can't fetch nodejs api document!");

      if (docs.modules) {
        docs.modules.forEach(function(v) {
          if (v.name) console.log(v.name);
        });
      }
    });
  } else if (args.module) {
    loadApi(function(err, docs) {
      if (err) displayError(err);

      var data = {};
      docs.modules.some(function(v) {
        if (v.name == args.module) {
          data = v;
          return true;
        }
      });

      if (Object.keys(data).length > 0) {
        displayModule(data);  
      } else {
        displayError("Not support module name: " + name);
      }
    });
  } else if (args.method) {
    loadApi(function(err, docs) {
      if (err) displayError(err);

      var data = [];
      var re = new RegExp(args.method, "i");
      docs.modules.forEach(function(module) {
        if (module.methods) {
          module.methods.forEach(function(method) {
            if (method.textRaw.match(re)) {
              data.push(method);
            }
          });
        }
      });
      displayMethod(data);
    });
  } else {
    fs.createReadStream(__dirname + '/help.txt').pipe(process.stdout);
  }
};

var displayError = function(message) {
  console.error(clc.red(message));
  process.exit(1);
};

var loadApi = function(cb) {
  var all = {};
  request.get(LATEST, function(err, res, body) {
    if (err) return cb(err);

    try {
      return cb(null, JSON.parse(body));
    } catch(e) {
      return cb(e);
    }
  })
}

var displayModule = function(doc) {
  console.log(clc.yellow(doc.textRaw));
  console.log(filterHTML(doc.desc));

  if (doc.methods && util.isArray(doc.methods)) {
    doc.methods.forEach(function(method) {
      console.log(clc.green(method.textRaw));
      console.log(filterHTML(method.desc));
    });
  }
};

var displayMethod = function(doc) {
  if (util.isArray(doc) && doc.length > 0) {
    doc.forEach(function(method) {
      console.log(clc.yellow(method.textRaw));
      console.log(filterHTML(method.desc));
    });
  }
};

var filterHTML = function(html) {
  return S(html.replace(/(<([^>]+)>)/ig, "")).unescapeHTML().s;
};
