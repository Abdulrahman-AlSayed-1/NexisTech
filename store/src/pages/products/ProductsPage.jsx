import { useEffect, useState } from "react";
import { Heart, Star, ShoppingCart } from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  
  const [localWishlist, setLocalWishlist] = useState([]);

  const mockProducts = [
    { id: 1, title: "Apple iPhone 12 Pro", price: 999, category: "Smartphones", rating: 5, image: "https://unsplash.com" },
    { id: 2, title: "Apple iPhone 12 Max", price: 1099, category: "Smartphones", rating: 4, image: "https://unsplash.com" },
    { id: 3, title: "Realme 8", price: 299, category: "Smartphones", rating: 5, image: "https://unsplash.com" },
    { id: 4, title: "Gaming Laptop Pro", price: 1499, category: "Laptops & PCs", rating: 4, image: "https://unsplash.com" },
  ];

  useEffect(() => {
    setProducts(mockProducts);
    setFilteredProducts(mockProducts);
    setLoading(false);
  }, []);

  useEffect(() => {
    let result = products;
    if (selectedCategory !== "All") {
      result = result.filter((p) => p.category === selectedCategory);
    }
    if (searchQuery) {
      result = result.filter((p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredProducts(result);
  }, [searchQuery, selectedCategory, products]);

  // دالة الإضافة الآمنة مؤقتاً لحين معرفة ملفات الـ Redux
  const handleAddToCart = (product) => {
    
  };

// دالة تغيير حالة القلب الآمنة
  const handleToggleWishlist = (product) => {

    setLocalWishlist((prev) =>
      prev.includes(product.id)
        ? prev.filter((id) => id !== product.id)
        : [...prev, product.id]
    );
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-12 w-full">
      <div className="bg-gradient-to-r from-[#1e293b] to-[#0f172a] text-white py-16 px-6 text-center mb-8 shadow-inner">
        <h1 className="text-4xl font-extrabold mb-3 tracking-tight">Product Catalog</h1>
        <p className="text-slate-400 text-sm max-w-md mx-auto">
          Explore our premium tech collection with official warranty and express shipping.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-48 bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:border-[#d97706] transition-colors"
          >
            <option value="All">All Categories</option>
            <option value="Smartphones">Smartphones</option>
            <option value="Laptops & PCs">Laptops & PCs</option>
          </select>

          <div className="relative w-full sm:w-96">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-gray-200 rounded-xl pl-4 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#d97706] transition-colors"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center text-slate-500 py-12">Loading amazing tech...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const isFavorite = localWishlist.includes(product.id);
              return (
                <div key={product.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden group hover:shadow-md transition-all relative">
                  <button
                    onClick={() => handleToggleWishlist(product)}
                    className="absolute top-3 right-3 z-10 p-2 bg-white rounded-full shadow-sm hover:scale-110 transition-transform border border-gray-50"
                  >
                    <Heart size={18} className={isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"} />
                  </button>

                  <div className="p-6 bg-slate-50 flex justify-center items-center h-48">
                    <img src={product.image} alt={product.title} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-200" />
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-xs text-slate-400 uppercase block mb-1 font-medium">{product.category}</span>
                      <h3 className="font-semibold text-slate-800 text-sm mb-2 line-clamp-2">{product.title}</h3>
                      <div className="flex items-center gap-0.5 mb-3">
                        {Array.from({ length: product.rating }).map((_, i) => (
                          <Star key={i} size={14} className="fill-[#eab308] text-[#eab308]" />
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-100">
                      <span className="text-base font-bold text-slate-900">${product.price}</span>
                      <button 
                        onClick={() => handleAddToCart(product)}
                        className="bg-[#1e3a1e] hover:bg-[#eab308] text-white hover:text-slate-950 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
                      >
                        <ShoppingCart size={14} />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}