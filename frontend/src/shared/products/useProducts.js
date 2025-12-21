import { useState, useEffect } from 'react';
import { products, loadProductsFromAPI } from './products';

export const useProducts = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [productsList, setProductsList] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setIsLoading(true);
                await loadProductsFromAPI();
                setProductsList([...products]);
                console.log('Товары загружены:', products);
            } catch (err) {
                console.error('Ошибка загрузки товаров:', err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return {
        products: productsList,
        isLoading,
        error,
        refreshProducts: async () => {
            await loadProductsFromAPI();
            setProductsList([...products]);
        }
    };
};