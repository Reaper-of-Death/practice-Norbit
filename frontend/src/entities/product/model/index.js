export const CreateProduct = (id, name, price, discountPrice, image) => ({
	id,
	name,
	price,
	discountPrice,
	image,
});

export const CreateCartItem = (product, quantity = 1) => ({
  ...product,
  quantity,
});