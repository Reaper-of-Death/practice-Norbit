import { Image, Price, Name } from '@entities/product';

export const Card = ({ product }) => {
	return (
		console.log(product.name),
		<div className='cardProduct'>
			<div className='cardSpaceImage'>
				<Image url={product.image.url} alt={product.image.alt} className="cardImage"/>
			</div>

			<div className="cardDescrtipton">
				<Name className="cardName" name={product.name} />
				<Price price={product.price} discountPrice={product.discountPrice} />				
			</div>			
		</div>
	);
};