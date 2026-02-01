import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <div className="relative bg-gradient-to-br from-green-50 via-orange-50 to-yellow-50 overflow-hidden">
      {/* Motifs décoratifs africains */}
      <div className="absolute inset-0 opacity-5">
        <svg className="absolute top-0 left-0 w-64 h-64" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" fill="rgba(249, 115, 22, 0.1)"/>
          <circle cx="50" cy="50" r="25" stroke="currentColor" strokeWidth="1" fill="rgba(34, 197, 94, 0.1)"/>
        </svg>
        <svg className="absolute bottom-0 right-0 w-80 h-80 transform rotate-45" viewBox="0 0 100 100">
          <polygon points="50,5 90,25 90,75 50,95 10,75 10,25" stroke="currentColor" strokeWidth="1" fill="rgba(249, 115, 22, 0.1)"/>
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Contenu textuel */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Saveurs{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-orange-500">
                Authentiques
              </span>
              {' '}d'Afrique
            </h1>
            <p className="mt-6 text-xl text-gray-600 leading-relaxed">
              Découvrez les épices, fruits exotiques et spécialités culinaires d'Afrique. 
              Livraison rapide partout en France pour des saveurs qui racontent une histoire.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/products"
                className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-full text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Explorer la boutique
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center px-8 py-4 border-2 border-orange-500 text-lg font-medium rounded-full text-orange-600 hover:bg-orange-50 transition-all duration-200"
              >
                Notre histoire
              </Link>
            </div>
            
            {/* Statistiques */}
            <div className="mt-12 grid grid-cols-3 gap-4 text-center lg:text-left">
              <div>
                <div className="text-2xl font-bold text-green-600">500+</div>
                <div className="text-gray-600">Produits</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-500">24h</div>
                <div className="text-gray-600">Livraison</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">5000+</div>
                <div className="text-gray-600">Clients satisfaits</div>
              </div>
            </div>
          </div>

          {/* Images produits */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-white rounded-2xl shadow-xl p-4 transform rotate-2 hover:rotate-0 transition-transform duration-300">
                  <img
                    src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80"
                    alt="Épices africaines"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <p className="mt-2 text-sm font-medium text-gray-800">Épices authentiques</p>
                </div>
                <div className="bg-white rounded-2xl shadow-xl p-4 transform -rotate-1 hover:rotate-0 transition-transform duration-300">
                  <img
                    src="https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=400&q=80"
                    alt="Fruits exotiques"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <p className="mt-2 text-sm font-medium text-gray-800">Fruits exotiques</p>
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="bg-white rounded-2xl shadow-xl p-4 transform -rotate-2 hover:rotate-0 transition-transform duration-300">
                  <img
                    src="https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=400&q=80"
                    alt="Céréales africaines"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <p className="mt-2 text-sm font-medium text-gray-800">Céréales & légumineuses</p>
                </div>
                <div className="bg-white rounded-2xl shadow-xl p-4 transform rotate-1 hover:rotate-0 transition-transform duration-300">
                  <img
                    src="https://images.unsplash.com/photo-1556909114-3e8678aa04d5?auto=format&fit=crop&w=400&q=80"
                    alt="Condiments"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <p className="mt-2 text-sm font-medium text-gray-800">Condiments & sauces</p>
                </div>
              </div>
            </div>

            {/* Badge flottant */}
            <div className="absolute -top-4 -right-4 bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
              🎉 Nouveau !
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
