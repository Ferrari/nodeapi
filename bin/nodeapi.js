#!/usr/bin/env node

require('../lib/init')(
  require('optimist')
    .alias('v', 'version')
    .alias('l', 'list')
    .alias('m', 'module')
    .alias('e', 'method')
    .argv
);
