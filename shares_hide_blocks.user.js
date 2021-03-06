// ==UserScript==
// @name         Torn: Stocks: Hide blocks
// @namespace    lugburz.stocks.hide_blocks
// @version      0.1.4
// @description  Allows to hide certain stock blocks from the list.
// @author       Lugburz
// @match        https://www.torn.com/stockexchange.php?step=portfolio
// @match        https://www.torn.com/laptop.php*
// @require      https://github.com/f2404/torn-userscripts/raw/master/lib/lugburz_lib.js
// @updateURL    https://github.com/f2404/torn-userscripts/raw/master/shares_hide_blocks.user.js
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

function showHideFirstId(show, firstId, secondId) {
    if (show) {
        $('#'+firstId).show();
        $('#'+secondId).hide();
    } else {
        $('#'+firstId).hide();
        $('#'+secondId).show();
    }
}

function showHideBlocks() {
    $('ul.stock-cont > li.item-wrap').each(function(index) {
        if ($(this).find('ul.item > li.logo').find('#hideBtn').length > 0) {
            // already added
            return;
        }

        let count = $(this).find('ul.item > li.info > div.b-price-wrap > div.first-row').html();
        count = count.replace('<span class="bold">Shares:</span>', '').trim();
        const name = $(this).attr('data-stock');
        const blockId = $(this).attr('id');
        const liId = 'show-' + blockId;

        $(this).find('ul.item > li.logo').append('<a href="#" id="hideBtn" class="t-blue h t-hide" role="button" style="position: absolute; top: 5px; right: 5px;">Hide</a>');

        const html = '<li id="' + liId + '" class="info"><div class="qualify-wrap" style="height: 22px; line-height: 22px; padding: 0 7px;">The <b>' +
            name.toUpperCase() + '</b> block (<b>' + count + '</b> shares) is hidden <span id="showBtn" class="action">' +
            '<a href="#" class="t-blue h t-hide" role="button">Show</a></span></div><div class="delimiter-wrap"></div></li>';
        $('ul.stock-cont').append(html);

        if (GM_getValue(blockId) == 'hidden') {
            showHideFirstId(false, blockId, liId);
        } else {
            showHideFirstId(true, blockId, liId);
        }

        $(this).find('#hideBtn').on('click', function() {
            showHideFirstId(false, blockId, liId);
            GM_setValue(blockId, 'hidden');
        });

        $('#'+liId).find('#showBtn').on('click', function() {
            showHideFirstId(true, blockId, liId);
            GM_setValue(blockId, '');
        });
    });
}

(function() {
    'use strict';

    // Your code here...
    ajax((page) => {
        if (page != "stockexchange") return;
        $('ul.stock-cont').ready(showHideBlocks);
    });

    $('ul.stock-cont').ready(showHideBlocks);
})();
