# Instruções de Deploy

Este projeto foi configurado para funcionar corretamente em múltiplos ambientes: GitHub Pages, Render e desenvolvimento local.

## 🔧 Configuração Automática

O projeto detecta automaticamente o ambiente e configura os caminhos corretamente através de scripts JavaScript que são carregados antes do React.

## 📁 Scripts de Build

### Para Render (Produção)
```bash
npm run build-render
```
- Remove a configuração de `homepage` do package.json
- Gera caminhos relativos para assets
- Otimizado para deploy no Render

### Para GitHub Pages
```bash
npm run build-gh
```
- Define `homepage: "https://robgomezsir.github.io/meu-proposito-app"`
- Gera caminhos absolutos para assets
- Otimizado para deploy no GitHub Pages

### Para Desenvolvimento Local
```bash
npm run build-local
```
- Remove a configuração de `homepage` do package.json
- Gera caminhos relativos para assets
- Otimizado para desenvolvimento local

## 🚀 Deploy

### Render
1. Execute: `npm run build-render`
2. Faça upload da pasta `build/` para o Render
3. O Render detectará automaticamente que é uma SPA e configurará as rotas

### GitHub Pages
1. Execute: `npm run build-gh`
2. Faça commit e push para o branch `main`
3. O GitHub Actions fará o deploy automaticamente

### Desenvolvimento Local
1. Execute: `npm run build-local`
2. Use um servidor estático como `serve -s build`

## 🔍 Como Funciona

### 1. Detecção de Ambiente
O arquivo `public/build-config.js` detecta automaticamente o ambiente baseado no hostname e pathname.

### 2. Correção de Caminhos
- **GitHub Pages**: Mantém caminhos absolutos (`/meu-proposito-app/static/...`)
- **Render**: Converte para caminhos relativos (`./static/...`)
- **Local**: Usa caminhos relativos

### 3. Configuração Dinâmica
Os arquivos de configuração são carregados na seguinte ordem:
1. `build-config.js` - Configuração principal
2. `render-config.js` - Configurações específicas do Render
3. `gh-pages-config.js` - Configurações específicas do GitHub Pages

## 🐛 Solução de Problemas

### Página Branca
Se a página aparecer em branco:

1. **Verifique o console do navegador** para erros de JavaScript
2. **Verifique a aba Network** para falhas no carregamento de assets
3. **Confirme que o build correto foi usado** para o ambiente

### Assets Não Carregam
Se os arquivos CSS/JS não carregarem:

1. **GitHub Pages**: Verifique se o build foi feito com `npm run build-gh`
2. **Render**: Verifique se o build foi feito com `npm run build-render`
3. **Verifique os caminhos** no arquivo `build/index.html`

### Rotas Não Funcionam
Se as rotas não funcionarem:

1. **Verifique se o arquivo `_redirects` está presente** na pasta build
2. **Confirme que o servidor está configurado para SPA**
3. **Teste com rotas diretas** (ex: `/dashboard`)

## 📝 Arquivos de Configuração

- `public/build-config.js` - Configuração principal de ambiente
- `public/render-config.js` - Configurações específicas do Render
- `public/gh-pages-config.js` - Configurações específicas do GitHub Pages
- `scripts/deploy-config.js` - Script de configuração automática
- `public/_redirects` - Configuração de rotas para SPA

## 🔄 Atualizações

Para atualizar o deploy:

1. **Faça as alterações no código**
2. **Execute o build correto** para o ambiente
3. **Faça o deploy** seguindo as instruções específicas
4. **Teste a aplicação** no ambiente de produção

## 📞 Suporte

Se encontrar problemas:

1. **Verifique os logs** do console do navegador
2. **Confirme o ambiente** e o build usado
3. **Teste localmente** primeiro
4. **Verifique a documentação** do serviço de deploy
