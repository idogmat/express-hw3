import mongoose from "mongoose"
import { PostViewModel } from "./posts-types"
import { ObjectId } from "mongodb"

export interface BlogInputModel {
  name: string // max 15
  description: string // max 500
  websiteUrl: string // max 100 ^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$
  createdAt: Date
}

export interface BlogViewModel {
  id: ObjectId
  name: string // max 15
  description: string // max 500
  websiteUrl: string // max 100 ^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$
  createdAt: Date
  isMembership: boolean
}

