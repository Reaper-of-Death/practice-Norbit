const { Client } = require('pg');
require('dotenv').config();

async function initializeDatabase() {
  const client = new Client({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'postgres',
    password: process.env.DB_PASSWORD || '123',
    port: process.env.DB_PORT || 5433,
  });

  try {
    await client.connect();
    console.log('Подключение к PostgreSQL установлено');

    // Создаем базу данных если не существует
    await client.query(`
      SELECT 'CREATE DATABASE "${process.env.DB_NAME || 'FurnitureStore'}"'
      WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${process.env.DB_NAME || 'FurnitureStore'}')
    `);

    console.log('База данных проверена/создана');
    await client.end();
    
    const dbClient = new Client({
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'FurnitureStore',
      password: process.env.DB_PASSWORD || '123',
      port: process.env.DB_PORT || 5433,
    });

    await dbClient.connect();

    await dbClient.query(`
      -- Таблица клиентов
      CREATE TABLE IF NOT EXISTS "Client" (
        "id" BIGSERIAL PRIMARY KEY,
        "Name" TEXT NOT NULL,
        "Address" TEXT,
        "Email" TEXT UNIQUE,
        "Phone" TEXT
      );

      -- Таблица типов мебели
      CREATE TABLE IF NOT EXISTS "TypeFurniture" (
        "id" BIGSERIAL PRIMARY KEY,
        "Name" TEXT NOT NULL UNIQUE
      );

      -- Таблица материалов
      CREATE TABLE IF NOT EXISTS "Material" (
        "id" BIGSERIAL PRIMARY KEY,
        "Name" TEXT NOT NULL UNIQUE,
        "Unit" TEXT NOT NULL,
        "PricePerUnit" BIGINT NOT NULL
      );

      -- Таблица мебели
      CREATE TABLE IF NOT EXISTS "Furniture" (
        "id" BIGSERIAL PRIMARY KEY,
        "id_Type" BIGINT REFERENCES "TypeFurniture"("id"),
        "Name" TEXT NOT NULL,
        "Description" TEXT,
        "Cost" BIGINT NOT NULL,
        "Discount" BIGINT DEFAULT 0,
        "Photo" TEXT
      );

      -- Таблица заказов (используем кавычки так как Order - зарезервированное слово)
      CREATE TABLE IF NOT EXISTS "Order" (
        "id" BIGSERIAL PRIMARY KEY,
        "id_Client" BIGINT REFERENCES "Client"("id"),
        "Date" DATE DEFAULT CURRENT_DATE,
        "TotalCost" BIGINT DEFAULT 0
      );

      -- Таблица связи мебели и материалов
      CREATE TABLE IF NOT EXISTS "FurnitureMaterial" (
        "id" BIGSERIAL PRIMARY KEY,
        "id_Furniture" BIGINT REFERENCES "Furniture"("id") ON DELETE CASCADE,
        "id_Material" BIGINT REFERENCES "Material"("id"),
        "Count" BIGINT NOT NULL
      );

      -- Таблица позиций заказа
      CREATE TABLE IF NOT EXISTS "OrderItem" (
        "id" BIGSERIAL PRIMARY KEY,
        "id_Order" BIGINT REFERENCES "Order"("id") ON DELETE CASCADE,
        "id_Furniture" BIGINT REFERENCES "Furniture"("id"),
        "Count" BIGINT NOT NULL,
        "Price" BIGINT NOT NULL
      );
    `);

    console.log('✅ Все таблицы успешно созданы');

    await insertTestData(dbClient);

    await dbClient.end();
    console.log('✅ База данных инициализирована успешно');

  } catch (error) {
    console.error('❌ Ошибка при инициализации базы данных:', error);
  }
}

async function insertTestData(client) {
  try {
    const checkResult = await client.query('SELECT COUNT(*) FROM "Client"');
    if (parseInt(checkResult.rows[0].count) > 0) {
      console.log('📊 Данные уже существуют, пропускаем вставку тестовых данных');
      return;
    }

    console.log('📝 Вставляем тестовые данные...');

    await client.query(`
      INSERT INTO "TypeFurniture" ("Name") VALUES 
      ('Диван'), ('Кресло'), ('Стол'), ('Стул'), ('Шкаф'), ('Кровать')
      ON CONFLICT ("Name") DO NOTHING;
    `);

    await client.query(`
      INSERT INTO "Material" ("Name", "Unit", "PricePerUnit") VALUES 
      ('Дуб', 'м³', 50000),
      ('Сосна', 'м³', 25000),
      ('Бук', 'м³', 40000),
      ('МДФ', 'лист', 3000),
      ('ДСП', 'лист', 2000),
      ('Ткань велюр', 'м²', 1500),
      ('Ткань кожа', 'м²', 8000),
      ('Поролон', 'м³', 12000),
      ('Металл', 'кг', 200),
      ('Стекло', 'м²', 4000)
      ON CONFLICT ("Name") DO NOTHING;
    `);

    // Клиенты
    await client.query(`
      INSERT INTO "Client" ("Name", "Address", "Email", "Phone") VALUES 
      ('Иванов Иван Иванович', 'ул. Ленина, 10, кв. 5', 'ivanov@mail.ru', '+79161234567'),
      ('Петрова Мария Сергеевна', 'пр. Мира, 25, кв. 12', 'petrova@gmail.com', '+79031234568'),
      ('Сидоров Алексей Викторович', 'ул. Советская, 45, кв. 33', 'sidorov@yandex.ru', '+79261234569')
      ON CONFLICT ("Email") DO NOTHING;
    `);

    // Мебель
    await client.query(`
      INSERT INTO "Furniture" ("id_Type", "Name", "Description", "Cost", "Discount", "Photo") VALUES 
      (1, 'Диван "Комфорт"', 'Прямой диван с велюровой обивкой', 45000, 10, 'sofa_comfort.jpg'),
      (1, 'Диван "Премиум"', 'Угловой диван с кожаной обивкой', 120000, 15, 'sofa_premium.jpg'),
      (3, 'Стол обеденный "Дуб"', 'Обеденный стол из массива дуба', 35000, 5, 'table_oak.jpg'),
      (4, 'Стул "Эргономик"', 'Эргономичный стул для офиса', 8000, 0, 'chair_ergo.jpg'),
      (5, 'Шкаф купе "Модерн"', 'Трехдверный шкаф купе с зеркалом', 65000, 12, 'wardrobe_modern.jpg'),
      (6, 'Кровать "Королевская"', 'Двуспальная кровать с мягким изголовьем', 89000, 8, 'bed_king.jpg')
      ON CONFLICT DO NOTHING;
    `);

    // Материалы для мебели
    await client.query(`
      INSERT INTO "FurnitureMaterial" ("id_Furniture", "id_Material", "Count") VALUES 
      (1, 6, 8),
      (1, 8, 2),
      (2, 7, 12),
      (2, 8, 3),
      (3, 1, 0.2),
      (4, 9, 5),
      (4, 2, 0.05)
      ON CONFLICT DO NOTHING;
    `);

    console.log('✅ Тестовые данные успешно добавлены');

  } catch (error) {
    console.error('❌ Ошибка при вставке тестовых данных:', error);
  }
}

initializeDatabase();