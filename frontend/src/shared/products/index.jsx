import { CreatProduct } from "@entities";
import { Card } from "@widgets/product/cart";

export const ProductList = () => {

    const products = [
        CreatProduct(1, 'Мебель 1', 1999, 1499, {url: '../src/shared/image/defaultImage.png', alt: 'Мебель 1'}),
        CreatProduct(2, 'Мебель 2', 1999, 1499, {url: '../src/shared/image/defaultImage.png', alt: 'Мебель 2'}),
        CreatProduct(3, 'Мебель 3', 1999, 1499, {url: '../src/shared/image/defaultImage.png', alt: 'Мебель 3'}),
        CreatProduct(4, 'Мебель 4', 1999, 1499, {url: '../src/shared/image/defaultImage.png', alt: 'Мебель 4'}),
        CreatProduct(5, 'Мебель 5', 1999, 1499, {url: '../src/shared/image/defaultImage.png', alt: 'Мебель 5'}),
        CreatProduct(6, 'Мебель 6', 1999, 1499, {url: '../src/shared/image/defaultImage.png', alt: 'Мебель 6'}),
        CreatProduct(7, 'Мебель 7', 1999, 1499, {url: '../src/shared/image/defaultImage.png', alt: 'Мебель 7'}),
        CreatProduct(8, 'Мебель 8', 1999, 1499, {url: '../src/shared/image/defaultImage.png', alt: 'Мебель 8'}),
        CreatProduct(9, 'Мебель 9', 1999, 1499, {url: '../src/shared/image/defaultImage.png', alt: 'Мебель 9'}),
        CreatProduct(10, 'Мебель 10', 1999, 1499, {url: '../src/shared/image/defaultImage.png', alt: 'Мебель 10'}),
    ]

    if (!products || products.length === 0) {
        return <div>Товары не найдены</div>;
    }

    return (
       <div className="products-grid">        
          {products.map(product => (
            <Card key={product.id} product={product} />        
          ))}
      </div>
    )

}