const fs = require('fs');
let str = fs.readFileSync('src/assets/css/style.css', 'utf8');

const OLD = '.weather-widget__temp { cursor: pointer; font-weight: 600; color: var(--text); border-bottom: 1px dashed var(--border); }';
const NEW = '.weather-widget__temp { cursor: pointer; font-weight: 600; color: var(--text); }';

if (!str.includes(OLD)) { console.error('not found'); process.exit(1); }
str = str.replace(OLD, NEW);
fs.writeFileSync('src/assets/css/style.css', str);
console.log('done');
