import { CreateProduct } from "@entities";
import { Card } from "@widgets/product/cart";
import { useFilters } from "@features/sortingProducts/filterContext/filterContext";
import { sortingProducts } from "@features/sortingProducts/sortingProducts";
import { products, loadProductsFromAPI, setOnChangeCallback } from "./products";
import { useState, useEffect } from 'react';
import { generateProductKey, checkForDuplicateIds, fixDuplicateIds } from "./productUtils";

export const ProductList = () => {    
    const { filters } = useFilters();
    const [productsList, setProductsList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
            const initializeProducts = async () => {
            try {
                setIsLoading(true);
                await loadProductsFromAPI(); // Загружаем в глобальную переменную
                
                // Берем актуальные данные из глобальной переменной
                const currentProducts = [...products];
                const { hasDuplicates } = checkForDuplicateIds(currentProducts);
                
                if (hasDuplicates) {
                    console.warn('Обнаружены дублирующиеся ID товаров. Исправление...');
                    const fixedProducts = fixDuplicateIds(currentProducts);
                    setProductsList(fixedProducts);
                } else {
                    setProductsList(currentProducts);
                }
                
            } catch (err) {
                console.error('Ошибка загрузки товаров:', err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        initializeProducts();

        setOnChangeCallback((updatedProducts) => {
            // updatedProducts уже содержит правильные скидки
            const currentProducts = [...updatedProducts];
            const fixedProducts = fixDuplicateIds(currentProducts);
            setProductsList(fixedProducts);
        });

        return () => {
            setOnChangeCallback(null);
        };
    }, []);

    if (isLoading) {
        return (
            <div className="products-grid">
                <div className="loading">
                    Загрузка товаров...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="products-grid">
                <div className="error">
                    Ошибка загрузки товаров: {error}
                </div>
            </div>
        );
    }

    if (!productsList || productsList.length === 0) {
        return (
            <div className="products-grid">
                <div className="no-products">
                    В базе данных нет товаров
                </div>
            </div>
        );
    }
    
    const sortedProducts = sortingProducts([...productsList], filters);
    const productCount = sortedProducts.length;
    const totalProducts = productsList.length;

    if (productCount === 0) {
        return (
            <div className="products-grid">
                <div className="product-count">
                    Найдено товаров: 0 из {totalProducts}
                </div>
                <div className="no-products">
                    Товары не найдены. Попробуйте изменить параметры фильтрации.
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="product-count">                
            </div>
            <div className="products-grid">        
                {sortedProducts.map((product, index) => (
                    <Card 
                        key={generateProductKey(product, index)} 
                        product={product} 
                    />        
                ))}
            </div>
        </div>
    );
};