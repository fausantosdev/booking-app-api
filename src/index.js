import 'dotenv/config'

import app from './App'

const PORT = app.get('port')

app.listen(PORT, () => {
    console.log(`~ Server running on port ${PORT}...`)
})