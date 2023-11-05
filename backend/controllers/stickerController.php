<?php


require_once __DIR__ . '/../models/stickerService.php';
require_once __DIR__ . '/../models/sticker.php';
require_once __DIR__ . '/../database/db.class.php';

class StickerController
{

    function savedStickers($username)
    {
        $ss = new StickerService();

        $stickers = $ss->getSavedStickers($username);

        return $stickers;
    }

    function userStickers($username)
    {
        $ss = new StickerService();

        $stickers = $ss->getUserStickers($username);

        return $stickers;
    }

    function filteredStickers($filter)
    {
        $ss = new StickerService();

        $stickers = $ss->getFilteredStickers($filter);

        return $stickers;
    }

    function changeStickerAdd($username, $ime)
    {
        $ss = new StickerService();

        $ss->changedStickersAdd($username, $ime);
    }

    function changeStickerRemove($username, $ime)
    {
        $ss = new StickerService();

        $ss->changedStickersRemove($username, $ime);
    }

    function uploadSticker($username, $blob, $tags)
    {
        $ss = new StickerService();

        $ss->uploadSticker($username, $blob, $tags);
    }
}
