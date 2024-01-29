export interface NewsAPIResponse {
  totalArticles: number;
  articles:      Article[];
}

export interface Article {
  title:       string;
  description: string;
  content:     string;
  url:         string;
  image:       string;
  publishedAt: Date;
  source:      Source;
}

export interface Source {
  name: string;
  url:  string;
}
