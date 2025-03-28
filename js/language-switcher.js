/**
 * Language Switcher Script
 * Privacy-focused implementation that uses only localStorage for preference storage
 */

document.addEventListener('DOMContentLoaded', () => {
    // Get the language switch button
    const languageSwitch = document.getElementById('language-switch');
    
    if (languageSwitch) {
        // Check if there's a stored language preference
        const storedLang = localStorage.getItem('language');
        const currentLang = languageSwitch.getAttribute('data-current');
        
        // If the stored language doesn't match the current page language, redirect
        if (storedLang && storedLang !== currentLang) {
            switchToLanguage(storedLang);
        }
        
        // Add click event listener to the language switch button
        languageSwitch.addEventListener('click', () => {
            const targetLang = currentLang === 'tr' ? 'en' : 'tr';
            localStorage.setItem('language', targetLang);
            switchToLanguage(targetLang);
        });
    }
    
    /**
     * Function to switch to the specified language
     * @param {string} lang - The language code to switch to ('en' or 'tr')
     */
    function switchToLanguage(lang) {
        if (lang === 'en') {
            if (!window.location.pathname.includes('/en/')) {
                window.location.href = '/en/';
            }
        } else {
            // If we're in the English version, go to the root (Turkish version)
            if (window.location.pathname.includes('/en/')) {
                window.location.href = '/';
            }
        }
    }
});