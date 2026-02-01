# 🎯 Apple Pay & Google Pay - Guide complet

## ✅ Implémentation complète

Apple Pay et Google Pay fonctionnent maintenant via **Stripe Payment Request API**.

## 🔧 Comment ça marche

### Architecture
```
Frontend (ApplePayGooglePay.jsx)
  ↓
Stripe Elements (Payment Request API)
  ↓
Backend (stripeController.js)
  ↓
Stripe Servers
  ↓
Apple Pay / Google Pay
```

### Flux utilisateur

#### Apple Pay
```
1. Utilisateur sélectionne "Apple Pay / Google Pay"
2. Clique "Payer maintenant"
3. Vérifie la disponibilité sur l'appareil
4. Si disponible: Modal Stripe s'affiche
5. Utilisateur approuve avec Face ID / Touch ID
6. Paiement complété
7. Commande créée (status: "paid")
8. Redirection vers confirmation
```

#### Google Pay
```
1. Même flux que Apple Pay
2. Sur Android avec Google Pay installé
3. Biométrie ou PIN
4. Paiement sécurisé
```

## 📱 Disponibilité

### Apple Pay
- ✅ **Safari** sur macOS / iOS
- ✅ **Chrome** sur macOS (avec Apple Pay configuré)
- ❌ Autres navigateurs
- ❌ Android

### Google Pay
- ✅ **Chrome** sur Android
- ✅ **Chrome** sur macOS (avec Google Pay)
- ✅ **Edge**, **Firefox** sur Android (si Google Pay installé)
- ❌ iOS (Apple Pay uniquement)

## 🛠️ Configuration requise

### Pour Apple Pay
1. **Domaine approuvé** - Enregistrer votre domaine chez Apple
2. **HTTPS** - Obligatoire en production
3. **Certificat SSL** - Valide et de confiance
4. **Merchant ID** - Stripe gère automatiquement

### Pour Google Pay
1. **Compte Google Merchant** - Pour accepter les paiements
2. **HTTPS** - Obligatoire en production
3. **Android/Chrome** - Nécessaire pour tester

## 🧪 Tester localement

### Pour Safari sur macOS
```bash
# 1. Démarrer le serveur
npm run dev

# 2. Ouvrir dans Safari
http://localhost:5173

# 3. Aller au checkout
# 4. Sélectionner "Apple Pay / Google Pay"
# 5. Cliquer "Payer maintenant"

# ⚠️ Note: Peut ne pas fonctionner en localhost
# Solution: Utiliser ngrok pour https://abc123.ngrok.io
```

### Pour Chrome sur macOS
```bash
# 1. Apple Pay / Google Pay dans Chrome nécessite macOS Monterey+
# 2. Même localhost limitation
# 3. Préférer Safari pour les tests
```

### Pour Android
```bash
# 1. Tester sur un téléphone Android avec Chrome
# 2. Google Play Services nécessaire
# 3. Google Pay configuré sur l'appareil
# 4. Utiliser ngrok pour HTTPS
```

## ⚙️ Configuration dans le code

### Backend (stripeController.js)
```javascript
// Création de Payment Intent avec les types de paiement
const paymentIntent = await stripe.paymentIntents.create({
  amount: Math.round(total * 100),
  currency: 'eur',
  payment_method_types: ['apple_pay'], // ou ['google_pay']
  metadata: {
    email: customer.email,
    paymentMethod: 'applepay'
  }
});
```

### Frontend (ApplePayGooglePay.jsx)
```javascript
// Vérifier la disponibilité
const canMakePayment = await paymentRequest.canMakePayment();
if (!canMakePayment) {
  // Afficher message, proposer carte bancaire
  setError('Apple Pay n\'est pas disponible...');
}

// Créer Payment Request
const paymentRequest = stripe.paymentRequest({
  country: 'FR',
  currency: 'eur',
  total: { label: 'Montant total', amount: total * 100 }
});
```

## 🔐 Sécurité

✅ **Sécurisé par Stripe**
- Aucune donnée de carte stockée
- 3D Secure inclus automatiquement
- Tokenization côté Stripe
- Conformité PCI-DSS

✅ **Biométrie sécurisée**
- Face ID / Touch ID (Apple)
- Biométrie Android
- PIN Google Pay
- Jamais transmis au serveur

## 🚀 En production

### Étapes requises

1. **Domaines HTTPS** approuvés
   ```
   Stripe Dashboard → Paramètres → Domaines approuvés
   Ajouter: https://votredomaine.com
   ```

2. **Apple Pay**
   - Enregistrer domaine chez Apple
   - Stripe gère automatiquement
   - Certificat SSL valide

3. **Google Pay**
   - Google Merchant Account
   - Production mode dans Stripe
   - Appareils avec Google Play Services

4. **Clés en production**
   ```env
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_PUBLIC_KEY=pk_live_...
   ```

## 📊 Avantages

✅ **Conversion améliorée**
- UX simplifiée
- Paiement rapide (1-2 clics)
- Biométrie intégrée
- +20-30% de conversion vs formulaire

✅ **Sécurité**
- Biométrie requise
- Données isolées
- Pas de formulaire à remplir

✅ **Support large**
- 100+ millions d'utilisateurs Apple
- 1+ milliard d'utilisateurs Google

## 🐛 Dépannage

### "Apple Pay n'est pas disponible"
- Vérifier navigateur (Safari macOS/iOS)
- Vérifier HTTPS en production
- Vérifier domaine approuvé

### "Google Pay n'est pas disponible"
- Vérifier appareil Android
- Vérifier Google Pay installé
- Vérifier HTTPS en production

### "Paiement échoue"
- Vérifier balance Stripe
- Vérifier devise (EUR)
- Vérifier montant > 0

## 📱 Appareils supportés

| Appareil | Navigateur | Apple Pay | Google Pay |
|----------|-----------|-----------|-----------|
| iPhone | Safari | ✅ | ❌ |
| iPhone | Chrome | ❌ | ❌ |
| iPad | Safari | ✅ | ❌ |
| Mac | Safari | ✅ | ❌ |
| Mac | Chrome | ✅ | ❌ |
| Android | Chrome | ❌ | ✅ |
| Android | Firefox | ❌ | ✅* |

*Avec Google Play Services

## 🎯 Prochaines étapes

1. **Tester en production** avec HTTPS
2. **Analytics** - Tracker les paiements par méthode
3. **Notifications** - Email confirmation avec méthode
4. **Dashboard** - Afficher statistiques par méthode
5. **One-click checkout** - Sauvegarder méthode préférée

