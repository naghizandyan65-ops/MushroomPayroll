// src/services/database.ts
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('mushroom.db');

export const initDatabase = async () => {
  try {
    await db.execAsync(`
      PRAGMA foreign_keys = ON;
      
      CREATE TABLE IF NOT EXISTS workers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        phone TEXT
      );
      
      CREATE TABLE IF NOT EXISTS jobs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT UNIQUE NOT NULL,
        amount INTEGER NOT NULL,
        unit TEXT
      );
      
      CREATE TABLE IF NOT EXISTS factories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        address TEXT
      );
      
      CREATE TABLE IF NOT EXISTS daily_missions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        mission_date TEXT NOT NULL,
        job_id INTEGER NOT NULL,
        factory_id INTEGER NOT NULL,
        total_amount INTEGER NOT NULL,
        FOREIGN KEY (job_id) REFERENCES jobs(id),
        FOREIGN KEY (factory_id) REFERENCES factories(id)
      );
      
      CREATE TABLE IF NOT EXISTS mission_workers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        mission_id INTEGER NOT NULL,
        worker_id INTEGER NOT NULL,
        share_amount INTEGER NOT NULL,
        FOREIGN KEY (mission_id) REFERENCES daily_missions(id) ON DELETE CASCADE,
        FOREIGN KEY (worker_id) REFERENCES workers(id)
      );
      
      CREATE TABLE IF NOT EXISTS deductions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        mission_worker_id INTEGER NOT NULL,
        type TEXT NOT NULL,
        quantity REAL,
        unit_price INTEGER,
        amount INTEGER NOT NULL,
        description TEXT,
        FOREIGN KEY (mission_worker_id) REFERENCES mission_workers(id) ON DELETE CASCADE
      );
      
      CREATE TABLE IF NOT EXISTS settlements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        factory_id INTEGER NOT NULL,
        settlement_date TEXT NOT NULL,
        paid_amount INTEGER NOT NULL,
        remaining_balance INTEGER NOT NULL,
        note TEXT,
        FOREIGN KEY (factory_id) REFERENCES factories(id)
      );
      
      CREATE INDEX IF NOT EXISTS idx_mission_date ON daily_missions(mission_date);
      CREATE INDEX IF NOT EXISTS idx_mission_worker ON mission_workers(mission_id, worker_id);
    `);
    
    console.log('✅ دیتابیس با موفقیت راه‌اندازی شد');
    return true;
  } catch (error) {
    console.error('❌ خطا در راه‌اندازی دیتابیس:', error);
    return false;
  }
};
