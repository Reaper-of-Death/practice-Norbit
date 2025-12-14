import { CreateProduct } from "@entities";
import { Card } from "@widgets/product/cart";
import { useFilters } from "@features/sortingProducts/filterContext/filterContext";
import { sortingProducts } from "@features/sortingProducts/sortingProducts";
import { products } from "./products";

export const ProductList = () => {
    const { filters } = useFilters();

    const productsCopy = [...products]

    if (!productsCopy || productsCopy.length === 0) {
        return <div>Товары не найдены</div>;
    }

    const sortedProducts = sortingProducts(productsCopy, filters);
    
    const productCount = sortedProducts.length;
    const totalProducts = productsCopy.length;

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
            <div className="products-grid">        
                {sortedProducts.map(product => (
                    <Card key={product.id} product={product} />        
                ))}
            </div>
        </div>
    );
}