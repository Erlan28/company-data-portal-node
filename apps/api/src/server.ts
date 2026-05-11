import express from 'express'
import cors from 'cors'

import companyRoutes from './routes/company.routes'
import authRoutes from './routes/auth.routes'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/auth', authRoutes)
app.use('/companies', companyRoutes)

app.get('/', (req, res) => {
    res.send('API Running')
})

app.listen(5000, () => {
    console.log('Server running on port 5000')
})