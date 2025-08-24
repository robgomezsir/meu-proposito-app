// Script de build específico para o Render
// Remove o campo homepage e configura variáveis de ambiente

const fs = require('fs');
const path = require('path');

console.log('🔧 Preparando build para Render...');

try {
  const packagePath = path.join(__dirname, '..', 'package.json');
  
  // Ler o package.json atual
  const packageContent = fs.readFileSync(packagePath, 'utf8');
  const packageJson = JSON.parse(packageContent);
  
  // Verificar se tem homepage
  if (packageJson.homepage) {
    console.log('📝 Removendo campo homepage para build do Render...');
    
    // Fazer backup do package.json original
    fs.writeFileSync(path.join(__dirname, '..', 'package.json.backup'), packageContent);
    
    // Remover o campo homepage
    delete packageJson.homepage;
    
    // Salvar o package.json modificado
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
    
    console.log('✅ Campo homepage removido com sucesso');
  } else {
    console.log('ℹ️ Campo homepage já não existe');
  }
  
  // Configurar variáveis de ambiente para Render
  process.env.REACT_APP_ENV = 'render';
  process.env.PUBLIC_URL = '';
  
  // Limpar cache do React Scripts
  console.log('🧹 Limpando cache do React Scripts...');
  const buildPath = path.join(__dirname, '..', 'build');
  if (fs.existsSync(buildPath)) {
    fs.rmSync(buildPath, { recursive: true, force: true });
    console.log('🗑️ Pasta build removida');
  }
  
  // Limpar cache do node_modules temporariamente
  console.log('📦 Movendo node_modules para forçar rebuild...');
  const nodeModulesPath = path.join(__dirname, '..', 'node_modules');
  const nodeModulesBackup = path.join(__dirname, '..', 'node_modules.backup');
  
  if (fs.existsSync(nodeModulesPath)) {
    if (fs.existsSync(nodeModulesBackup)) {
      fs.rmSync(nodeModulesBackup, { recursive: true, force: true });
    }
    fs.renameSync(nodeModulesPath, nodeModulesBackup);
    console.log('📦 Node modules movido para backup');
  }
  
  console.log('📦 Build pode prosseguir...');
  console.log('🌍 Ambiente configurado: render');
  console.log('🔗 PUBLIC_URL: (vazio)');
  
  // Restaurar o package.json original após o build
  setTimeout(() => {
    try {
      const backupPath = path.join(__dirname, '..', 'package.json.backup');
      if (fs.existsSync(backupPath)) {
        const backupContent = fs.readFileSync(backupPath, 'utf8');
        fs.writeFileSync(packagePath, backupContent);
        fs.unlinkSync(backupPath); // Remove o arquivo de backup
        console.log('🔄 Package.json original restaurado');
      }
      
      // Restaurar node_modules
      if (fs.existsSync(nodeModulesBackup)) {
        if (fs.existsSync(nodeModulesPath)) {
          fs.rmSync(nodeModulesPath, { recursive: true, force: true });
        }
        fs.renameSync(nodeModulesBackup, nodeModulesPath);
        console.log('🔄 Node modules restaurado');
      }
    } catch (restoreError) {
      console.error('⚠️ Erro ao restaurar arquivos:', restoreError);
    }
  }, 60000); // 60 segundos
  
} catch (error) {
  console.error('❌ Erro ao preparar build para Render:', error);
  process.exit(1);
}
