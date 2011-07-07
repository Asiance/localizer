

CREATE TABLE "categories" ("id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "name" TEXT, "icon_path" TEXT, "created_at" TIMESTAMP);
INSERT INTO "categories" VALUES (1, 'Birthday', 'cupcake.png', '2011-06-29 23:06:37');
INSERT INTO "categories" VALUES (2, 'Love', 'luv.png', '2011-06-29 23:06:37');


CREATE TABLE "messages" ("id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "body" TEXT, "created_at" TIMESTAMP, "category_id" INTEGER NOT NULL);
INSERT INTO "messages" VALUES (1, 'I love you!', '2011-06-29 23:06:37', 2);
INSERT INTO "messages" VALUES (2, 'Kiss', NULL, 2);
INSERT INTO "messages" VALUES (3, 'I miss you', NULL, 2);
INSERT INTO "messages" VALUES (4, 'I''m crazy about you', NULL, 2);
INSERT INTO "messages" VALUES (5, 'Congratulations!', NULL, 1);
INSERT INTO "messages" VALUES (6, 'Happy new year', '', 2);
INSERT INTO "messages" VALUES (7, 'Happy birthday!', '2011-06-29 23:06:37', 1);
INSERT INTO "messages" VALUES (8, 'Bon voyage', '', 1);
INSERT INTO "messages" VALUES (9, 'Have fun', '', 2);
INSERT INTO "messages" VALUES (10, 'Get well soon', '', 2);


CREATE TABLE "translations" (
"body" TEXT,
"created_at" TIMESTAMP,
"lang" TEXT NOT NULL,
"message_id" INTEGER NOT NULL,
"size" INTEGER,
"family" TEXT,
PRIMARY KEY (lang, message_id)
);
INSERT INTO "translations" VALUES ('생일축하해!', NULL, 'ko', 7, 35, 'Malgun Gothic');
INSERT INTO "translations" VALUES ('사랑해!', NULL, 'ko', 1, 35, 'Malgun Gothic');
INSERT INTO "translations" VALUES ('我爱你', NULL, 'cn', 1, 50, 'Kai');
INSERT INTO "translations" VALUES ('吻', '', 'cn', 2, 60, 'Kai');
INSERT INTO "translations" VALUES ('뽀뽀~', NULL, 'ko', 2, 35, 'Malgun Gothic');
INSERT INTO "translations" VALUES ('보고싶어!', NULL, 'ko', 3, 35, 'Malgun Gothic');
INSERT INTO "translations" VALUES ('너에게빠졌어..', NULL, 'ko', 4, 35, 'Malgun Gothic');
INSERT INTO "translations" VALUES ('축하해요! ', NULL, 'ko', 5, 35, 'Malgun Gothic');
INSERT INTO "translations" VALUES ('새해복많이받으세요', NULL, 'ko', 6, 27, 'Malgun Gothic');
INSERT INTO "translations" VALUES ('여행잘다녀오세요', NULL, 'ko', 8, 25, 'Malgun Gothic');
INSERT INTO "translations" VALUES ('잘놀다와^^', NULL, 'ko', 9, 35, 'Malgun Gothic');
INSERT INTO "translations" VALUES ('빨리나아~', NULL, 'ko', 10, 35, 'Malgun Gothic');
INSERT INTO "translations" VALUES ('我 想 你', NULL, 'cn', 3, 60, 'Kai');
INSERT INTO "translations" VALUES ('你让我发疯', '', 'cn', 4, 50, 'Kai');
INSERT INTO "translations" VALUES ('恭喜', NULL, 'cn', 5, 60, 'Kai');
INSERT INTO "translations" VALUES ('周年快樂！', NULL, 'cn', 6, 60, 'Kai');
INSERT INTO "translations" VALUES ('生日快乐', NULL, 'cn', 7, 60, 'Kai');
INSERT INTO "translations" VALUES ('祝你旅途愉快', NULL, 'cn', 8, 45, 'Kai');
INSERT INTO "translations" VALUES ('玩得开心点', NULL, 'cn', 9, 52, 'Kai');
INSERT INTO "translations" VALUES ('早日康复', '', 'cn', 10, 53, 'Kai');
INSERT INTO "translations" VALUES ('Je t''aime', NULL, 'fr', 1, 62, 'Jellyka -ove and Passion');
INSERT INTO "translations" VALUES ('Bisous!', NULL, 'fr', 2, 125, 'Words of love');
INSERT INTO "translations" VALUES ('Tu me manques', NULL, 'fr', 3, 70, 'MC Sweetie Hearts');
INSERT INTO "translations" VALUES ('Je suis fou de toi!', NULL, 'fr', 4, 34, 'Jellyka -ove and Passion');
INSERT INTO "translations" VALUES ('Félicitations!', NULL, 'fr', 5, 81, 'Christopherhand');
INSERT INTO "translations" VALUES ('Bonne année!', NULL, 'fr', 6, 74, 'Christopherhand');
INSERT INTO "translations" VALUES ('Soigne-toi bien', NULL, 'fr', 10, 65, 'Christopherhand');
INSERT INTO "translations" VALUES ('Bon anniversaire!', NULL, 'fr', 7, 37, 'Set Fire to the Rain');
INSERT INTO "translations" VALUES ('Bon voyage!', NULL, 'fr', 8, 86, 'Christopherhand');
INSERT INTO "translations" VALUES ('Amuse-toi bien!', NULL, 'fr', 9, 71, 'Christopherhand');
INSERT INTO "translations" VALUES ('I love you♡', NULL, 'en', 1, 62, 'Jellyka -ove and Passion');
INSERT INTO "translations" VALUES ('Kiss', NULL, 'en', 2, 140, 'Words of love');
INSERT INTO "translations" VALUES ('I miss you', NULL, 'en', 3, 87, 'MC Sweetie Hearts');
INSERT INTO "translations" VALUES ('I''m crazy about you', NULL, 'en', 4, 34, 'Jellyka -ove and Passion');
INSERT INTO "translations" VALUES ('Congratulations!', NULL, 'en', 5, 68, 'Christopherhand');
INSERT INTO "translations" VALUES ('Happy new year', NULL, 'en', 6, 62, 'Christopherhand');
INSERT INTO "translations" VALUES ('Happy birthday', NULL, 'en', 7, 39, 'Set Fire to the Rain');
INSERT INTO "translations" VALUES ('Bon voyage', NULL, 'en', 8, 86, 'Christopherhand');
INSERT INTO "translations" VALUES ('Have fun!', NULL, 'en', 9, 100, 'Christopherhand');
INSERT INTO "translations" VALUES ('Get well soon!', NULL, 'en', 10, 65, 'Christopherhand');
INSERT INTO "translations" VALUES ('愛してるよ', NULL, 'jp', 1, 50, 'MS Gothic');
INSERT INTO "translations" VALUES ('キス♡', NULL, 'jp', 2, 50, 'MS Gothic');
INSERT INTO "translations" VALUES ('あいたいよ', NULL, 'jp', 3, 30, 'MS Gothic');
INSERT INTO "translations" VALUES ('私はあなたに夢中よ', NULL, 'jp', 4, 30, 'MS Gothic');
INSERT INTO "translations" VALUES ('おめでとうございます', NULL, 'jp', 5, 30, 'MS Gothic');
INSERT INTO "translations" VALUES ('あけましておめでとう', NULL, 'jp', 6, 30, 'MS Gothic');
INSERT INTO "translations" VALUES ('お誕生日おめでとう', NULL, 'jp', 7, 30, 'MS Gothic');
INSERT INTO "translations" VALUES ('道中ご無事に', NULL, 'jp', 8, 30, 'MS Gothic');
INSERT INTO "translations" VALUES ('楽しんで', NULL, 'jp', 9, 30, 'MS Gothic');
INSERT INTO "translations" VALUES ('お大事に!', NULL, 'jp', 10, 30, 'MS Gothic');
