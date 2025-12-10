import { CreatProduct } from "@entities";
import { Card } from "@widgets/product/cart";

export const ProductList = () => {

    const products = [
        CreatProduct(1, 'Мебель 1', 1999, 1499, {url: '../src/shared/image/defaultImage.png', alt: 'Мебель 1'}),
        CreatProduct(2, 'Мебель 2', 19799, 18000, {url: '../src/shared/image/defaultImage.png', alt: 'Мебель 2'}),
        CreatProduct(3, 'Мебель 3', 19599, 19099, {url: '../src/shared/image/defaultImage.png', alt: 'Мебель 3'}),
        CreatProduct(4, 'Мебель 4', 12999, 11999, {url: '../src/shared/image/defaultImage.png', alt: 'Мебель 4'}),
        CreatProduct(5, 'Мебель 5', 31999, 0, {url: '../src/shared/image/defaultImage.png', alt: 'Мебель 5'}),
        CreatProduct(6, 'Мебель 6', 13999, 11999, {url: '../src/shared/image/defaultImage.png', alt: 'Мебель 6'}),
        CreatProduct(7, 'Мебель 7', 10999, 0, {url: '../src/shared/image/defaultImage.png', alt: 'Мебель 7'}),
        CreatProduct(8, 'Мебель 8', 9999, 0, {url: '../src/shared/image/defaultImage.png', alt: 'Мебель 8'}),
        CreatProduct(9, 'Мебель 9', 6969, 6599, {url: '../src/shared/image/defaultImage.png', alt: 'Мебель 9'}),
        CreatProduct(10, 'Мебель 10', 7999, 6499, {url: '../src/shared/image/defaultImage.png', alt: 'Мебель 10'}),
        CreatProduct(11, 'Мебель 11', 1999, 1499, {url: '../src/shared/image/defaultImage.png', alt: 'Мебель 11'}),
        CreatProduct(12, 'Мебель 12', 5999, 0, {url: '../src/shared/image/defaultImage.png', alt: 'Мебель 12'}),
        CreatProduct(13, 'Мебель 13', 31999, 29499, {url: '../src/shared/image/defaultImage.png', alt: 'Мебель 13'}),
        CreatProduct(14, 'Мебель 14', 21999, 0, {url: '../src/shared/image/defaultImage.png', alt: 'Мебель 14'}),
        CreatProduct(15, 'Мебель 15', 19999, 0, {url: '../src/shared/image/defaultImage.png', alt: 'Мебель 15'}),
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