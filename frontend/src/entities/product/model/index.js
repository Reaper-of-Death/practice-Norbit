export const CreateProduct = (id, name, description, material, price, discountPrice, image) => ({
	id,
	name,
	description,
	material,
	price,
	discountPrice,
	image,
});

export const CreateCartItem = (product, quantity = 1) => ({
  ...product,
  quantity,
});