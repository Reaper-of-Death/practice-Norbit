import { CreateProduct } from "@entities";
import defaultImage from '@shared/image/defaultImage.png'
const defaultDescription = 'Идеальное сочетание эргономики, стиля и комфорта. Это кресло станет ключевым акцентом в вашей гостиной, создавая уютную атмосферу для отдыха и общения.'

export const products = [
        CreateProduct(1, 'Мебель 1', defaultDescription, 1999, 1499, {url: defaultImage, alt: 'Мебель 1'}),
        CreateProduct(2, 'Мебель 2', defaultDescription, 19799, 18000, {url: defaultImage, alt: 'Мебель 2'}),
        CreateProduct(3, 'Мебель 3', defaultDescription, 19599, 19099, {url: defaultImage, alt: 'Мебель 3'}),
        CreateProduct(4, 'Мебель 4', defaultDescription, 12999, 11999, {url: defaultImage, alt: 'Мебель 4'}),
        CreateProduct(5, 'Мебель 5', defaultDescription, 31999, 0, {url: defaultImage, alt: 'Мебель 5'}),
        CreateProduct(6, 'Мебель 6', defaultDescription, 13999, 11999, {url: defaultImage, alt: 'Мебель 6'}),
        CreateProduct(7, 'Мебель 7', defaultDescription, 10999, 0, {url: defaultImage, alt: 'Мебель 7'}),
        CreateProduct(8, 'Мебель 8', defaultDescription, 9999, 0, {url: defaultImage, alt: 'Мебель 8'}),
        CreateProduct(9, 'Мебель 9', defaultDescription, 6969, 6599, {url: defaultImage, alt: 'Мебель 9'}),
        CreateProduct(10, 'Мебель 10', defaultDescription, 7999, 6499, {url: defaultImage, alt: 'Мебель 10'}),
        CreateProduct(11, 'Мебель 11', defaultDescription, 1999, 1499, {url: defaultImage, alt: 'Мебель 11'}),
        CreateProduct(12, 'Мебель 12', defaultDescription, 5999, 0, {url: defaultImage, alt: 'Мебель 12'}),
        CreateProduct(13, 'Мебель 13', defaultDescription, 31999, 29499, {url: defaultImage, alt: 'Мебель 13'}),
        CreateProduct(14, 'Мебель 14', defaultDescription, 21999, 0, {url: defaultImage, alt: 'Мебель 14'}),
        CreateProduct(15, 'Мебель 15', defaultDescription, 19999, 0, {url: defaultImage, alt: 'Мебель 15'}),
    ]