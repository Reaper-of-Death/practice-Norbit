/**
 * Генерирует уникальный ключ для товара
 * @param {Object} product - Объект товара
 * @param {number} index - Индекс в массиве
 * @returns {string} Уникальный ключ
 */
export function generateProductKey(product, index) {
    if (!product) return `product-${index}-${Date.now()}`;
    
    // Используем комбинацию ID, имени и индекса для уникальности
    const id = product.id || index;
    const name = product.name ? product.name.replace(/\s+/g, '-') : 'product';
    
    return `${id}-${name}-${index}`;
}

/**
 * Проверяет массив товаров на уникальность ID
 * @param {Array} productsArray - Массив товаров
 * @returns {Object} Результат проверки {hasDuplicates: boolean, duplicates: Array}
 */
export function checkForDuplicateIds(productsArray) {
    const seenIds = new Set();
    const duplicates = [];
    
    productsArray.forEach((product, index) => {
        if (product && product.id !== undefined) {
            if (seenIds.has(product.id)) {
                duplicates.push({ index, id: product.id, name: product.name });
            } else {
                seenIds.add(product.id);
            }
        }
    });
    
    return {
        hasDuplicates: duplicates.length > 0,
        duplicates
    };
}

/**
 * Исправляет дублирующиеся ID в массиве товаров
 * @param {Array} productsArray - Массив товаров
 * @returns {Array} Массив с уникальными ID
 */
export function fixDuplicateIds(productsArray) {
    const seenIds = new Set();
    let nextId = Math.max(...productsArray.map(p => p.id || 0), 0) + 1;
    
    return productsArray.map(product => {
        if (!product) return product;
        
        let productId = product.id;
        
        if (productId === undefined || seenIds.has(productId)) {
            productId = nextId++;
        }
        
        seenIds.add(productId);
        
        return {
            ...product,
            id: productId
        };
    });
}