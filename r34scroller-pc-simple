// ==UserScript==
// @name         Sibling-Based Controlled Media Navigation
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Navigate dynamically loaded posts (videos/images) without skipping when older posts are removed.
// @author       You
// @match        *://r34.app/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const POST_SELECTOR = 'li[data-index]'; // Target parent <li> elements
    const MEDIA_SELECTOR = 'video, img'; // Target video and image elements
    let currentPost = null; // Reference to the currently focused post

    // Initialize the script
    function init() {
        disableArrowKeyDefaults(); // Prevent site navigation
        findFirstPost(); // Start by focusing on the first post
        addKeyboardNavigation(); // Enable navigation
    }

    // Focus on the first post when initializing
    function findFirstPost() {
        const firstPost = document.querySelector(POST_SELECTOR);
        if (firstPost) {
            currentPost = firstPost;
            focusMedia(currentPost);
        }
    }

    // Focus on the media (video or image) inside the current post
    function focusMedia(post) {
        const media = post.querySelector(MEDIA_SELECTOR);
        if (media) {
            post.scrollIntoView({ behavior: 'smooth', block: 'center' });
            console.log(`Focused on ${media.tagName.toLowerCase()} in post.`);
        }
    }

    // Navigate to the next or previous sibling post
    function navigate(direction) {
        if (!currentPost) return;

        let nextPost = null;

        if (direction === 1) {
            nextPost = currentPost.nextElementSibling; // Move to the next sibling
        } else if (direction === -1) {
            nextPost = currentPost.previousElementSibling; // Move to the previous sibling
        }

        if (nextPost && nextPost.matches(POST_SELECTOR)) {
            currentPost = nextPost;
            focusMedia(currentPost);
        } else {
            console.log('No more posts in this direction.');
        }
    }

    // Add keyboard navigation (ArrowUp and ArrowDown)
    function addKeyboardNavigation() {
        document.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowDown') {
                event.preventDefault();
                navigate(1); // Move to the next post
            } else if (event.key === 'ArrowUp') {
                event.preventDefault();
                navigate(-1); // Move to the previous post
            }
        });
    }

    // Prevent the default behavior of Arrow keys
    function disableArrowKeyDefaults() {
        window.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                event.preventDefault(); // Stop the site’s default scrolling/navigation
            }
        });
    }

    // Start the script
    window.addEventListener('load', init);
})();
