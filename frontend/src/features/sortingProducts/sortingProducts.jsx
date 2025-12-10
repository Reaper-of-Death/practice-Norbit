export const sortingProducts = (products = [], filters = {}) => {
    const {
        sortBy = 'default',
        minPrice = '',
        maxPrice = '',
        searchQuery = ''
    } = filters;

    let filteredProducts = [...products];

    if (minPrice !== '') {
        const min = parseInt(minPrice);
        filteredProducts = filteredProducts.filter(product => {
            const price = product.discountPrice || product.price;
            return price >= min;
        });
    }

    if (maxPrice !== '') {
        const max = parseInt(maxPrice);
        filteredProducts = filteredProducts.filter(product => {
            const price = product.discountPrice || product.price;
            return price <= max;
        });
    }

    if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        filteredProducts = filteredProducts.filter(product =>
            product.name.toLowerCase().includes(query)
        );
    }

    switch(sortBy) {
        case 'price_asc':
            return filteredProducts.sort((a, b) => {
                const priceA = a.discountPrice || a.price;
                const priceB = b.discountPrice || b.price;
                return priceA - priceB;
            });
            
        case 'price_desc':
            return filteredProducts.sort((a, b) => {
                const priceA = a.discountPrice || a.price;
                const priceB = b.discountPrice || b.price;
                return priceB - priceA;
            });
            
        case 'discount':
            return filteredProducts.sort((a, b) => {
                const hasDiscountA = a.discountPrice && a.discountPrice > 0;
                const hasDiscountB = b.discountPrice && b.discountPrice > 0;
                
                if (hasDiscountA && !hasDiscountB) return -1;
                if (!hasDiscountA && hasDiscountB) return 1;
                
                const priceA = a.discountPrice || a.price;
                const priceB = b.discountPrice || b.price;
                return priceA - priceB;
            });
            
        case 'name_asc':
            return filteredProducts.sort((a, b) => 
                a.name.localeCompare(b.name)
            );
            
        case 'name_desc':
            return filteredProducts.sort((a, b) => 
                b.name.localeCompare(a.name)
            );
            
        default:
            return filteredProducts;
    }
};