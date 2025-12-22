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
        if (!orderData.clientId) {
            throw new Error('clientId обязателен для заполнения');
        }
        
        if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
            throw new Error('items (массив) обязателен для заполнения');
        }
        
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
        const clientId = clientResult.data.id;

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

    /**
     * Создать заказ из корзины
     * @param {Object} clientData Данные клиента
     * @returns {Promise<Object>} Результат создания заказа
     */
    async checkoutCart(clientData) {
        const cart = this.getCart();

        const orderResult = await this.createOrderWithClient({
            client: clientData,
            items: cart
        });

        return orderResult;
    }

    // ========== УТИЛИТЫ ==========

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