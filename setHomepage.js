const fs = require('fs');

const env = process.env.REACT_APP_ENV || 'development';

const homepageMap = {
  development: '',
  github: 'https://robgomezsir.github.io/meu-proposito-app',
  render: '.',
};

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

packageJson.homepage = homepageMap[env] || '';

fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2), 'utf8');

console.log(`Set homepage to "${packageJson.homepage}" for environment "${env}"`);
