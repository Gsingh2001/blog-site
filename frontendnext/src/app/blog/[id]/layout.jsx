import React from 'react';
import Head from 'next/head';

// Dynamic import for child components without SSR

const BlogLayout = ({ title, content, children }) => {
    // Fallback for the content in case it's missing or empty
    const description = content?.length > 0 ? content[0] : 'A detailed blog post about various topics.';

    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="description" content={description} />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:type" content="article" />
            </Head>
            <div>
                {children}
            </div>
        </>
    );
};

export default BlogLayout;
