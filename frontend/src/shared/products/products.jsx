import { CreateProduct } from "@entities";

export let products = [];
let onChangeCallback = null;

export function setOnChangeCallback(callback) {
    onChangeCallback = callback;
}

export async function loadProductsFromAPI() {
    try {
        // Используем существующий API клиент
        const api = window.FurnitureStoreAPI;
        
        // Проверяем доступность API
        const isHealthy = await api.checkHealth();
        if (!isHealthy) {
            throw new Error('API недоступен');
        }
        
        // Используем метод из api-client
        const result = await api.getAllFurniture();
        
        if (!result.success) {
            throw new Error('API returned unsuccessful response');
        }
        
        // Преобразуем данные в формат продукта
        const seenIds = new Set();
        let currentId = 1;
        
        products = result.data.map((item) => {
            // Используем ID из API или генерируем уникальный
            let productId = item.Id || currentId++;
            
            if (seenIds.has(productId)) {
                productId = currentId++;
            }
            
            seenIds.add(productId);
            
            // Форматируем материалы
            const materialsString = formatMaterials(item.materials);
            
            // Рассчитываем цену со скидкой
            const discountPrice = calculateDiscountPrice(item.Cost, item.Discount);
            
            // Проверяем изображение
            const imageUrl = validateImageUrl(item.Photo);
            
            return CreateProduct(
                productId,
                item.Name || `Товар ${productId}`,
                item.Description || 'Описание отсутствует',
                materialsString,
                item.Cost || 0,
                discountPrice,
                imageUrl
            );
        });
        
        console.log(`Загружено ${products.length} товаров из API`);
        
        // Уведомляем об изменении
        notifyProductsChanged();
        
        return products;
        
    } catch (error) {
        console.error('Ошибка при загрузке товаров из API:', error);
        
        // Fallback на тестовые данные
        products = createSampleProducts();
        console.log('Используются тестовые данные:', products.length, 'товаров');
        
        notifyProductsChanged();
        
        return products;
    }
}

// Вспомогательные функции
function formatMaterials(materials) {
    if (!materials || !Array.isArray(materials)) {
        return 'Материалы не указаны';
    }
    
    return materials
        .map(m => {
            if (m && m.material_name) {
                return `${m.material_name} (${m.count || 0} ${m.unit || 'шт.'})`;
            }
            return '';
        })
        .filter(Boolean)
        .join(', ');
}

function calculateDiscountPrice(cost, discount) {
    if (!discount || discount <= 0 || !cost) {
        return 0;
    }
    
    const calculated = Math.round(cost * (1 - discount / 100));
    return calculated < cost ? calculated : 0;
}

function validateImageUrl(photoUrl) {
    if (!photoUrl || 
        typeof photoUrl !== 'string' || 
        photoUrl.trim() === '' || 
        photoUrl === 'null' || 
        photoUrl === 'undefined') {
        return 'undefined';
    }
    
    return photoUrl;
}

function notifyProductsChanged() {
    if (onChangeCallback) {
        onChangeCallback([...products]);
    }
}

// Тестовые товары (fallback)
function createSampleProducts() {
    return [
        CreateProduct(
            1,
            'Диван "Комфорт"',
            'Прямой диван с велюровой обивкой',
            'Ткань велюр (8 м²), Поролон (2 м³)',
            45000,
            40500,
        ),
        CreateProduct(
            2,
            'Диван "Премиум"',
            'Угловой диван с кожаной обивкой',
            'Ткань кожа (12 м²), Поролон (3 м³)',
            120000,
            102000,
        ),
    ];
}

// Функция для поиска товаров
export async function searchProducts(query) {
    try {
        const api = window.FurnitureStoreAPI;
        const result = await api.searchFurniture(query);
        
        return result.data.map(item => {
            const discountPrice = calculateDiscountPrice(item.Cost, item.Discount);
            const imageUrl = validateImageUrl(item.Photo);
            const materialsString = formatMaterials(item.materials);
            
            return CreateProduct(
                item.Id,
                item.Name,
                item.Description,
                materialsString,
                item.Cost,
                discountPrice,
                imageUrl
            );
        });
    } catch (error) {
        console.error('Ошибка поиска товаров:', error);
        return products.filter(item => 
            item.name.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase())
        );
    }
}

// Функция для получения товара по ID
export function getProductById(id) {
    return products.find(product => product.id === id);
}

// Инициализация
loadProductsFromAPI().catch(error => {
    console.error('Не удалось загрузить товары:', error);
});