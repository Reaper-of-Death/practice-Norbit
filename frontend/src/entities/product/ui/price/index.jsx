export const Price = ({ price, discountPrice, className }) => {
	return (
		<div className={className}>
			{discountPrice && price ? (
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