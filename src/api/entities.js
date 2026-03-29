import { supabase } from './supabaseClient';

/**
 * Creates an entity with Base44-compatible CRUD methods backed by Supabase.
 *
 * fieldMap: maps app-facing field names to actual DB column names.
 * e.g. { order: 'order_id', product: 'product_id' }
 */
const createEntity = (tableName, fieldMap = {}) => {
  const reverseMap = Object.fromEntries(
    Object.entries(fieldMap).map(([appField, dbCol]) => [dbCol, appField])
  );

  const toDb = (key) => fieldMap[key] ?? key;

  const mapToDb = (data) =>
    Object.fromEntries(Object.entries(data).map(([k, v]) => [toDb(k), v]));

  const mapFromDb = (row) => {
    if (!row) return row;
    return Object.fromEntries(
      Object.entries(row).map(([k, v]) => [reverseMap[k] ?? k, v])
    );
  };

  return {
    async list(sort) {
      let query = supabase.from(tableName).select('*');
      if (sort) {
        const ascending = !sort.startsWith('-');
        const dbCol = toDb(sort.replace(/^-/, ''));
        query = query.order(dbCol, { ascending });
      }
      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []).map(mapFromDb);
    },

    async filter(criteria) {
      let query = supabase.from(tableName).select('*');
      for (const [key, value] of Object.entries(criteria)) {
        query = query.eq(toDb(key), value);
      }
      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []).map(mapFromDb);
    },

    async get(id) {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return mapFromDb(data);
    },

    async create(inputData) {
      const { data, error } = await supabase
        .from(tableName)
        .insert(mapToDb(inputData))
        .select()
        .single();
      if (error) throw error;
      return mapFromDb(data);
    },

    async update(id, inputData) {
      const { data, error } = await supabase
        .from(tableName)
        .update(mapToDb(inputData))
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return mapFromDb(data);
    },

    async delete(id) {
      const { error } = await supabase.from(tableName).delete().eq('id', id);
      if (error) throw error;
    },
  };
};

export const entities = {
  Product:   createEntity('products'),
  MenuItem:  createEntity('menu_items'),
  Order:     createEntity('orders'),
  OrderItem: createEntity('order_items', { order: 'order_id', product: 'product_id' }),
  Cart:      createEntity('carts',       { user: 'user_id' }),
  CartItem:  createEntity('cart_items',  { cart: 'cart_id', product: 'product_id' }),
};
