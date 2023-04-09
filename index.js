require('dotenv').config()
const Converter = new (require('./system/converter'))
const Function = new (require('./system/functions'))
const Scraper = new (require('./system/scraper'))
const MongoDB = /mongo/.test(process.env.DATABASE_URL) && process.env.DATABASE_URL ? new (require('./system/mongo')) : false
const PostgreSQL = /postgres/.test(process.env.DATABASE_URL) && process.env.DATABASE_URL ? new (require('./system/pg')) : false
const Dataset = process.env.DATABASE_URL ? new (require('./system/multidb')) : false
const Extra = require('./system/extra')
const Logs = require('./system/logs')
const NeoxrCommands = new (require('./system/neoxr'))
module.exports = class Component {
   Converter = Converter
   Function = Function
   Scraper = Scraper
   MongoDB = MongoDB
   PostgreSQL = PostgreSQL
   Dataset = Dataset
   Extra = Extra
   Logs = Logs
   NeoxrCommands = NeoxrCommands
}