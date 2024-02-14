import mongodb, { MongoClient } from 'mongodb'
import dotenv from 'dotenv'
import { Post, jhmUser } from './types'
dotenv.config()

export const mongoClient = new MongoClient(process.env.MONGOURL || '')

export const db = mongoClient.db('JHM')

export const collections = {
    users: db.collection<jhmUser>('Users'),
    posts: db.collection<Post>('Posts')
}