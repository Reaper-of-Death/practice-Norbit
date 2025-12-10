export const Price = ({ price, discountPrice, className }) => {
	const hasValidDiscount = discountPrice && 
	                        discountPrice > 0 && 
	                        discountPrice < price && 
	                        price > 0;
	return (
		<div className={`${className} ${hasValidDiscount ? 'hasDiscount' : ''}`}>
			{hasValidDiscount ? (
				<>
					<p className='discountPriceProduct'>{discountPrice}</p>
					<p className='priceProduct'>{price}</p>
				</>
			) : (
				<p className='priceProduct'>{price}</p>
			)}
		</div>
	);
};