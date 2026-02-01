# 🧪 Guide de test des paiements

## ✅ Produit de test créé

Un produit de test à **0.1€** a été ajouté à la base de données :
- **Nom** : Produit Test 0.1€
- **Prix** : 0.1€
- **Catégorie** : Test
- **Stock** : 100 unités

## 🚀 Démarrage des serveurs

### Terminal 1 - Backend
```bash
cd /Users/yassmeissa/shop/backend
npm run dev
```
Le serveur doit écouter sur **http://localhost:5001**

### Terminal 2 - Frontend
```bash
cd /Users/yassmeissa/shop/frontend
npm run dev
```
Le serveur doit être sur **http://localhost:5173**

## 🧪 Scénario de test

### 1. Accéder à l'application
```
http://localhost:5173
```

### 2. Ajouter le produit de test au panier
- Cliquer sur "Produits"
- Chercher "Produit Test 0.1€"
- Ajouter 1 exemplaire au panier
- Total : 0.1€ 💰

### 3. Aller au panier
- Cliquer sur le panier
- Voir le produit avec 0.1€

### 4. Procéder au paiement
- Cliquer "Continuer vers le paiement"
- Choisir authentification : "Continuer en tant qu'invité"
- Remplir les informations (nom, email, adresse, etc.)

### 5. Tester Stripe (carte bancaire)
1. Sélectionner "💳 Carte bancaire"
2. Cliquer "Payer maintenant"
3. Une modale Stripe s'affiche
4. Entrer une carte de test :
   - **Numéro** : 4242 4242 4242 4242
   - **Expiration** : 12/25
   - **CVC** : 123
   - **Nom** : Votre nom
5. Cliquer "Payer"
6. ✅ Redirection vers confirmation

### 6. Tester PayPal (recommencé)
1. Retourner au panier
2. Recommencer le checkout
3. Sélectionner "🅿️ PayPal"
4. Cliquer "Payer maintenant"
5. Cliquer "Continuer vers PayPal"
6. ⚠️ **IMPORTANT** : Vous serez redirigé vers PayPal
   - Actuellement sans clés réelles, cela ne fonctionnera pas complètement
   - Mais le flux est implémenté et fonctionnera avec les vraies clés

## ⚙️ Configuration des clés réelles

### Pour Stripe
1. Aller sur https://dashboard.stripe.com
2. Récupérer :
   - Clé secrète (sk_test_...)
   - Clé publique (pk_test_...)
3. Mettre à jour :
   - Backend `.env` : STRIPE_SECRET_KEY et STRIPE_PUBLIC_KEY
   - Frontend `.env` : VITE_STRIPE_PUBLIC_KEY

### Pour PayPal
1. Aller sur https://developer.paypal.com
2. Créer une application Sandbox
3. Récupérer :
   - Client ID
   - Client Secret
4. Mettre à jour Backend `.env` :
   - PAYPAL_CLIENT_ID
   - PAYPAL_CLIENT_SECRET
   - PAYPAL_MODE=sandbox

## 📊 Flux attendu pour Stripe

```
1. Ajouter produit (0.1€) → Panier
2. Checkout → Formulaire adresse
3. Paiement → Modal Stripe
4. Carte test 4242... → Succès
5. Confirmation d'ordre → Affichage des détails
```

## 📊 Flux attendu pour PayPal

```
1. Ajouter produit (0.1€) → Panier
2. Checkout → Formulaire adresse
3. Paiement → Modal PayPal
4. Cliquer "Continuer vers PayPal"
5. Redirection PayPal (avec vraies clés)
6. Approval → /payment-success?token=...
7. Confirmation d'ordre
```

## 🐛 Dépannage

### "Impossible de créer la commande"
- Vérifier que le backend tourne sur le port 5001
- Vérifier la console du navigateur pour plus de détails

### "Clé Stripe invalide"
- Vérifier que `VITE_STRIPE_PUBLIC_KEY` commence par `pk_`
- Redémarrer le frontend après changement du `.env`

### "Erreur lors de la création du paiement"
- Les clés de test doivent commencer par `sk_test_` et `pk_test_`
- Vérifier que MongoDB est connecté (voir logs du backend)

### Le produit de test n'apparaît pas
- Vérifier la base de données avec MongoDB Compass
- Re-exécuter : `node seedTestProduct.js`

## 💾 Données de test

### Formulaire d'adresse (exemple)
```
Prénom: Jean
Nom: Dupont
Email: jean@example.com
Téléphone: +33612345678
Adresse: 123 Rue de Test
Complément: Apt 5
Ville: Paris
Code postal: 75001
Pays: France
```

### Cartes Stripe de test
| Cas | Numéro | Expiration | CVC |
|-----|--------|-----------|-----|
| ✅ Succès | 4242 4242 4242 4242 | 12/25 | 123 |
| ❌ Déclinée | 4000 0000 0000 0002 | 12/25 | 123 |
| 🔒 3D Secure | 4000 0025 0000 3155 | 12/25 | 123 |

## ✨ Après le test réussi

Si Stripe fonctionne bien, la base de données devrait avoir :
- ✅ Une commande créée
- ✅ Statut : "paid" (pas "pending")
- ✅ Stripe Payment Intent ID sauvegardé

Vérifier dans MongoDB :
```javascript
db.orders.find().pretty()
```

