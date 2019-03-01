// ==UserScript==
// @name         Backlog highlighter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://prj.adyax.com/rb/master_backlog/*
// @grant        none
// ==/UserScript==

(function($) {
    'use strict';
    function preprocessTags(title) {
        let reg = /\[([^\]]+)\]/ig;

        let matches = [];

        let match;
        while ((match = reg.exec(title))) {
            matches.push(match[1]);
        }

        let cleanedString = String(title).replace(reg, '');

        return {
            matches,
            clean: cleanedString
        }
    }

    let $styleEl = $('<link></link>');
    $styleEl.attr('href', '/plugin_assets/redmine_tags/stylesheets/redmine_tags.css');
    $styleEl.attr('rel', 'stylesheet');
    $styleEl.attr('type', 'text/css');

    $('head').append($styleEl);

    let $backlogs = $('#sprint_backlogs_container').eq(0).find('.backlog');
    $backlogs.each((index, backlog) => {
        let $backlog = $(backlog);
        let $stories = $backlog.find('ul.stories li.story');
        $stories.each((index, story) => {
            let $story = $(story);
            let $titleEl = $story.find('.story_field span.subject').eq(0);
            let preprocessed = preprocessTags($titleEl.html());
            let newTitle = String(preprocessed.clean).replace(/^[\- ]+/i, '');

            $titleEl.html(newTitle);

            preprocessed.matches.forEach((value, index) => {
                let $spanEl = $('<span></span>');
                $spanEl.addClass('tag-label-color backlog-issue-tag issue-tag-' + String(index));
                $spanEl.html($('<a href="javascript::void(0)">' + value + '</a>'));
                $spanEl.prependTo($titleEl);
            });

        });
    });
    // Your code here...
})(jQuery);