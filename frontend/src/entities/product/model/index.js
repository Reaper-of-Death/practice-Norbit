export const CreateProduct = (id, name, description, price, discountPrice, image) => ({
	id,
	name,
	description,
	price,
	discountPrice,
	image,	
});

export const CreateCartItem = (product, quantity = 1) => ({
  ...product,
  quantity,
});