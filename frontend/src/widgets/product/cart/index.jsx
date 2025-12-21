import { Image, Price, Name } from '@entities/product';
import { useState } from 'react';
import { useCart } from '@features/addToCart/cartContext/cartContext'
import { Link } from 'react-router-dom';

export const Card = ({ product }) => {
	const [isAdded, setIsAdded] = useState(false);
  	const [isLoading, setIsLoading] = useState(false);
	const { addToCart } = useCart();

	const handleProductToCartClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
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

	return (
		console.log(product.name),
		<Link to={`/description/${product.id}`} className="card-link">
			<div className='cardProduct'>
				<div className='cardSpaceImage'>
					<Image url={product.image} className="cardImage"/>
				</div>

				<div className="cardDescrtipton">
					<Name className="cardName" name={product.name} />
					<Price price={product.price} discountPrice={product.discountPrice} />
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
				</div>			
			</div>
		</Link>
	);
};