# 🔒 Tester Apple Pay & Google Pay en local avec ngrok

## Pourquoi ngrok?

Apple Pay et Google Pay nécessitent **HTTPS** même en développement. 
`http://localhost:5173` ne fonctionne **pas** pour ces méthodes.

**Solution: ngrok crée un tunnel HTTPS vers votre localhost**

## 📦 Installation

### macOS (via Homebrew)
```bash
brew install ngrok
```

### Avec npm
```bash
npm install -g ngrok
```

### Ou télécharger depuis
https://ngrok.com/download

## 🚀 Utilisation

### Étape 1: Démarrer votre application
```bash
cd /Users/yassmeissa/shop/frontend
npm run dev

# Frontend tourne sur http://localhost:5173
```

### Étape 2: Démarrer ngrok
```bash
ngrok http 5173
```

### Résultat
```
Session Status                online                                   
Account                       Free Account
Version                        3.0.0
Region                         United States (us)
Forwarding                     https://abc123def456.ngrok.io -> http://localhost:5173
```

### Étape 3: Utiliser l'URL ngrok
```
https://abc123def456.ngrok.io
```

## ✅ Tester Apple Pay

### Sur Safari macOS

1. **Ouvrir** https://abc123def456.ngrok.io
2. **Chercher** le produit de test (0.1€)
3. **Ajouter au panier**
4. **Aller au checkout**
5. **Sélectionner** "Apple Pay / Google Pay"
6. **Cliquer** "Payer maintenant"
7. **Approuver** avec Face ID / Touch ID
8. ✅ **Paiement réussi**

### Sur iPhone/iPad

```bash
# 1. Même processus que macOS
# 2. Ouvrir Safari sur iPhone
# 3. Entrer https://abc123def456.ngrok.io
# 4. Continuer le checkout
```

## ✅ Tester Google Pay

### Sur Android

```bash
# 1. Avoir Google Play Services installé
# 2. Avoir Google Pay configuré
# 3. Ouvrir Chrome sur Android
# 4. Entrer https://abc123def456.ngrok.io
# 5. Faire le checkout
# 6. Sélectionner "Apple Pay / Google Pay"
# 7. Approuver avec biométrie
```

### Sur émulateur Android

```bash
# 1. Démarrer émulateur Android Studio
# 2. Configurer Google Play Services
# 3. Configurer Google Pay
# 4. Ouvrir Chrome
# 5. Entrer https://abc123def456.ngrok.io (remapper localhost)
```

## 🔐 Authtoken ngrok (optionnel)

Pour un tunnel permanent avec ngrok free:

```bash
# 1. Créer compte sur https://dashboard.ngrok.com/signup
# 2. Copier votre authtoken
# 3. Ajouter dans ~/.ngrok2/ngrok.yml
authtokens:
  - "xxx_votre_token_xxx"

# 4. Redémarrer ngrok
ngrok http 5173
```

## 🛠️ Troubleshooting

### ngrok refuse la connexion
```bash
# Vérifier que le serveur frontend tourne
lsof -i :5173

# Si non, démarrer
cd /Users/yassmeissa/shop/frontend
npm run dev
```

### Domaine ngrok change à chaque fois
- **Free tier** - Domaine aléatoire
- **Payant** - Domaine personnalisé stable
- Solution gratuite: garder ngrok actif

### "Le certificat n'est pas de confiance"
- Cliquer "Autoriser" ou "Ignorer"
- ngrok utilise certificat auto-signé

### Apple Pay ne s'affiche pas
- Vérifier que vous êtes sur **Safari**
- Vérifier **HTTPS** (pas http://)
- Vérifier le domaine est approuvé (Stripe)

### Google Pay ne s'affiche pas
- Vérifier **Android** avec Google Pay
- Vérifier **Google Play Services** installé
- Vérifier **HTTPS**

## 📊 Vérifier la connexion

### Via ngrok Web Inspector
```bash
# Ouvrir un autre terminal
http://127.0.0.1:4040

# Voir toutes les requêtes HTTP/HTTPS
# Logs des paiements
# Vérifier les headers
```

## 🎯 Workflow complet

```bash
# Terminal 1 - Backend
cd /Users/yassmeissa/shop/backend
npm run dev

# Terminal 2 - Frontend
cd /Users/yassmeissa/shop/frontend
npm run dev

# Terminal 3 - ngrok
ngrok http 5173

# Terminal 4 (optionnel) - ngrok inspector
http://127.0.0.1:4040
```

## 📱 URLs à tester

```
https://abc123def456.ngrok.io          # Accueil
https://abc123def456.ngrok.io/products # Produits
https://abc123def456.ngrok.io/cart     # Panier
https://abc123def456.ngrok.io/checkout # Paiement
```

## ✨ Tips & Tricks

### Garder le domaine ngrok stable
```bash
# Upgrade vers ngrok pro (payant)
# Ou utiliser alternative gratuite: localhost.run

ssh -R 80:localhost:5173 ssh.localhost.run
```

### Partager avec d'autres
```bash
# Votre URL ngrok peut être partagée
https://abc123def456.ngrok.io

# Autres peuvent tester vos paiements
# Mais garder secret le domaine!
```

### Firewall
```bash
# Si ngrok ne fonctionne pas
# Vérifier les pare-feu local
# Ou utiliser: ngrok http -host-header=localhost:5173 5173
```

## 🔗 Ressources

- https://ngrok.com/docs
- https://stripe.com/docs/stripe-js/payment-request-button
- https://developer.apple.com/apple-pay/web/
- https://developers.google.com/pay/api/web

