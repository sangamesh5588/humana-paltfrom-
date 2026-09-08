const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

try {
  console.log('Running nest build...');
  execSync('npx nest build', { cwd: __dirname, stdio: 'inherit' });

  console.log('\nInspecting dist folder:');
  function listRecursive(dir, indent = '') {
    if (!fs.existsSync(dir)) {
      console.log(indent + '(does not exist)');
      return;
    }
    const files = fs.readdirSync(dir);
    for (const f of files) {
      const full = path.join(dir, f);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        console.log(`${indent}[DIR] ${f}`);
        listRecursive(full, indent + '  ');
      } else {
        console.log(`${indent}${f}`);
      }
    }
  }

  listRecursive(path.join(__dirname, 'dist'));
} catch (err) {
  console.error('Build error:', err.message);
}
