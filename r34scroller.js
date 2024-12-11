// ==UserScript==
// @name         TikTok-style Post Viewer with Video Autoplay Control
// @namespace    https://viayoo.com/
// @version      1.8
// @description  View posts one at a time with autoplay, navigation buttons, lock scroll, and play/pause toggle.
// @author       MrXewrath
// @run-at       document-end
// @match        https://r34.app/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    let posts = document.querySelectorAll('li[data-index]');
    let currentIndex = 0;
    let scrollLocked = true; // Scroll lock toggle default
    let autoplayEnabled = true; // Toggle for play calls

    // Ensure page fits one post at a time
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.margin = '0';

    // Style posts to fit fullscreen and allow scrolling
    function initializePosts() {
        posts = document.querySelectorAll('li[data-index]');
        posts.forEach((post, index) => {
            post.style.position = 'absolute';
            post.style.top = '0';
            post.style.left = '0';
            post.style.width = '100%';
            post.style.height = '100vh';
            post.style.display = index === 0 ? 'block' : 'none';
            post.style.zIndex = '1';
            post.style.overflowY = scrollLocked ? 'hidden' : 'auto';
            post.style.backgroundColor = '#000';
            post.classList.add('scrollable-post');
        });
    }

    // Function to show the current post, hide others, and control videos
    function showPost(index) {
        if (index < 0 || index >= posts.length) return;

        posts.forEach((post, i) => {
            const video = post.querySelector('video');
            if (i === index) {
                post.style.display = 'block';
                if (autoplayEnabled && video) {
                    video.play().catch(err => console.warn("Autoplay failed:", err));
                }
            } else {
                post.style.display = 'none';
                if (video) video.pause();
            }
        });
    }

    // Function to pause all videos
    function pauseAllVideos() {
        posts.forEach(post => {
            const video = post.querySelector('video');
            if (video) video.pause();
        });
    }

    // Swipe detection
    let touchStartY = 0;

    document.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    });

    document.addEventListener('touchend', (e) => {
        if (!scrollLocked) return;

        const touchEndY = e.changedTouches[0].clientY;
        if (touchEndY < touchStartY - 30 && currentIndex < posts.length - 1) {
            currentIndex++;
            showPost(currentIndex);
        } else if (touchEndY > touchStartY + 30 && currentIndex > 0) {
            currentIndex--;
            showPost(currentIndex);
        }
    });

    // Arrow key navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' && currentIndex < posts.length - 1) {
            currentIndex++;
            showPost(currentIndex);
        } else if (e.key === 'ArrowUp' && currentIndex > 0) {
            currentIndex--;
            showPost(currentIndex);
        }
    });

    // Add navigation buttons
    function addNavigationButtons() {
        const buttonContainer = document.createElement('div');
        buttonContainer.style.position = 'fixed';
        buttonContainer.style.bottom = '20px';
        buttonContainer.style.left = '50%';
        buttonContainer.style.transform = 'translateX(-50%)';
        buttonContainer.style.display = 'flex';
        buttonContainer.style.gap = '10px';
        buttonContainer.style.zIndex = '9999';

        const createButton = (iconText, onClick) => {
            const button = document.createElement('button');
            button.innerHTML = iconText;
            button.style.padding = '10px';
            button.style.cursor = 'pointer';
            button.style.fontSize = '20px';
            button.style.border = 'none';
            button.style.backgroundColor = '#333';
            button.style.color = '#fff';
            button.style.borderRadius = '50%';
            button.addEventListener('click', onClick);
            return button;
        };

        const prevButton = createButton('&#9664;', () => {
            if (currentIndex > 0) {
                currentIndex--;
                showPost(currentIndex);
            }
        });

        const lockScrollButton = createButton('&#128275;', () => {
            scrollLocked = !scrollLocked;
            document.body.style.overflow = scrollLocked ? 'hidden' : 'auto';
            posts.forEach(post => post.style.overflowY = scrollLocked ? 'hidden' : 'auto');
            lockScrollButton.innerHTML = scrollLocked ? '&#128275;' : '&#128274;';
        });

        const playToggleButton = createButton('&#9658;', () => {
            autoplayEnabled = !autoplayEnabled;
            if (!autoplayEnabled) {
                pauseAllVideos();
                console.log('Autoplay disabled. Videos paused.');
                playToggleButton.innerHTML = '&#10074;&#10074;'; // Pause symbol
            } else {
                showPost(currentIndex); // Restart play on current post
                console.log('Autoplay enabled.');
                playToggleButton.innerHTML = '&#9658;'; // Play symbol
            }
        });

        const nextButton = createButton('&#9654;', () => {
            if (currentIndex < posts.length - 1) {
                currentIndex++;
                showPost(currentIndex);
            }
        });

        buttonContainer.appendChild(prevButton);
        buttonContainer.appendChild(lockScrollButton);
        buttonContainer.appendChild(playToggleButton);
        buttonContainer.appendChild(nextButton);
        document.body.appendChild(buttonContainer);
    }

    // Reinitialize on new content (dynamic loading)
    const observer = new MutationObserver(() => {
        posts = document.querySelectorAll('li[data-index]');
        initializePosts();
        showPost(currentIndex);
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Initialize posts and buttons
    if (posts.length > 0) {
        initializePosts();
        showPost(currentIndex);
        addNavigationButtons();
    }
})();
