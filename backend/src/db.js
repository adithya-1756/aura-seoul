const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

class Database {
  constructor() {
    this.data = {
      users: [],
      categories: [],
      products: [],
      variants: [],
      inventory: [],
      carts: [],
      wishlists: [],
      addresses: [],
      orders: [],
      coupons: [],
      reviews: [],
      content: {
        announcements: [],
        heroBanners: [],
        promotionalBanners: [],
        siteSettings: {}
      },
      subscribers: []
    };
    this.init();
  }

  init() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        if (raw && raw.trim().length > 0) {
          this.data = JSON.parse(raw);
          console.log('[DB] Database loaded successfully from', DB_FILE);
          return;
        }
      }
    } catch (err) {
      console.error('[DB] Error reading db.json, re-initializing with seed data:', err.message);
    }

    // Seed database if empty or first run
    console.log('[DB] Seeding initial database...');
    const seedData = require('../data/seedData');
    this.data = seedData.getInitialData();
    this.save();
    console.log('[DB] Seed data initialized and saved.');
  }

  save() {
    try {
      const tempFile = `${DB_FILE}.tmp`;
      fs.writeFileSync(tempFile, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tempFile, DB_FILE);
    } catch (err) {
      // Fallback direct write
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    }
  }

  generateId(prefix = 'id') {
    return `${prefix}_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
  }

  find(table, filterFn = null) {
    if (!this.data[table]) return [];
    if (!filterFn) return [...this.data[table]];
    return this.data[table].filter(filterFn);
  }

  findById(table, id) {
    if (!this.data[table]) return null;
    return this.data[table].find(item => item.id === id) || null;
  }

  findOne(table, filterFn) {
    if (!this.data[table]) return null;
    return this.data[table].find(filterFn) || null;
  }

  insert(table, record) {
    if (!this.data[table]) {
      this.data[table] = [];
    }
    const newRecord = {
      id: record.id || this.generateId(table.slice(0, 3)),
      ...record,
      createdAt: record.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data[table].push(newRecord);
    this.save();
    return newRecord;
  }

  update(table, id, updates) {
    if (!this.data[table]) return null;
    const index = this.data[table].findIndex(item => item.id === id);
    if (index === -1) return null;
    this.data[table][index] = {
      ...this.data[table][index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.save();
    return this.data[table][index];
  }

  delete(table, id) {
    if (!this.data[table]) return false;
    const initialLen = this.data[table].length;
    this.data[table] = this.data[table].filter(item => item.id !== id);
    const deleted = this.data[table].length < initialLen;
    if (deleted) this.save();
    return deleted;
  }

  getContent() {
    return this.data.content || {};
  }

  updateContent(section, payload) {
    if (!this.data.content) this.data.content = {};
    this.data.content[section] = payload;
    this.save();
    return this.data.content[section];
  }

  // Atomic transaction support for orders and inventory deductions
  transaction(callback) {
    const backup = JSON.parse(JSON.stringify(this.data));
    try {
      const result = callback(this);
      this.save();
      return result;
    } catch (err) {
      this.data = backup;
      throw err;
    }
  }
}

const db = new Database();
module.exports = db;
