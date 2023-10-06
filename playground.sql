\c nc_news
SELECT * FROM articles LIMIT 10;

   INSERT INTO articles (author, title, body, topic) VALUES ('grumpy19', 'hi','in body', 'coding') RETURNING *;

SELECT articles.article_id, articles.author, title, topic, articles.created_at, articles.votes, article_img_url,
   COUNT(comments.article_id) AS comment_count 
   FROM articles
    LEFT JOIN comments USING(article_id)
    WHERE articles.article_id = 14
    GROUP BY articles.title, articles.article_id;


SELECT comment_id, votes, created_at, author, body, article_id FROM comments WHERE article_id = 1 ORDER BY created_at DESC;
