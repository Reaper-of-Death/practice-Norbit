require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes

app.get('/api/furniture', async (req, res) => {
  try {
    const result = await db.getAllFurniture();
    
    const furniture = result.rows.map(item => ({
      ...item,
      cost_rub: (item.Cost / 100).toFixed(2),
      final_price_rub: ((item.Cost * (1 - item.Discount / 100)) / 100).toFixed(2),
      materials: item.materials || []
    }));

    res.json({
      success: true,
      count: furniture.length,
      data: furniture
    });
  } catch (error) {
    console.error('Ошибка получения мебели:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка получения данных о мебели',
      error: error.message
    });
  }
});

app.post('/api/clients', async (req, res) => {
  try {
    const { name, address, email, phone } = req.body;

    // Валидация
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Имя и email обязательны для заполнения'
      });
    }

    const existingClient = await db.getClientByEmail(email);
    if (existingClient.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Клиент с таким email уже существует'
      });
    }

    const result = await db.createClient(name, address, email, phone);
    
    res.status(201).json({
      success: true,
      message: 'Клиент успешно создан',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Ошибка создания клиента:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка создания клиента',
      error: error.message
    });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const { clientId, items } = req.body;

    // Валидация
    if (!clientId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'clientId и items (массив) обязательны для заполнения'
      });
    }
    
    const clientCheck = await db.query(
      'SELECT * FROM "Client" WHERE "id" = $1',
      [clientId]
    );

    if (clientCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Клиент не найден'
      });
    }

    const order = await db.createOrder(clientId, items);

    order.TotalCost_rub = (order.TotalCost / 100).toFixed(2);
    order.items = order.items.map(item => ({
      ...item,
      price_rub: (item.price / 100).toFixed(2),
      total_rub: ((item.total || item.price * item.count) / 100).toFixed(2)
    }));

    res.status(201).json({
      success: true,
      message: 'Заказ успешно создан',
      data: order
    });
  } catch (error) {
    console.error('Ошибка создания заказа:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка создания заказа',
      error: error.message
    });
  }
});

app.get('/api/orders/:id', async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    
    const result = await db.getOrderById(orderId);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Заказ не найден'
      });
    }

    const order = result.rows[0];

    order.TotalCost_rub = (order.TotalCost / 100).toFixed(2);
    order.items = order.items.map(item => ({
      ...item,
      price_rub: (item.price / 100).toFixed(2),
      total_rub: (item.total / 100).toFixed(2)
    }));

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Ошибка получения заказа:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка получения данных о заказе',
      error: error.message
    });
  }
});

app.get('/api/clients', async (req, res) => {
  try {
    const result = await db.getAllClients();
    
    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Ошибка получения клиентов:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка получения данных о клиентах',
      error: error.message
    });
  }
});

app.get('/api/materials', async (req, res) => {
  try {
    const result = await db.getAllMaterials();
    
    const materials = result.rows.map(material => ({
      ...material,
      PricePerUnit_rub: (material.PricePerUnit / 100).toFixed(2)
    }));

    res.json({
      success: true,
      count: materials.length,
      data: materials
    });
  } catch (error) {
    console.error('Ошибка получения материалов:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка получения данных о материалах',
      error: error.message
    });
  }
});

app.get('/api/furniture-types', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM "TypeFurniture" ORDER BY "Id"');
    
    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Ошибка получения типов мебели:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка получения данных о типах мебели',
      error: error.message
    });
  }
});

app.get('/api/health', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json({
      status: 'healthy',
      database: 'connected',
      timestamp: result.rows[0].now
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      database: 'disconnected',
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
  console.log(`🏪 Магазин мебели API`);
  console.log(`📊 База данных: ${process.env.DB_NAME || 'FurnitureStore'}`);
  console.log(`🌐 Доступные эндпоинты:`);
  console.log(`   GET  /api/furniture      - Получить всю мебель с материалами`);
  console.log(`   POST /api/clients        - Создать нового клиента`);
  console.log(`   POST /api/orders         - Создать новый заказ`);
  console.log(`   GET  /api/orders/:id     - Получить заказ по ID`);
  console.log(`   GET  /api/clients        - Получить всех клиентов`);
  console.log(`   GET  /api/materials      - Получить все материалы`);
  console.log(`   GET  /api/furniture-types - Получить типы мебели`);
  console.log(`   GET  /api/health         - Проверка состояния`);
});