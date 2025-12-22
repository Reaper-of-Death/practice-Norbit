const { Pool } = require('pg');

class Database {
  constructor() {
    if (!Database.instance) {
      this.pool = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'FurnitureStore',
        password: '123',
        port: 5433,
      });
      
      this.init();
      Database.instance = this;
    }
    
    return Database.instance;
  }

  async init() {
    try {
      const client = await this.pool.connect();
      console.log('✅ Успешное подключение к базе данных:', 'FurnitureStore');
      client.release();
    } catch (error) {
      console.error('❌ Ошибка подключения к базе данных:', error.message);
    }
  }

   async query(text, params = []) {
    const client = await this.pool.connect();
    try {
      const result = await client.query(text, params);
      return result;
    } catch (error) {
      console.error('Ошибка выполнения запроса:', error.message);
      throw error;
    } finally {
      client.release();
    }
  }

  async createClient(name, address, email, phone) {
    const queryText = `
      INSERT INTO "Client" ("Name", "Address", "Email", "Phone") 
      VALUES ($1, $2, $3, $4) 
      RETURNING *
    `;
    const values = [name, address, email, phone];
    return await this.query(queryText, values);
  }

  async getClientByEmail(email) {
    const queryText = 'SELECT * FROM "Client" WHERE "Email" = $1';
    return await this.query(queryText, [email]);
  }

  async getAllFurniture() {
    const queryText = `
      SELECT 
        f.*,
        tf."Name" as "TypeName",
        COALESCE(
          json_agg(
            json_build_object(
              'material_id', m."id",
              'material_name', m."Name",
              'unit', m."Unit",
              'price_per_unit', m."PricePerUnit",
              'count', fm."Count"
            )
          ) FILTER (WHERE m."id" IS NOT NULL),
          '[]'
        ) as "materials"
      FROM "Furniture" f
      LEFT JOIN "TypeFurniture" tf ON f."id_Type" = tf."id"
      LEFT JOIN "FurnitureMaterial" fm ON f."id" = fm."id_Furniture"
      LEFT JOIN "Material" m ON fm."id_Material" = m."id"
      GROUP BY f."id", tf."Name"
      ORDER BY f."id"
    `;
    return await this.query(queryText);
  }

  async createOrder(clientId, items) {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      
      const orderResult = await client.query(
        'INSERT INTO "Order" ("id_Client") VALUES ($1) RETURNING *',
        [clientId]
      );
      const order = orderResult.rows[0];
      
      let totalCost = 0;

      for (const item of items) {
        const furnitureResult = await client.query(
          'SELECT "Cost", "Discount" FROM "Furniture" WHERE "id" = $1',
          [item.furnitureId]
        );

        if (furnitureResult.rows.length === 0) {
          throw new Error(`Мебель с ID ${item.furnitureId} не найдена`);
        }

        const furniture = furnitureResult.rows[0];
        const price = furniture.Cost * (1 - furniture.Discount / 100);
        const itemTotal = Math.round(price * item.count);

        await client.query(
          `INSERT INTO "OrderItem" ("id_Order", "id_Furniture", "Count", "Price") 
           VALUES ($1, $2, $3, $4)`,
          [order.id, item.furnitureId, item.count, Math.round(price)]
        );

        totalCost += itemTotal;
      }
      
      await client.query(
        'UPDATE "Order" SET "TotalCost" = $1 WHERE "id" = $2',
        [totalCost, order.id]
      );
      
      await client.query('COMMIT');
      
      const completeOrder = await client.query(`
        SELECT 
          o.*,
          c."Name" as "ClientName",
          c."Email" as "ClientEmail",
          json_agg(
            json_build_object(
              'furniture_name', f."Name",
              'count', oi."Count",
              'price', oi."Price",
              'total', oi."Count" * oi."Price"
            )
          ) as "items"
        FROM "Order" o
        JOIN "Client" c ON o."id_Client" = c."id"
        JOIN "OrderItem" oi ON o."id" = oi."id_Order"
        JOIN "Furniture" f ON oi."id_Furniture" = f."id"
        WHERE o."id" = $1
        GROUP BY o."id", c."id"
      `, [order.id]);

      return completeOrder.rows[0];

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async getOrderByid(orderId) {
    const queryText = `
      SELECT 
        o.*,
        c."Name" as "ClientName",
        c."Address" as "ClientAddress",
        c."Email" as "ClientEmail",
        c."Phone" as "ClientPhone",
        json_agg(
          json_build_object(
            'id', oi."id",
            'furniture_id', oi."id_Furniture",
            'furniture_name', f."Name",
            'count', oi."Count",
            'price', oi."Price",
            'total', oi."Count" * oi."Price"
          )
        ) as "items"
      FROM "Order" o
      JOIN "Client" c ON o."id_Client" = c."id"
      JOIN "OrderItem" oi ON o."id" = oi."id_Order"
      JOIN "Furniture" f ON oi."id_Furniture" = f."id"
      WHERE o."id" = $1
      GROUP BY o."id", c."id"
    `;
    return await this.query(queryText, [orderId]);
  }

  async getAllClients() {
    const queryText = 'SELECT * FROM "Client" ORDER BY "id"';
    return await this.query(queryText);
  }

  async getAllMaterials() {
    const queryText = 'SELECT * FROM "Material" ORDER BY "id"';
    return await this.query(queryText);
  }
}

const database = new Database();
Object.freeze(database);

module.exports = database;