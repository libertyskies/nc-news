\c nc_news
SELECT * FROM articles LIMIT 10;


SELECT articles.article_id, title, topic, articles.author, articles.created_at, articles.votes, article_img_url, COUNT(comments.article_id) AS comment_count FROM articles
  JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.title, articles.article_id
  ORDER BY created_at ASC;


SELECT article_id, title, topic, author, created_at, votes, article_img_url FROM articles;