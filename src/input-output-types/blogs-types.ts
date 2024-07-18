export interface BlogInputModel {
  name: string; // max 15
  description: string; // max 500
  websiteUrl: string; // max 100 ^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$
  createdAt: Date;
}

export interface BlogViewModel {
  id: string;
  name: string; // max 15
  description: string; // max 500
  websiteUrl: string; // max 100 ^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$
  createdAt: Date;
  isMembership: boolean;
}
