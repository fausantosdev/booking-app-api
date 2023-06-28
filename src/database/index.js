import mongoose from 'mongoose'

class Database {
  constructor() {
    this.mongo()
  }

  mongo() {
    mongoose.set('strictQuery', false)
    
    this.mongoConnection = mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      //useFindAndModify: true,
      useUnifiedTopology: true,
    })

    const db = mongoose.connection

    db.on('open', function() {
      console.log('~ mongo connected...')
    })

    db.on('disconnected', () => {
      console.log('~ mongo disconnected...')
    })

    db.on('error', console.error.bind(console, 'connection error: '))
  }
}

export default new Database()
