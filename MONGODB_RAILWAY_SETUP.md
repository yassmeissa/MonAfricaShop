# 🚀 Configuration MongoDB Gratuit sur Railway

## Option A: Railway MongoDB (Recommandé - Gratuit ⭐)

### Step 1: Créer MongoDB sur Railway

1. Allez sur https://railway.app/new/mongodb
2. Sélectionnez "Add MongoDB"
3. Connexion automatique avec GitHub
4. Attendez que le cluster soit créé (~2 min)

### Step 2: Récupérer la Connection String

1. Dans Railway Dashboard, allez à votre MongoDB service
2. Cliquez sur "Connect"
3. Copiez la variable `MONGODB_URL`
4. Exemple: `mongodb+srv://admin:password@xxxxx.railway.app/...`

### Step 3: Ajouter à Render

1. Allez sur Render Dashboard
2. Sélectionnez votre service `africa-shop-backend`
3. Settings → Environment Variables
4. Modifiez `MONGO_URI`:
   ```
   MONGO_URI=mongodb+srv://admin:password@xxxxx.railway.app/africashop
   ```
5. Cliquez "Save"
6. Render redéploiera automatiquement

### Step 4: Tester

Attendez 2-3 minutes et vérifiez les logs:
```
✓ Server is running on port 5001
✓ MongoDB connected
```

---

## Option B: Exporter données de ta BD locale

Si tu veux garder tes données actuelles:

### 1. Exporter depuis ta BD locale

```bash
# Dans ton terminal
mongoexport --db africashop --collection categories --out categories.json
mongoexport --db africashop --collection products --out products.json
mongoexport --db africashop --collection users --out users.json
mongoexport --db africashop --collection orders --out orders.json
```

### 2. Importer dans Railway MongoDB

```bash
# Remplace YOUR_MONGO_URI par celle de Railway
mongoimport --uri "YOUR_MONGO_URI" --collection categories --file categories.json --jsonArray
mongoimport --uri "YOUR_MONGO_URI" --collection products --file products.json --jsonArray
mongoimport --uri "YOUR_MONGO_URI" --collection users --file users.json --jsonArray
mongoimport --uri "YOUR_MONGO_URI" --collection orders --file orders.json --jsonArray
```

---

## Option C: Utiliser PostgrSQL gratuit sur Render

Si tu veux changer de BD vers PostgreSQL:

### 1. Créer PostgreSQL sur Render
- Render Dashboard → New + → PostgreSQL
- Type: Free (gratuit)
- Render génère la connection string automatiquement

### 2. Modifier ton backend pour PostgreSQL
- Installer driver: `npm install pg sequelize`
- Remplacer mongoose par Sequelize

---

## ⚙️ Coûts Finaux Gratuit

| Service | BD | Coût |
|---------|-----|------|
| **Vercel** | Frontend | **$0** |
| **Render** | Backend | **$0** |
| **Railway** | MongoDB | **$0** (crédit gratuit) |
| **TOTAL** | Complet | **$0 USD** |

---

## 🎯 Mon Recommandation

1. ✅ Va sur https://railway.app/new/mongodb
2. ✅ Copie le `MONGO_URI`
3. ✅ Mets-le dans Render Environment Variables
4. ✅ Redéploie
5. ✅ C'est tout ! 🎉

Besoin d'aide pour copier le `MONGO_URI` de Railway ? 🤔
