# 🚀 Deploy LightIMG na Vercel

## Guia Passo a Passo

### 1️⃣ Preparação (Já Feito ✅)

- ✅ Código commitado no GitHub
- ✅ `vercel.json` configurado
- ✅ `vite.config.ts` otimizado
- ✅ Build testado localmente

### 2️⃣ Deploy via Vercel Dashboard

#### Opção A: Via Interface Web (Recomendado)

1. **Acesse**: https://vercel.com
2. **Login**: Use sua conta GitHub
3. **New Project**: Clique em "Add New" → "Project"
4. **Import Repository**: 
   - Selecione `adriancantero-stack/lightimg-app`
   - Clique em "Import"

5. **Configure Project**:
   ```
   Framework Preset: Vite
   Root Directory: ./
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

6. **Environment Variables** (se necessário):
   ```
   NODE_VERSION=18
   ```

7. **Deploy**: Clique em "Deploy"

#### Opção B: Via Vercel CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Seguir prompts:
# - Set up and deploy? Yes
# - Which scope? Sua conta
# - Link to existing project? No
# - Project name? lightimg-app
# - Directory? ./
# - Override settings? No

# Deploy para produção
vercel --prod
```

### 3️⃣ Configurações Importantes

#### Build Settings na Vercel

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "devCommand": "npm run dev"
}
```

#### Environment Variables (Opcional)

Se precisar de variáveis de ambiente:
```
NODE_VERSION=18
VITE_API_URL=https://your-app.vercel.app
```

### 4️⃣ Verificação Pós-Deploy

Após o deploy, verificar:

- ✅ Homepage carrega corretamente
- ✅ Upload de imagens funciona
- ✅ Compressão funciona
- ✅ Download funciona
- ✅ Navegação entre páginas
- ✅ Troca de idioma
- ✅ Responsividade (mobile/tablet)

### 5️⃣ Custom Domain (Opcional)

1. **Na Vercel Dashboard**:
   - Settings → Domains
   - Add Domain
   - Digite seu domínio (ex: lightimg.com)
   - Siga instruções de DNS

2. **Configurar DNS**:
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

### 6️⃣ Performance Optimization

A Vercel já otimiza automaticamente:
- ✅ CDN global
- ✅ Gzip/Brotli compression
- ✅ HTTP/2
- ✅ Edge caching
- ✅ Automatic HTTPS

### 7️⃣ Monitoramento

**Vercel Analytics** (Opcional):
```bash
npm install @vercel/analytics
```

Adicionar em `index.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react';

// No componente raiz
<Analytics />
```

### 8️⃣ Troubleshooting

#### Erro: Build Failed

```bash
# Testar build localmente
npm run build

# Verificar logs na Vercel
# Dashboard → Deployments → Ver logs
```

#### Erro: API não funciona

Verificar `vercel.json`:
- Routes estão corretas?
- Backend está em `/server/index.ts`?

#### Erro: 404 em rotas

Verificar `vercel.json`:
- Rewrites configurados?
- SPA fallback para `/index.html`?

### 9️⃣ Continuous Deployment

**Já configurado automaticamente!**

Cada push para `main` → Deploy automático na Vercel

```bash
# Fazer mudanças
git add .
git commit -m "feat: nova feature"
git push origin main

# Vercel detecta e faz deploy automaticamente
```

### 🔟 URLs Após Deploy

Você receberá:
- **Production**: `lightimg-app.vercel.app`
- **Preview**: `lightimg-app-git-branch.vercel.app` (para cada branch)

---

## 📋 Checklist de Deploy

### Antes do Deploy
- [x] Código commitado no GitHub
- [x] Build testado localmente (`npm run build`)
- [x] Health check passou (`npm run check:all`)
- [x] `vercel.json` criado
- [x] `vite.config.ts` otimizado

### Durante o Deploy
- [ ] Conta Vercel criada/logada
- [ ] Projeto importado do GitHub
- [ ] Configurações verificadas
- [ ] Deploy iniciado

### Após o Deploy
- [ ] URL de produção funcionando
- [ ] Todas as features testadas
- [ ] Performance verificada
- [ ] Erros monitorados

---

## 🎯 Próximos Passos Após Deploy

1. **Testar em Produção**
   - Abrir URL da Vercel
   - Testar upload/compressão
   - Verificar todos os formatos

2. **Configurar Domain** (Opcional)
   - Comprar domínio
   - Configurar DNS
   - Adicionar na Vercel

3. **Monitoramento** (Opcional)
   - Vercel Analytics
   - Error tracking (Sentry)
   - Performance monitoring

4. **SEO** (Opcional)
   - Google Search Console
   - Sitemap
   - Meta tags

---

## 💡 Dicas

- **Preview Deployments**: Cada PR cria um preview automático
- **Rollback**: Fácil voltar para deploy anterior
- **Logs**: Acesse logs em tempo real na dashboard
- **Cache**: Vercel faz cache automático de assets
- **Edge Network**: CDN global automático

---

## 🆘 Suporte

- **Vercel Docs**: https://vercel.com/docs
- **Vite Docs**: https://vitejs.dev/guide/
- **GitHub Repo**: https://github.com/adriancantero-stack/lightimg-app

---

**Pronto para deploy!** 🚀

Basta seguir os passos acima e em poucos minutos sua aplicação estará no ar!
