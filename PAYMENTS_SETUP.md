# Guide d'intégration des paiements

## 🔐 Configuration Stripe

### Étapes :
1. Créer un compte sur [Stripe](https://stripe.com)
2. Aller dans **Développeurs > Clés API**
3. Copier votre clé secrète de test (commence par `sk_test_`)
4. Copier votre clé publique de test (commence par `pk_test_`)

### Backend `.env` :
```
STRIPE_SECRET_KEY=sk_test_votre_clé_secrète
STRIPE_PUBLIC_KEY=pk_test_votre_clé_publique
```

### Frontend `.env` :
```
VITE_STRIPE_PUBLIC_KEY=pk_test_votre_clé_publique
```

## 🅿️ Configuration PayPal

### Étapes :
1. Créer un compte sur [PayPal Developer](https://developer.paypal.com)
2. Aller dans **Applications & Credentials**
3. Sélectionner **Sandbox**
4. Copier votre **Client ID** et **Client Secret**

### Backend `.env` :
```
PAYPAL_CLIENT_ID=votre_client_id
PAYPAL_CLIENT_SECRET=votre_client_secret
PAYPAL_MODE=sandbox
```

## 📋 Flux de paiement

### Stripe (Carte bancaire)
1. Utilisateur sélectionne "Carte bancaire"
2. Clique sur "Payer maintenant"
3. Modal Stripe s'affiche
4. Utilisateur entre ses données
5. Paiement processé sécurisément par Stripe
6. Commande créée en base de données
7. Redirection vers confirmation

### PayPal
1. Utilisateur sélectionne "PayPal"
2. Clique sur "Payer maintenant"
3. Modal PayPal s'affiche
4. Clique "Continuer vers PayPal"
5. Redirection vers PayPal pour approbation
6. Après approbation, redirection vers `/payment-success`
7. Paiement capturé et commande créée
8. Redirection vers confirmation

### Apple Pay / Google Pay
- À venir (actuellement placeholder)

## 🧪 Cartes de test Stripe

Pour tester sans argent réel :

| Scénario | Numéro | Expiration | CVC |
|----------|--------|-----------|-----|
| Succès | 4242 4242 4242 4242 | 12/25 | 123 |
| Déclinée | 4000 0000 0000 0002 | 12/25 | 123 |
| 3D Secure | 4000 0025 0000 3155 | 12/25 | 123 |

## ⚙️ Variables d'environnement requises

### Backend
- `STRIPE_SECRET_KEY` - Clé secrète Stripe
- `STRIPE_PUBLIC_KEY` - Clé publique Stripe
- `PAYPAL_CLIENT_ID` - ID client PayPal
- `PAYPAL_CLIENT_SECRET` - Secret client PayPal
- `PAYPAL_MODE` - Mode : "sandbox" ou "live"

### Frontend
- `VITE_STRIPE_PUBLIC_KEY` - Clé publique Stripe (commence par `pk_`)

## 📝 Notes de sécurité

⚠️ **IMPORTANT**
- Ne jamais committer les vraies clés API dans Git
- Utiliser `.env` local (non trackée par Git)
- En production, utiliser des variables d'environnement sécurisées
- Les données de carte ne sont jamais stockées côté serveur
- Toujours utiliser HTTPS en production
- Les paiements sont traités directement par Stripe/PayPal

## 🔗 URLs de callback

Le système redirige automatiquement vers :
- Succès PayPal : `/payment-success?token=ORDER_ID`
- Annulation PayPal : `/payment-cancel`

## 🐛 Dépannage

### "Clé Stripe invalide"
→ Vérifier que `VITE_STRIPE_PUBLIC_KEY` commence par `pk_test_`

### "Impossible de créer la commande PayPal"
→ Vérifier les IDs PayPal et que le mode est "sandbox"

### "Paiement non confirmé"
→ Vérifier que le statut du paiement est "succeeded" sur Stripe

