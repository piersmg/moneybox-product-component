import React, { useState, useEffect } from 'react';

/**
 * ProductSlider component displays a carousel of product categories and their details
 * Features:
 * - Fetches product data from Google Sheets
 * - Groups products by category
 * - Shows 3 categories at a time with navigation
 * - Expandable product details within each category
 */
const ProductSlider = () => {
    // Store products grouped by category
    const [categorizedProducts, setCategorizedProducts] = useState({});
    // Track which products are expanded to show details
    const [expandedProducts, setExpandedProducts] = useState({});
    // Track current position in the carousel (0 = showing first 3 categories)
    const [currentIndex, setCurrentIndex] = useState(0);

    // Navigate to previous set of categories
    const handlePrevious = () => {
        setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    };

    // Navigate to next set of categories
    // maxIndex ensures we don't scroll past the last visible set
    const handleNext = () => {
        const maxIndex = Object.keys(categorizedProducts).length - 3;
        setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, maxIndex));
    };
    // Google Sheets configuration for product data
    const sheetId = '1f9pf4xQWhEGu9fY_NOBso5s5WyntFhyJzsX7R3yAMXQ';
    const sheetName = 'Sheet1'
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=AIzaSyDBS0VmEjDRJ_21qbTADHz-cn38-yXaZIk`

    // Fetch and process product data on component mount
    useEffect(() => {
        fetch(url)
            .then(response => response.json())
            .then(data => {
            const rows = data.values;
            const products = {};
            const initialExpanded = {};
            
            // Process each row from the spreadsheet
            // Format: [name, icon, description, category]
            // Skip header row (i=1)
            for (let i = 1; i < rows.length; i++) {
                const row = rows[i];
                const [name, icon, description, category] = row;
                
                if (!products[category]) {
                    products[category] = [];
                }
                
                const productId = `${category}-${products[category].length}`;
                initialExpanded[productId] = false;
                
                products[category].push({
                    id: productId,
                    name,
                    icon,
                    description
                });
            }
            
            setCategorizedProducts(products);
            setExpandedProducts(initialExpanded);
        });
    }, []); // Empty dependency array means this effect runs once when component mounts

    return (
        <div className="flex flex-col items-center justify-center w-full">
            {/* Header with Moneybox branding */}
            <h1 className={`w-full pt-2 pb-4 bgfont-serif mb-4 text-4xl font-bold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl bg-[#d2f8f7]`}>
                Moneybox
            </h1>
            <div className="flex items-center gap-4 mb-6">
                <button 
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                    className={`py-[10px] px-[15px] rounded-full text-xl font-bold shadow-lg transition-colors ${
                        currentIndex === 0 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-100' 
                        : 'bg-white border-2 border-[#d2f8f7] text-gray-700 hover:bg-[#d2f8f7]'
                    }`}
                >
                    ←
                </button>
                <p className="text-2xl font-medium">Explore accounts</p>
                <button 
                    onClick={handleNext}
                    disabled={currentIndex >= Object.keys(categorizedProducts).length - 3}
                    className={`py-[10px] px-[15px] rounded-full text-xl font-bold shadow-lg transition-colors ${
                        currentIndex >= Object.keys(categorizedProducts).length - 3
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-100' 
                        : 'bg-white border-2 border-[#d2f8f7] text-gray-700 hover:bg-[#d2f8f7]'
                    }`}
                >
                    →
                </button>
            </div>
            {/* Carousel container with fixed width and overflow handling */}
            <div className="relative w-full max-w-[50rem] overflow-hidden mx-auto">
                {/* Sliding container that moves based on currentIndex */}
                <div 
                    className="flex flex-row gap-4 transition-transform duration-300 ease-in-out mx-auto"
                    style={{ 
                        transform: `translateX(-${currentIndex * (16 + 1.25)}rem)`,
                        width: `${Object.keys(categorizedProducts).length * (16 + 1)}rem`
                    }}
                >
                    {Object.entries(categorizedProducts).map(([category, products]) => (
                    <div key={category} className="p-4 border rounded w-64 min-h-[400px]">
                        <h2 className="font-bold text-lg mb-3">{category}</h2>
                        <div className="space-y-2">{/* Product list container */}
                            {products.map((product) => (
                                <div key={product.id} className="border rounded-lg overflow-hidden">
                                    <button
                                        // Toggle the expanded state for this specific product
                                        // Uses the previous state (prev) to maintain all other products' states and flips the boolean value for the current product using its id
                                        onClick={() => setExpandedProducts(prev => ({
                                            ...prev,
                                            [product.id]: !prev[product.id]
                                        }))}
                                        className="w-full p-3 text-left font-semibold hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span>{product.name}</span>
                                            <span className="transform transition-transform duration-200" 
                                                  style={{ transform: expandedProducts[product.id] ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                                                ▼
                                            </span>
                                        </div>
                                    </button>
                                    <div 
                                        className={`overflow-hidden transition-all duration-200 ease-in-out ${
                                            expandedProducts[product.id] ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                                        }`}
                                    >
                                        <div className="flex gap-4 p-3">
                                    
                                            <img src={`/assets/${product.name.toLowerCase().replace(/ /g, '_')}.svg`} alt={`${product.name} icon`} className="w-8 h-8" />
                                            <p className="text-sm text-gray-600 text-left">{product.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                </div>
            </div>
        </div>
    );
};
  
export default ProductSlider;