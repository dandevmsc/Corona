window.addEventListener("load", function () {
    window.cookieconsent.initialise({
        "palette": {
            "popup": {
                "background": "#1E90FF"
            },
            "button": {
                "background": "#696969"
            }
        },
        "content": {
            header: 'Cookies used on the website!',
            message: 'This website uses cookies to ensure you get the best experience on our website.',
            dismiss: 'Got it!',
            link: 'Learn more',
            href: '/cookiepolicy',
            close: '&#x274c;',
            policy: 'Cookie Policy',
            target: '_blank',
        }
    })
});