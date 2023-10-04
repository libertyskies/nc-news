\c nc_news
SELECT * FROM articles LIMIT 10;

SELECT articles.article_id, articles.author, title, topic, articles.created_at, articles.votes, article_img_url, 
    COUNT(comments.article_id) AS comment_count 
    FROM articles
    LEFT JOIN comments USING(article_id)
    WHERE articles.article_id = 1
    GROUP BY articles.title, articles.article_id;
   
