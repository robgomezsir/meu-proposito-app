#!/usr/bin/env node

// Script de deploy que configura corretamente os caminhos para cada ambiente
const fs = require('fs');
const path = require('path');

const ENV = process.env.REACT_APP_ENV || 'render';

console.log(`🔧 Configurando deploy para ambiente: ${ENV}`);

// Configurações por ambiente
const configs = {
  'github-pages': {
    homepage: 'https://robgomezsir.github.io/meu-proposito-app',
    assetPrefix: '/meu-proposito-app',
    useAbsolutePaths: true
  },
  'render': {
    homepage: '',
    assetPrefix: '',
    useAbsolutePaths: false
  },
  'local': {
    homepage: '',
    assetPrefix: '',
    useAbsolutePaths: false
  }
};

const config = configs[ENV] || configs.render;

// Atualizar package.json
const packagePath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

if (config.homepage) {
  packageJson.homepage = config.homepage;
} else {
  delete packageJson.homepage;
}

fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));

console.log(`✅ Package.json atualizado para ${ENV}`);
console.log(`📁 Homepage: ${config.homepage || 'não definido'}`);
console.log(`🔗 Asset Prefix: ${config.assetPrefix || 'não definido'}`);
console.log(`📏 Caminhos: ${config.useAbsolutePaths ? 'absolutos' : 'relativos'}`);

// Criar arquivo de configuração de ambiente
const envConfigPath = path.join(__dirname, '..', 'src', 'config', 'deploy-env.js');
const envConfigContent = `// Configuração de ambiente para deploy
// Gerado automaticamente pelo script de deploy

export const DEPLOY_CONFIG = ${JSON.stringify(config, null, 2)};

export default DEPLOY_CONFIG;
`;

fs.writeFileSync(envConfigPath, envConfigContent);

console.log(`✅ Arquivo de configuração de ambiente criado: ${envConfigPath}`);
console.log(`🚀 Deploy configurado para ${ENV}`);
