import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import mysql from 'mysql2/promise'

const app = express()
const port = Number(process.env.API_PORT || 4000)
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'dairy_management',
  waitForConnections: true,
  connectionLimit: 10,
  dateStrings: true,
})

app.use(helmet())
app.use(cors({ origin: process.env.WEB_ORIGIN || 'http://localhost:5173' }))
app.use(express.json({ limit: '100kb' }))

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1')
    res.json({ status: 'ok', database: 'connected' })
  } catch {
    res.status(503).json({ status: 'degraded', database: 'unavailable' })
  }
})

app.get('/api/customers', async (req, res, next) => {
  try {
    const search = `%${String(req.query.search || '')}%`
    const [rows] = await pool.execute(
      `SELECT cust_id AS id, cust_name AS name, cust_contact AS contact,
        cust_address AS address, cattle_type AS cattleType
       FROM customers
       WHERE cust_name LIKE ? OR cust_contact LIKE ?
       ORDER BY cust_id DESC`, [search, search],
    )
    res.json(rows)
  } catch (error) { next(error) }
})

app.post('/api/customers', async (req, res, next) => {
  try {
    const { name, contact, address = '', cattleType } = req.body
    if (!name || !contact || !cattleType) return res.status(400).json({ error: 'name, contact and cattleType are required' })
    const [result] = await pool.execute(
      'INSERT INTO customers (cust_name, cust_contact, cust_address, cattle_type) VALUES (?, ?, ?, ?)',
      [name, contact, address, cattleType],
    )
    res.status(201).json({ id: result.insertId, name, contact, address, cattleType })
  } catch (error) { next(error) }
})

app.get('/api/collections', async (req, res, next) => {
  try {
    const date = req.query.date || new Date().toISOString().slice(0, 10)
    const [rows] = await pool.execute(
      `SELECT dc.ID AS id, dc.customer_id AS customerId, c.cust_name AS customer,
        dc.date, dc.time, dc.shift, dc.litre AS litres, dc.fat, dc.snf,
        dc.rate, dc.total_price AS total
       FROM daily_collection dc JOIN customers c ON c.cust_id = dc.customer_id
       WHERE dc.date = ? ORDER BY dc.ID DESC`, [date],
    )
    res.json(rows)
  } catch (error) { next(error) }
})

app.post('/api/collections', async (req, res, next) => {
  try {
    const { customerId, date, time, shift, litres, fat, snf, rate, total } = req.body
    if (!customerId || !date || !shift || litres === undefined) return res.status(400).json({ error: 'customerId, date, shift and litres are required' })
    const [result] = await pool.execute(
      `INSERT INTO daily_collection (customer_id, date, time, shift, litre, fat, lacto, snf, rate, total_price)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [customerId, date, time || '', shift, litres, fat || 0, 0, snf || 0, rate || 0, total || 0],
    )
    res.status(201).json({ id: result.insertId, ...req.body })
  } catch (error) { next(error) }
})

app.get('/api/payments', async (_req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.ID AS id, p.customer_id AS customerId, c.cust_name AS customer,
        p.days, p.total_litres AS litres, p.total_amount AS amount, p.created_at AS createdAt
       FROM payments p JOIN customers c ON c.cust_id = p.customer_id ORDER BY p.ID DESC`,
    )
    res.json(rows)
  } catch (error) { next(error) }
})

app.use((error, _req, res, _next) => {
  console.error(error)
  res.status(500).json({ error: 'Unexpected server error' })
})

app.listen(port, () => console.log(`DairyManagement API listening on http://localhost:${port}`))
