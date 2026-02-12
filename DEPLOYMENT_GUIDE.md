# 🚀 Déploiement Gratuit Africa Shop

## ✅ Configuration Complète (Gratuit)

### FRONTEND - Vercel (5 minutes)

1. **Allez sur**: https://vercel.com/signup
2. **Connectez votre GitHub**: `yassmeissa`
3. **Créez nouveau projet**:
   - Repo: `MonAfricaShop`
   - Framework: Détecte Vite automatiquement ✓
   - Build Command: `npm run build` ✓
   - Output: `frontend/dist` ✓
4. **Cliquez "Deploy"**
5. ✅ Votre site est LIVE ! Copiez l'URL (ex: `https://africa-shop.vercel.app`)

---

### BACKEND - Render.com (10 minutes)

1. **Allez sur**: https://render.com/signup
2. **Connectez GitHub**: `yassmeissa`
3. **Créez Web Service**:
   - Repo: `MonAfricaShop`
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
   - Runtime: Node
4. **Ajouter Variables d'Environnement** (Settings → Environment):
   ```
   MONGO_URI = (voir étape suivante)
   JWT_SECRET = votre_clé_secrete_longue_et_complexe
   FRONTEND_URL = https://africa-shop.vercel.app
   PORT = 5001
   NODE_ENV = production
   ```
5. ✅ Backend déployé ! Copiez l'URL (ex: `https://africa-shop.onrender.com`)

---

### DATABASE - MongoDB Atlas (5 minutes)

1. **Allez sur**: https://www.mongodb.com/cloud/atlas
2. **Sign Up** avec GitHub
3. **Créez Cluster**:
   - Type: Shared (gratuit)
   - Provider: Sélectionnez région proche
   - Nom: `africashop`
4. **Créez Database User**:
   - Username: `admin`
   - Password: `SecurePassword123!`
5. **Copier Connection String**:
   - Cliquez "Connect"
   - Sélectionnez "Drivers"
   - Copiez la chaîne: `mongodb+srv://admin:SecurePassword123!@cluster0.xxxxx.mongodb.net/africashop?retryWrites=true&w=majority`
6. **Ajouter à Render** comme `MONGO_URI`

---

## 🔗 Connecter Frontend + Backend

### Dans Vercel Dashboard:

1. **Settings** → **Environment Variables**
2. Ajouter: 
   ```
   VITE_API_URL = https://africa-shop.onrender.com
   ```
3. **Redéployer** (Auto-redeploy on push)

### Dans votre `frontend/.env.production`:

```
VITE_API_URL=https://africa-shop.onrender.com
```

---

## 🧪 Tester le Déploiement

1. Allez sur `https://africa-shop.vercel.app`
2. Testez:
   - ✓ Voir les produits
   - ✓ Ajouter au panier
   - ✓ Se connecter
3. Si erreur API:
   - Vérifiez `VITE_API_URL` dans Vercel
   - Vérifiez `FRONTEND_URL` dans Render
   - Vérifiez CORS dans backend

---

## 📊 Coûts

| Service | Limite | Coût |
|---------|--------|------|
| **Vercel** | 100GB bande passante | **GRATUIT** |
| **Render** | 750h/mois | **GRATUIT** |
| **MongoDB Atlas** | 512MB (suffisant) | **GRATUIT** |
| **TOTAL** | Illimité pratiquement | **$0 USD** |

---

## 🔴 Problèmes Courants & Solutions

### "API returns 404"
- ✓ Vérifier `VITE_API_URL` dans Vercel
- ✓ Vérifier que backend est running
- ✓ Vérifier les routes `/api/...`

### "CORS Error"
- ✓ Vérifier backend `cors` config
- ✓ Ajouter Vercel URL dans CORS whitelist
- ✓ Redéployer backend

### "Render app stops after 15 mins"
- ✓ Ajouter cron job pour réveiller l'app
- ✓ Ou utiliser Railway (meilleur)

### "MongoDB connection refused"
- ✓ Vérifier `MONGO_URI` est correct
- ✓ Ajouter Render IP dans MongoDB whitelist (0.0.0.0/0)
- ✓ Vérifier credentials

---

## 🎯 Next Steps

1. ✅ Push code vers GitHub
2. ✅ Créer compte MongoDB Atlas
3. ✅ Créer Web Service sur Render
4. ✅ Déployer sur Vercel
5. ✅ Connecter les URLs
6. ✅ Tester le site en ligne !

**Vous êtes maintenant en production !** 🎉
