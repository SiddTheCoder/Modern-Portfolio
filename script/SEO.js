(() => {
    const metaTags = [
        { name: "description", content: "Siddhant Yadav (SiddTheCoder) - Web Developer, Software Engineer, and Tech Enthusiast from Nepal. Explore my portfolio, projects, and blog at siddhantyadav.com.np." },
        { name: "keywords", content: "Siddhant Yadav, SiddTheCoder, Web Developer, Software Engineer, Portfolio, JavaScript, React, Full-Stack Developer" },
        { name: "author", content: "Siddhant Yadav" },
        { property: "og:title", content: "Siddhant Yadav | Web Developer & Software Engineer" },
        { property: "og:description", content: "Explore my projects and tutorials on web development, JavaScript, React, and more." },
        { property: "og:url", content: "https://siddhantyadav.com.np" },
        { property: "og:type", content: "website" },
        { property: "og:image", content: "https://siddhantyadav.com.np/og-image.jpg" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: "Siddhant Yadav | Web Developer & Software Engineer" },
        { name: "twitter:description", content: "Explore my projects and tutorials on web development, JavaScript, React, and more." },
        { name: "twitter:image", content: "https://siddhantyadav.com.np/og-image.jpg" }
    ];

    metaTags.forEach(tag => {
        const element = document.createElement("meta");
        Object.keys(tag).forEach(key => element.setAttribute(key, tag[key]));
        document.head.appendChild(element);
    });

    const ldJson = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Siddhant Yadav",
        "url": "https://siddhantyadav.com.np",
        "sameAs": [
            "https://github.com/siddthecoder",
            "https://www.instagram.com/siddhant_.ydv/",
            "https://www.facebook.com/siddthecoder"
        ],
        "jobTitle": "Web Developer & Software Engineer",
        "worksFor": {
            "@type": "Organization",
            "name": "ChromoVerse"
        }
    };

    const script = document.createElement("script");
    script.setAttribute("type", "application/ld+json");
    script.textContent = JSON.stringify(ldJson);
    document.head.appendChild(script);
})();
