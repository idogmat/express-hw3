import mongoose from "mongoose";
import { BlogTypeBD, PostTypeBD } from "../db/db";
import { ObjectId } from "mongodb";

export interface IQuery {
  searchLoginTerm?: string;
  searchEmailTerm?: string;
  searchNameTerm?: string;
  sortBy?: string;
  sortDirection?: string;
  pageNumber?: string;
  pageSize?: string;
}
export interface INormolizedQuery {
  searchLoginTerm?: string;
  searchEmailTerm?: string;
  searchNameTerm?: string;
  sortBy: string;
  sortDirection: 1 | -1;
  pageNumber: number;
  pageSize: number;
}

export const defaultQuery: INormolizedQuery = {
  sortBy: 'createdAt',
  sortDirection: -1,
  pageNumber: 1,
  pageSize: 10,
}

export interface IQueryBlogsFilterTypeBD {
  pagesCount: number,
  page: number,
  pageSize: number,
  totalCount: number,
  items: BlogTypeBD[]
}

export interface IQueryBlogWithPostsFilterTypeBD {
  pagesCount: number,
  page: number,
  pageSize: number,
  totalCount: number,
  items: PostTypeBD[]
}

export const isValidObjectId = (id: any): false | ObjectId => {
  return ObjectId.isValid(id) ? id : false;
}

export const normolizedQuery = (query: IQuery) => Object.keys(query).reduce<INormolizedQuery>((acc, queryKey) => {
  const key = queryKey as keyof INormolizedQuery
  const value = query[key as keyof INormolizedQuery]
  if (key === 'pageNumber') {
    Number(value) <= 0 ? Object.assign(acc, { [key]: 1 }) : Object.assign(acc, { [key]: Number(value) });
    return acc;
  } else if (key === 'pageSize') {
    Number(value) <= 0 ? Object.assign(acc, { [key]: 10 }) : Object.assign(acc, { [key]: Number(value) });
    return acc;
  } else if (key === 'sortDirection') {
    Object.assign(acc, { [key]: value !== 'asc' ? -1 : 1 });
    return acc;
  }
  value ? Object.assign(acc, { [key]: value }) : undefined

  return acc
}, { ...defaultQuery })