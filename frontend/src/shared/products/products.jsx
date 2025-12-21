import { CreateProduct } from "@entities";

export let products = [];

let onChangeCallback = null;

export function setOnChangeCallback(callback) {
    onChangeCallback = callback;
}

export async function loadProductsFromAPI() {
    try {
        const response = await fetch('http://localhost:3000/api/furniture');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.success) {
            throw new Error('API returned unsuccessful response');
        }
        
        // Генерируем уникальные ID если они дублируются
        const seenIds = new Set();
        let currentId = 1;
        
        products = data.data.map((item, index) => {
            // Проверяем и исправляем дублирующиеся ID
            let productId = item.Id;
            
            if (!productId || seenIds.has(productId)) {
                // Генерируем уникальный ID
                productId = currentId++;
            }
            
            seenIds.add(productId);
            
            // Преобразуем материалы в строку
            const materialsString = item.materials && Array.isArray(item.materials)
                ? item.materials.map(m => {
                    if (m && m.material_name) {
                        return `${m.material_name} (${m.count || 0} ${m.unit || 'шт.'})`;
                    }
                    return '';
                }).filter(Boolean).join(', ')
                : 'Материалы не указаны';

            const discountPrice = (() => {
                if (!item.Discount || item.Discount <= 0) {
                    return 0;
                }
                const calculated = Math.round(item.Cost * (1 - item.Discount / 100));

                return calculated < item.Cost ? calculated : 0;
            })();
            const hasValidImage = item.Photo && 
                                  typeof item.Photo === 'string' && 
                                  item.Photo.trim() !== '' && 
                                  item.Photo !== 'null' && 
                                  item.Photo !== 'undefined';                                  
            return CreateProduct(
                productId,
                item.Name || `Товар ${productId}`,
                item.Description || 'Описание отсутствует',
                materialsString,
                item.Cost || 0,
                discountPrice,
                hasValidImage ? item.Photo : 'undefined'
            );
        });
        
        console.log(`Загружено ${products.length} товаров из API`);
        
        // Уведомляем об изменении
        if (onChangeCallback) {
            onChangeCallback([...products]);
        }
        return products;
        
    } catch (error) {
        console.error('Ошибка при загрузке товаров из API:', error);
        
        // Если API не доступен, создаем тестовые данные с уникальными ID
        products = createSampleProducts();
        console.log('Используются тестовые данные:', products.length, 'товаров');
        
        // Уведомляем об изменении
        if (onChangeCallback) {
            onChangeCallback([...products]);
        }
        
        return products;
    }
}

// Создание тестовых товаров (если API недоступно)
function createSampleProducts() {
    return [
        CreateProduct(
            1,
            'Диван "Комфорт"',
            'Прямой диван с велюровой обивкой',
            'Ткань велюр (8 м²), Поролон (2 м³)',
            45000,
            40500, // 10% скидка
        ),
        CreateProduct(
            2,
            'Диван "Премиум"',
            'Угловой диван с кожаной обивкой',
            'Ткань кожа (12 м²), Поролон (3 м³)',
            120000,
            102000, // 15% скидка
        ),
        CreateProduct(
            3,
            'Стол обеденный "Дуб"',
            'Обеденный стол из массива дуба',
            'Дуб (0.2 м³)',
            35000,
            33250, // 5% скидка
        ),
    ];
}

loadProductsFromAPI().catch(error => {
    console.error('Не удалось загрузить товары:', error);
});