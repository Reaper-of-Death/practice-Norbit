// furniture-store-api.js
class FurnitureStoreAPI {
    constructor(baseURL = 'http://localhost:3000/api') {
        this.baseURL = baseURL;
        this.headers = {
            'Content-Type': 'application/json',
        };
    }

    // Общий метод для выполнения запросов
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        
        const config = {
            ...options,
            headers: {
                ...this.headers,
                ...options.headers,
            },
        };

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`API Error (${endpoint}):`, error);
            throw error;
        }
    }

    // ========== МЕБЕЛЬ ==========

    /**
     * Получить всю мебель
     * @returns {Promise<Array>} Список мебели
     */
    async getAllFurniture() {
        return this.request('/furniture');
    }

    /**
     * Поиск мебели по названию или описанию
     * @param {string} query Строка поиска
     * @returns {Promise<Array>} Результаты поиска
     */
    async searchFurniture(query) {
        const allFurniture = await this.getAllFurniture();
        
        if (!query) return allFurniture;

        const searchTerm = query.toLowerCase();
        return {
            success: true,
            data: allFurniture.data.filter(item => 
                item.Name.toLowerCase().includes(searchTerm) ||
                item.Description?.toLowerCase().includes(searchTerm)
            )
        };
    }

    /**
     * Получить мебель по ID
     * @param {number} id ID мебели
     * @returns {Promise<Object>} Данные мебели
     */
    async getFurnitureById(id) {
        const allFurniture = await this.getAllFurniture();
        const furniture = allFurniture.data.find(item => item.Id === id);
        
        if (!furniture) {
            throw new Error('Мебель не найдена');
        }

        return {
            success: true,
            data: furniture
        };
    }

    /**
     * Получить мебель по типу
     * @param {number} typeId ID типа мебели
     * @returns {Promise<Array>} Мебель указанного типа
     */
    async getFurnitureByType(typeId) {
        const allFurniture = await this.getAllFurniture();
        const furniture = allFurniture.data.filter(item => item.Id_Type === typeId);
        
        return {
            success: true,
            data: furniture
        };
    }

    // ========== КЛИЕНТЫ ==========

    /**
     * Получить всех клиентов
     * @returns {Promise<Array>} Список клиентов
     */
    async getAllClients() {
        return this.request('/clients');
    }

    /**
     * Создать нового клиента
     * @param {Object} clientData Данные клиента
     * @returns {Promise<Object>} Созданный клиент
     */
    async createClient(clientData) {
        return this.request('/clients', {
            method: 'POST',
            body: JSON.stringify(clientData)
        });
    }

    /**
     * Найти клиента по email
     * @param {string} email Email клиента
     * @returns {Promise<Object|null>} Данные клиента или null
     */
    async findClientByEmail(email) {
        const allClients = await this.getAllClients();
        const client = allClients.data.find(c => c.Email === email);
        
        return client || null;
    }

    /**
     * Получить или создать клиента
     * @param {Object} clientData Данные клиента
     * @returns {Promise<Object>} Данные клиента (существующие или новые)
     */
    async getOrCreateClient(clientData) {
        const { email, name, phone, address } = clientData;
        
        // Проверяем существующего клиента
        const existingClient = await this.findClientByEmail(email);
        if (existingClient) {
            return {
                success: true,
                data: existingClient,
                existed: true
            };
        }

        // Создаем нового клиента
        try {
            const newClient = await this.createClient({
                name,
                email,
                phone,
                address
            });
            
            return {
                success: true,
                data: newClient.data,
                existed: false
            };
        } catch (error) {
            throw new Error(`Не удалось создать клиента: ${error.message}`);
        }
    }

    // ========== ЗАКАЗЫ ==========

    /**
     * Создать новый заказ
     * @param {Object} orderData Данные заказа
     * @returns {Promise<Object>} Созданный заказ
     */
    async createOrder(orderData) {
        return this.request('/orders', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });
    }

    /**
     * Получить заказ по ID
     * @param {number} orderId ID заказа
     * @returns {Promise<Object>} Данные заказа
     */
    async getOrderById(orderId) {
        return this.request(`/orders/${orderId}`);
    }

    /**
     * Создать заказ с данными клиента
     * @param {Object} orderInfo Информация о заказе
     * @returns {Promise<Object>} Результат создания заказа
     */
    async createOrderWithClient(orderInfo) {
        const { client, items } = orderInfo;
        
        // Получаем или создаем клиента
        const clientResult = await this.getOrCreateClient(client);
        const clientId = clientResult.data.Id;

        // Создаем заказ
        const orderResult = await this.createOrder({
            clientId,
            items: items.map(item => ({
                furnitureId: item.furnitureId,
                count: item.count
            }))
        });

        return {
            success: true,
            order: orderResult.data,
            client: clientResult.data,
            clientExisted: clientResult.existed
        };
    }

    // ========== МАТЕРИАЛЫ ==========

    /**
     * Получить все материалы
     * @returns {Promise<Array>} Список материалов
     */
    async getAllMaterials() {
        return this.request('/materials');
    }

    // ========== ТИПЫ МЕБЕЛИ ==========

    /**
     * Получить все типы мебели
     * @returns {Promise<Array>} Список типов мебели
     */
    async getAllFurnitureTypes() {
        return this.request('/furniture-types');
    }

    // ========== КОРЗИНА (локальное хранилище) ==========

    /**
     * Получить корзину из localStorage
     * @returns {Array} Товары в корзине
     */
    getCart() {
        const cart = localStorage.getItem('furniture_cart');
        return cart ? JSON.parse(cart) : [];
    }

    /**
     * Добавить товар в корзину
     * @param {Object} item Данные товара
     */
    addToCart(item) {
        const cart = this.getCart();
        
        // Проверяем, есть ли уже этот товар в корзине
        const existingItemIndex = cart.findIndex(cartItem => 
            cartItem.furnitureId === item.furnitureId
        );

        if (existingItemIndex >= 0) {
            // Обновляем количество
            cart[existingItemIndex].count += item.count;
        } else {
            // Добавляем новый товар
            cart.push(item);
        }

        localStorage.setItem('furniture_cart', JSON.stringify(cart));
        this.updateCartCount();
    }

    /**
     * Удалить товар из корзины
     * @param {number} furnitureId ID мебели
     */
    removeFromCart(furnitureId) {
        const cart = this.getCart();
        const filteredCart = cart.filter(item => item.furnitureId !== furnitureId);
        localStorage.setItem('furniture_cart', JSON.stringify(filteredCart));
        this.updateCartCount();
    }

    /**
     * Очистить корзину
     */
    clearCart() {
        localStorage.removeItem('furniture_cart');
        this.updateCartCount();
    }

    /**
     * Получить количество товаров в корзине
     * @returns {number} Количество товаров
     */
    getCartCount() {
        const cart = this.getCart();
        return cart.reduce((total, item) => total + item.count, 0);
    }

    /**
     * Обновить отображение количества товаров в корзине
     */
    updateCartCount() {
        const cartCount = this.getCartCount();
        const cartElements = document.querySelectorAll('.cart-count');
        
        cartElements.forEach(element => {
            element.textContent = cartCount;
            element.style.display = cartCount > 0 ? 'inline' : 'none';
        });
    }

    /**
     * Получить полную информацию о товарах в корзине
     * @returns {Promise<Array>} Товары с полной информацией
     */
    async getCartWithDetails() {
        const cart = this.getCart();
        const furniture = await this.getAllFurniture();
        
        return cart.map(cartItem => {
            const furnitureItem = furniture.data.find(f => f.Id === cartItem.furnitureId);
            if (!furnitureItem) return null;
            
            const price = furnitureItem.Cost * (1 - furnitureItem.Discount / 100);
            
            return {
                ...cartItem,
                furniture: furnitureItem,
                price: price,
                total: price * cartItem.count,
                price_rub: (price / 100).toFixed(2),
                total_rub: ((price * cartItem.count) / 100).toFixed(2)
            };
        }).filter(item => item !== null);
    }

    /**
     * Создать заказ из корзины
     * @param {Object} clientData Данные клиента
     * @returns {Promise<Object>} Результат создания заказа
     */
    async checkoutCart(clientData) {
        const cart = this.getCart();
        
        if (cart.length === 0) {
            throw new Error('Корзина пуста');
        }

        const orderResult = await this.createOrderWithClient({
            client: clientData,
            items: cart
        });

        // Очищаем корзину после успешного оформления
        if (orderResult.success) {
            this.clearCart();
        }

        return orderResult;
    }

    // ========== УТИЛИТЫ ==========

    /**
     * Форматирование цены
     * @param {number} price Цена в копейках
     * @returns {string} Отформатированная цена
     */
    formatPrice(price) {
        return (price / 100).toFixed(2) + ' ₽';
    }

    /**
     * Форматирование даты
     * @param {string} dateString Строка даты
     * @returns {string} Отформатированная дата
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU');
    }

    /**
     * Проверка состояния сервера
     * @returns {Promise<boolean>} Сервер доступен
     */
    async checkHealth() {
        try {
            const result = await this.request('/health');
            return result.status === 'healthy';
        } catch (error) {
            return false;
        }
    }
}

window.FurnitureStoreAPI = new FurnitureStoreAPI();