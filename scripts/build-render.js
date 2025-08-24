const fs = require('fs');
const path = require('path');

console.log('🔧 Preparando build para Render...');
process.env.REACT_APP_ENV = 'render';

try {
  const packagePath = path.join(__dirname, '..', 'package.json');
  const packageRenderPath = path.join(__dirname, '..', 'package-render.json');
  
  // Ler o package.json atual
  const packageContent = fs.readFileSync(packagePath, 'utf8');
  const packageJson = JSON.parse(packageContent);
  
  // Criar um package.json temporário sem homepage
  const packageRender = { ...packageJson };
  delete packageRender.homepage;
  
  // Salvar o package-render.json
  fs.writeFileSync(packageRenderPath, JSON.stringify(packageRender, null, 2));
  
  // Fazer backup do package.json original
  fs.writeFileSync(path.join(__dirname, '..', 'package.json.backup'), packageContent);
  
  // Substituir o package.json pelo package-render.json
  fs.writeFileSync(packagePath, JSON.stringify(packageRender, null, 2));
  
  console.log('✅ Package.json temporário criado sem homepage');
  console.log('📦 Build pode prosseguir...');
  
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
      
      // Remover o package-render.json temporário
      if (fs.existsSync(packageRenderPath)) {
        fs.unlinkSync(packageRenderPath);
        console.log('🗑️ Package-render.json temporário removido');
      }
    } catch (restoreError) {
      console.error('⚠️ Erro ao restaurar package.json:', restoreError);
    }
  }, 60000); // 60 segundos
  
} catch (error) {
  console.error('❌ Erro ao preparar build para Render:', error);
  process.exit(1);
}
