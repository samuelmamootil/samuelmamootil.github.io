const fs = require('fs');
const b = fs.readFileSync('src/assets/css/style.css');
let str = b.toString();

const OLD = '.weather-widget {\r\n  display: inline-flex; align-items: center; gap: .4rem;\r\n  background: var(--surface);\r\n  border: 1px solid var(--border);\r\n  border-radius: 99px;\r\n  padding: .35rem .9rem;\r\n  font-size: .85rem;\r\n  color: var(--text-muted);\r\n  margin-bottom: 1.2rem;\r\n  box-shadow: 0 1px 4px rgba(0,0,0,.05);\r\n}\r\n.weather-widget[hidden] { display: none; }\r\n.weather-widget__sep { opacity: .4; }';

const NEW = '.weather-widget {\r\n  display: inline-flex; flex-direction: column; gap: .3rem;\r\n  background: var(--surface);\r\n  border: 1px solid var(--border);\r\n  border-radius: 12px;\r\n  padding: .5rem 1rem;\r\n  font-size: .85rem;\r\n  color: var(--text-muted);\r\n  margin-bottom: 1.2rem;\r\n  box-shadow: 0 1px 4px rgba(0,0,0,.05);\r\n}\r\n.weather-widget[hidden] { display: none; }\r\n.weather-widget__sep { opacity: .4; }\r\n.weather-widget__current { display: flex; align-items: center; gap: .4rem; }\r\n.weather-widget__temp { cursor: pointer; font-weight: 600; color: var(--text); border-bottom: 1px dashed var(--border); }\r\n.weather-widget__temp:hover { color: var(--accent); }\r\n.weather-widget__forecast { display: flex; gap: .8rem; padding-top: .3rem; border-top: 1px solid var(--border); margin-top: .1rem; }\r\n.wx-day { display: flex; flex-direction: column; align-items: center; gap: .1rem; font-size: .78rem; }\r\n.wx-day__label { font-weight: 600; color: var(--text); }\r\n.wx-day__icon { font-size: 1rem; }\r\n.wx-day__range { color: var(--text-muted); white-space: nowrap; }';

if (!str.includes(OLD)) { console.error('OLD block not found'); process.exit(1); }
str = str.replace(OLD, NEW);
fs.writeFileSync('src/assets/css/style.css', str);
console.log('done — forecast:', str.includes('weather-widget__forecast'));
