import { HeaderDescription, Footer } from '@widgets'
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { products } from '@shared/products/products';
import { useCart } from '@features/addToCart/cartContext/cartContext'

export const DescriptionPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    const [isAdded, setIsAdded] = useState(false);
  	const [isLoading, setIsLoading] = useState(false);
	const { addToCart } = useCart();

    const handleProductToCartClick = async () => {
    setIsLoading(true);
    
    try {      
        addToCart(product);
        setIsAdded(true);

        setTimeout(() => {
            setIsAdded(false);
        }, 2000);
        } catch (error) {
        console.error('Ошибка при добавлении в корзину:', error);
        } finally {
        setIsLoading(false);
        }
    };

    useEffect(() => {
        const fetchProduct = () => {
            setLoading(true);
            const foundProduct = products.find(p => p.id === parseInt(id));
            setProduct(foundProduct);
            setLoading(false);
        };

        fetchProduct();
    }, [id]);

    if (loading) {
        return <div>Загрузка...</div>;
    }

    if (!product) {
        return <div>Товар не найден</div>;
    }

    return(
        <div className='descriptionPage'>
            <HeaderDescription/>
            
            <div className="product-detail">
                <div className="product-detail__image">
                    <img src={product.image.url} alt={product.image.alt} />
                </div>
                
                <div className="product-detail__info">
                    <h1>{product.name}</h1>
                    
                    <div className="product-detail__price">
                        {product.discountPrice ? (
                            <>
                                <span className="old-price">{product.price} руб.</span>
                                <span className="current-price">{product.discountPrice} руб.</span>
                            </>
                        ) : (
                            <span className="current-price">{product.price} руб.</span>
                        )}
                    </div>
                    
                    <button
						className={`product-to-cart-button ${isAdded ? 'added' : ''} ${isLoading ? 'loading' : ''}`}
						onClick={handleProductToCartClick}
						disabled={isLoading || isAdded}
						>
						{isLoading ? (
							<span className="button-loader"></span>
						) : isAdded ? (
							<>
							<svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
								<path d="M20 6L9 17L4 12" strokeLinecap="round" strokeLinejoin="round"/>
							</svg>
							Добавлено
							</>
						) : (
							'В корзину'
						)}
					</button>
                    
                    <div className="product-detail__description">
                        <h2>Описание</h2>
                        <p>{product.description}</p>
                    </div>
                    
                    <div className="product-detail__characteristics">
                        <h2>Характеристики</h2>
                        <ul>                            
                            <li>Материал: Экокожа</li>
                            <li>Размер: 90x100x85 см</li>
                            <li>Цвет: Черный</li>                            
                        </ul>
                    </div>
                </div>
            </div>

            <Footer/>
        </div>
    )
}