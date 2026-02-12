#!/bin/bash

# Script pour exporter et importer les données MongoDB locales

echo "🔄 Exporter données depuis MongoDB local..."
mongoexport --db africashop --collection categories --out categories.json
mongoexport --db africashop --collection products --out products.json
mongoexport --db africashop --collection users --out users.json
mongoexport --db africashop --collection orders --out orders.json

echo "✅ Données exportées !"
echo "Fichiers générés: categories.json, products.json, users.json, orders.json"
echo ""
echo "Ensuite, importe-les dans MongoDB Atlas ou Railway avec:"
echo "mongoimport --uri 'YOUR_MONGO_URI' --collection categories --file categories.json"
