

CREATE TABLE "categories" ("id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "name" TEXT, "icon_path" TEXT, "created_at" TIMESTAMP);
INSERT INTO "categories" VALUES (1, 'Birthday', 'birthday_icon.png', '2011-06-29 23:06:37');
INSERT INTO "categories" VALUES (2, 'Love', 'luv.png', '2011-06-29 23:06:37');
INSERT INTO "categories" VALUES (3, 'Fun', 'fun_icon.png', NULL);
INSERT INTO "categories" VALUES (4, 'getwell', 'getwell.png', NULL);
INSERT INTO "categories" VALUES (5, 'kiss', 'kiss_icon.png', NULL);
INSERT INTO "categories" VALUES (6, 'newyear', 'champagne_icon.png', NULL);
INSERT INTO "categories" VALUES (7, 'voyage', 'voyage_icon.png', NULL);
INSERT INTO "categories" VALUES (8, 'congz', 'champagne_icon.png', NULL);


CREATE TABLE "messages" ("id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "body" TEXT, "created_at" TIMESTAMP, "category_id" INTEGER NOT NULL);
INSERT INTO "messages" VALUES (1, 'I love you!', '2011-06-29 23:06:37', 2);
INSERT INTO "messages" VALUES (2, 'Kiss', NULL, 5);
INSERT INTO "messages" VALUES (3, 'I miss you', NULL, 2);
INSERT INTO "messages" VALUES (4, 'I''m crazy about you', NULL, 2);
INSERT INTO "messages" VALUES (5, 'Congratulations!', NULL, 8);
INSERT INTO "messages" VALUES (6, 'Happy new year', '', 6);
INSERT INTO "messages" VALUES (7, 'Happy birthday!', '2011-06-29 23:06:37', 1);
INSERT INTO "messages" VALUES (8, 'Bon voyage', '', 7);
INSERT INTO "messages" VALUES (9, 'Have fun', '', 3);
INSERT INTO "messages" VALUES (10, 'Get well soon', '', 4);


CREATE TABLE "translations" (
"body" TEXT,
"created_at" TIMESTAMP,
"lang" TEXT NOT NULL,
"message_id" INTEGER NOT NULL,
"size" INTEGER,
"family" TEXT,
PRIMARY KEY (lang, message_id)
);
INSERT INTO "translations" VALUES ('생일축하해!', NULL, 'ko', 7, 58, 'SD DanA-M');
INSERT INTO "translations" VALUES ('사랑해!', NULL, 'ko', 1, 67, 'SD_PicasoB');
INSERT INTO "translations" VALUES ('我爱你', NULL, 'cn', 1, 64, 'KaiTi');
INSERT INTO "translations" VALUES ('吻', '', 'cn', 2, 81, 'KaiTi');
INSERT INTO "translations" VALUES ('뽀뽀~', NULL, 'ko', 2, 69, 'SD_Puzzle Bk');
INSERT INTO "translations" VALUES ('보고싶어..!', NULL, 'ko', 3, 61, 'SD_PicasoB');
INSERT INTO "translations" VALUES ('너에게빠졌어!', NULL, 'ko', 4, 50, 'SD_PicasoB');
INSERT INTO "translations" VALUES ('축하해요!', NULL, 'ko', 5, 72, 'SD DanA-M');
INSERT INTO "translations" VALUES ('새해복많이받으세요', NULL, 'ko', 6, 36, 'SD DanA-M');
INSERT INTO "translations" VALUES ('여행잘다녀오세요', NULL, 'ko', 8, 41, 'SD_PicasoB');
INSERT INTO "translations" VALUES ('잘놀다와^^', NULL, 'ko', 9, 60, 'SD_PicasoB');
INSERT INTO "translations" VALUES ('빨리나아~', NULL, 'ko', 10, 64, 'SD DanA-M');
INSERT INTO "translations" VALUES ('我 想 你', NULL, 'cn', 3, 71, 'KaiTi');
INSERT INTO "translations" VALUES ('你让我发疯', '', 'cn', 4, 55, 'KaiTi');
INSERT INTO "translations" VALUES ('恭喜', NULL, 'cn', 5, 66, 'KaiTi');
INSERT INTO "translations" VALUES ('周年快樂！', NULL, 'cn', 6, 66, 'KaiTi');
INSERT INTO "translations" VALUES ('生日快乐', NULL, 'cn', 7, 66, 'KaiTi');
INSERT INTO "translations" VALUES ('祝你旅途愉快', NULL, 'cn', 8, 47, 'KaiTi');
INSERT INTO "translations" VALUES ('玩得开心点', NULL, 'cn', 9, 47, 'KaiTi');
INSERT INTO "translations" VALUES ('早日康复', '', 'cn', 10, 55, 'KaiTi');
INSERT INTO "translations" VALUES ('Je t''aime', NULL, 'fr', 1, 52, 'Jellyka -ove and Passion');
INSERT INTO "translations" VALUES ('Bisous', NULL, 'fr', 2, 100, 'Words of love');
INSERT INTO "translations" VALUES ('Tu me manques!', NULL, 'fr', 3, 30, 'Daniel Black');
INSERT INTO "translations" VALUES ('Je suis fou de toi!', NULL, 'fr', 4, 34, 'Jellyka -ove and Passion');
INSERT INTO "translations" VALUES ('Félicitations!', NULL, 'fr', 5, 58, 'Rage Italic');
INSERT INTO "translations" VALUES ('Bonne année!', NULL, 'fr', 6, 37, 'Daniel Black');
INSERT INTO "translations" VALUES ('Soigne-toi bien', NULL, 'fr', 10, 65, 'Christopherhand');
INSERT INTO "translations" VALUES ('Bon anniversaire!', NULL, 'fr', 7, 37, 'Set Fire to the Rain');
INSERT INTO "translations" VALUES ('Bon voyage!', NULL, 'fr', 8, 86, 'Christopherhand');
INSERT INTO "translations" VALUES ('Amuse-toi bien!', NULL, 'fr', 9, 71, 'Christopherhand');
INSERT INTO "translations" VALUES ('I love you', NULL, 'en', 1, 50, 'Jellyka -ove and Passion');
INSERT INTO "translations" VALUES ('Kiss', NULL, 'en', 2, 140, 'Words of love');
INSERT INTO "translations" VALUES ('I miss you!', NULL, 'en', 3, 49, 'Daniel Black');
INSERT INTO "translations" VALUES ('I''m crazy about you', NULL, 'en', 4, 34, 'Jellyka -ove and Passion');
INSERT INTO "translations" VALUES ('Congratulations!', NULL, 'en', 5, 68, 'Christopherhand');
INSERT INTO "translations" VALUES ('Happy new year', NULL, 'en', 6, 62, 'Christopherhand');
INSERT INTO "translations" VALUES ('Happy birthday', NULL, 'en', 7, 39, 'Set Fire to the Rain');
INSERT INTO "translations" VALUES ('Bon voyage', NULL, 'en', 8, 86, 'Christopherhand');
INSERT INTO "translations" VALUES ('Have fun!', NULL, 'en', 9, 100, 'Christopherhand');
INSERT INTO "translations" VALUES ('Get well soon!', NULL, 'en', 10, 65, 'Christopherhand');
INSERT INTO "translations" VALUES ('愛してるよ', NULL, 'jp', 1, 60, 'Holiday-MDJP02');
INSERT INTO "translations" VALUES ('キス', NULL, 'jp', 2, 117, 'YAKITORI');
INSERT INTO "translations" VALUES ('あいたいよ', NULL, 'jp', 3, 69, 'YAKITORI');
INSERT INTO "translations" VALUES ('私はあなたに夢中よ', NULL, 'jp', 4, 33, 'Holiday-MDJP02');
INSERT INTO "translations" VALUES ('おめでとうございます', NULL, 'jp', 5, 36, 'YAKITORI');
INSERT INTO "translations" VALUES ('あけましておめでとう', NULL, 'jp', 6, 39, 'YAKITORI');
INSERT INTO "translations" VALUES ('お誕生日おめでとう', NULL, 'jp', 7, 35, 'Holiday-MDJP02');
INSERT INTO "translations" VALUES ('道中ご無事に', NULL, 'jp', 8, 48, 'Holiday-MDJP02');
INSERT INTO "translations" VALUES ('楽しんで', NULL, 'jp', 9, 68, 'Holiday-MDJP02');
INSERT INTO "translations" VALUES ('お大事に!', NULL, 'jp', 10, 59, 'Holiday-MDJP02');
