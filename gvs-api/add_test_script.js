const fs = require('fs');
const path = require('path');

const pkgPath = path.join(__dirname, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

pkg.scripts = pkg.scripts || {};
pkg.scripts.test = 'jest';

fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
