import { ObjectId } from "mongodb"
import mongoose from "mongoose"

export type PostDbType = {
    _id?: ObjectId
    title: string // max 30
    shortDescription: string // max 100
    content: string // max 1000
    blogId: string // valid
    blogName: ObjectId
}