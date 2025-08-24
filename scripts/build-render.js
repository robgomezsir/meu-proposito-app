const fs = require('fs');
const path = require('path');

console.log('🔧 Preparando build para Render...');

// Caminho para o package.json
const packagePath = path.join(__dirname, '..', 'package.json');

try {
  // Ler o package.json atual
  const packageContent = fs.readFileSync(packagePath, 'utf8');
  const packageJson = JSON.parse(packageContent);
  
  // Salvar o homepage original
  const originalHomepage = packageJson.homepage;
  
  // Remover o homepage para o build do Render
  delete packageJson.homepage;
  
  // Salvar o package.json modificado
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
  
  console.log('✅ Campo homepage removido para build do Render');
  console.log('📦 Build pode prosseguir...');
  
  // Restaurar o homepage após um delay (para dar tempo do build terminar)
  setTimeout(() => {
    packageJson.homepage = originalHomepage;
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
    console.log('🔄 Campo homepage restaurado');
  }, 30000); // 30 segundos
  
} catch (error) {
  console.error('❌ Erro ao modificar package.json:', error);
  process.exit(1);
}
