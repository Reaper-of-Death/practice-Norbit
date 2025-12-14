import { CreateProduct } from "@entities";
import { Card } from "@widgets/product/cart";
import { useFilters } from "@features/sortingProducts/filterContext/filterContext";
import { sortingProducts } from "@features/sortingProducts/sortingProducts";

export const ProductList = () => {
    const { filters } = useFilters();

    const products = [
        CreateProduct(1, 'Мебель 1', 1999, 1499, {url: '../src/shared/image/defaultImage.png', alt: 'Мебель 1'}),
        CreateProduct(2, 'Мебель 2', 19799, 18000, {url: '../src/shared/image/defaultImage.png', alt: 'Мебель 2'}),
        CreateProduct(3, 'Мебель 3', 19599, 19099, {url: '../src/shared/image/defaultImage.png', alt: 'Мебель 3'}),
        CreateProduct(4, 'Мебель 4', 12999, 11999, {url: '../src/shared/image/defaultImage.png', alt: 'Мебель 4'}),
        CreateProduct(5, 'Мебель 5', 31999, 0, {url: '../src/shared/image/defaultImage.png', alt: 'Мебель 5'}),
        CreateProduct(6, 'Мебель 6', 13999, 11999, {url: '../src/shared/image/defaultImage.png', alt: 'Мебель 6'}),
        CreateProduct(7, 'Мебель 7', 10999, 0, {url: '../src/shared/image/defaultImage.png', alt: 'Мебель 7'}),
        CreateProduct(8, 'Мебель 8', 9999, 0, {url: '../src/shared/image/defaultImage.png', alt: 'Мебель 8'}),
        CreateProduct(9, 'Мебель 9', 6969, 6599, {url: '../src/shared/image/defaultImage.png', alt: 'Мебель 9'}),
        CreateProduct(10, 'Мебель 10', 7999, 6499, {url: '../src/shared/image/defaultImage.png', alt: 'Мебель 10'}),
        CreateProduct(11, 'Мебель 11', 1999, 1499, {url: '../src/shared/image/defaultImage.png', alt: 'Мебель 11'}),
        CreateProduct(12, 'Мебель 12', 5999, 0, {url: '../src/shared/image/defaultImage.png', alt: 'Мебель 12'}),
        CreateProduct(13, 'Мебель 13', 31999, 29499, {url: '../src/shared/image/defaultImage.png', alt: 'Мебель 13'}),
        CreateProduct(14, 'Мебель 14', 21999, 0, {url: '../src/shared/image/defaultImage.png', alt: 'Мебель 14'}),
        CreateProduct(15, 'Мебель 15', 19999, 0, {url: '../src/shared/image/defaultImage.png', alt: 'Мебель 15'}),
    ]

    if (!products || products.length === 0) {
        return <div>Товары не найдены</div>;
    }

    const sortedProducts = sortingProducts(products, filters);
    
    const productCount = sortedProducts.length;
    const totalProducts = products.length;

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