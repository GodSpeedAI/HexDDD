const path = require('path');
const config = require('./supabase.config.ts');

module.exports = (argv) => {
  return config.adaptJestArgs(argv);
};
