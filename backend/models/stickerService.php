<?php

require_once __DIR__ . '/../database/db.class.php';
require_once __DIR__ . '/sticker.php';

class StickerService
{
    function getSavedStickers($username)
    {
        $db = DB::getConnection();

        try {
            $st = $db->prepare('SELECT s.* FROM stickeri s INNER JOIN spremljeni_stickeri ss ON s.sticker_id = ss.sticker_id INNER JOIN korisnici k ON ss.user_id = k.id WHERE k.username=:username');
            $st->execute(array('username' => $username));
        } catch (PDOException $e) {
            exit('Greška u bazi: ' . $e->getMessage());
        }

        $stickers = array();
        while ($row = $st->fetch()) {
            $stickers[] = new Sticker($row['sticker_id'], $row['sticker'], $row['user_id'], $row['date'], $row['saves']);
        }

        return $stickers;
    }

    function getUserStickers($username)
    {
        $db = DB::getConnection();

        try {
            $st = $db->prepare('SELECT s.* FROM stickeri s, korisnici k WHERE s.user_id = k.id AND k.username=:username');
            $st->execute(array('username' => $username));
        } catch (PDOException $e) {
            exit('Greška u bazi: ' . $e->getMessage());
        }

        $stickers = array();
        while ($row = $st->fetch()) {
            $stickers[] = new Sticker($row['sticker_id'], $row['sticker'], $row['user_id'], $row['date'], $row['saves']);
        }

        return $stickers;
    }

    function getFilteredStickers($filter)
    {
        $db = DB::getConnection();
        $stickers = array();

        if (empty($filter)) {
            try {
                $st = $db->prepare('SELECT ss.* FROM stickeri ss');
                $st->execute();
            } catch (PDOException $e) {
                exit('Greška u bazi: ' . $e->getMessage());
            }

            while ($row = $st->fetch()) {
                $stickers[] = new Sticker($row['sticker_id'], $row['sticker'], $row['user_id'], $row['date'], $row['saves']);
            }
        } else {
            foreach ($filter as $f) {
                try {
                    $st = $db->prepare('SELECT ss.* FROM stickeri ss, opis_stickera s WHERE ss.sticker_id = s.sticker_id AND s.hashtag=:opis');
                    $st->execute(array('opis' => $f));
                } catch (PDOException $e) {
                    exit('Greška u bazi: ' . $e->getMessage());
                }

                while ($row = $st->fetch()) {
                    $newSticker = new Sticker($row['sticker_id'], $row['sticker'], $row['user_id'], $row['date'], $row['saves']);
                    $isDuplicate = false;

                    foreach ($stickers as $existingSticker) {
                        if ($existingSticker->sticker_id === $newSticker->sticker_id) {
                            $isDuplicate = true;
                            break;
                        }
                    }

                    if (!$isDuplicate) {
                        $stickers[] = $newSticker;
                    }
                }
            }
        }

        return $stickers;
    }

    function changedStickersAdd($username, $name)
    {
        $db = DB::getConnection();

        try {
            $stt = $st = $db->prepare('SELECT id FROM korisnici WHERE username=:username');
            $stt->execute(array('username' => $username));
            $st = $db->prepare('SELECT s.* FROM stickeri s WHERE s.sticker_id=:ime');
            $st->execute(array('ime' => $name));
        } catch (PDOException $e) {
            exit('Greška u bazi: ' . $e->getMessage());
        }

        $id = $stt->fetch();
        $row = $st->fetch();

        $temp = $row['saves'];
        $temp = $temp + 1;

        try {
            $st = $db->prepare('UPDATE stickeri SET saves=:br WHERE sticker_id=:ime');
            $st->execute(array('ime' => $name, 'br' => $temp));

            $stt = $db->prepare('INSERT INTO spremljeni_stickeri SET user_id=:korisnik, 
                                sticker_id=:sticker');
            $stt->execute(array('korisnik' => $id['id'], 'sticker' => $name));
        } catch (PDOException $e) {
            exit('Greška u bazi: ' . $e->getMessage());
        }

        return true;
    }

    function changedStickersRemove($username, $name)
    {
        $db = DB::getConnection();

        try {
            $stt = $st = $db->prepare('SELECT id FROM korisnici WHERE username=:username');
            $stt->execute(array('username' => $username));
            $st = $db->prepare('SELECT s.* FROM stickeri s WHERE s.sticker_id=:ime');
            $st->execute(array('ime' => $name));
        } catch (PDOException $e) {
            exit('Greška u bazi: ' . $e->getMessage());
        }

        $id = $stt->fetch();
        $row = $st->fetch();

        $temp = $row['saves'];
        $temp = $temp - 1;
        try {
            $st = $db->prepare('UPDATE stickeri SET saves=:br WHERE sticker_id=:ime');
            $st->execute(array('ime' => $name, 'br' => $temp));

            $stt = $db->prepare('DELETE FROM spremljeni_stickeri WHERE user_id=:korisnik AND 
                                sticker_id=:sticker');
            $stt->execute(array('korisnik' => $id['id'], 'sticker' => $name));
        } catch (PDOException $e) {
            exit('Greška u bazi: ' . $e->getMessage());
        }

        return true;
    }

    function uploadSticker($username, $blob, $tags)
    {
        $db = DB::getConnection();

        try {
            $stt = $st = $db->prepare('SELECT id FROM korisnici WHERE username=:username');
            $stt->execute(array('username' => $username));
        } catch (PDOException $e) {
            exit('Greška u bazi: ' . $e->getMessage());
        }

        $id = $stt->fetch();
        try {
            date_default_timezone_set('Europe/Zagreb');
            $st = $db->prepare('INSERT INTO stickeri SET user_id=:korisnik, sticker=:sticker,
                                date=:date, saves=0');
            $st->execute(array('korisnik' => $id['id'], 'sticker' => $blob, 'date' => date('Y-m-d H:i:s')));

            $stt = $db->prepare('SELECT sticker_id FROM stickeri WHERE user_id=:korisnik AND sticker=:sticker');
            $stt->execute(array('korisnik' => $id['id'], 'sticker' => $blob));

            $stick = $stt->fetch();

            $sttt = $db->prepare('INSERT INTO spremljeni_stickeri SET user_id=:korisnik, sticker_id=:stick');
            $sttt->execute(array('korisnik' => $id['id'], 'stick' => $stick['sticker_id']));

            foreach ($tags as $tag) {
                $q = $db->prepare('INSERT INTO opis_stickera SET sticker_id=:sticker, hashtag=:tag');
                $q->execute(array('sticker' => $stick['sticker_id'], 'tag' => $tag));
            }
        } catch (PDOException $e) {
            exit('Greška u bazi: ' . $e->getMessage());
        }

        return true;
    }
}
