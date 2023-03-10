/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */

const path = require('node:path')
require('dotenv').config()

module.exports = {
  /* Your site config here */
  siteMetadata: {
    title: `Benji Friedman Online Art Archive`,
    titleTemplate: `%s | A simple MDX blog`,
    description: `Built using GatsbyJS and serving content using markdown`,
    siteUrl: `https://koop-blog.netlify.app`, // Cannot include a trailing slash
    image: `/images/macbook.jpg`,
    siteAuthor: `Benji Friedman`,
    siteAuthorUrl: `https://www.morganbaker.dev`,
    twitterUsername: `@benjifri`,
    facebookName: `https://www.facebook.com/benjifriedman.art`,
    instagramName: `https://www.instagram.com/benjifriedman`,
    elloName: `https://www.ello.co/benjifriedman`,
    singleFilePages: true,
    lang: 'en',
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-sitemap`,
    {
      resolve: `gatsby-plugin-image`,
      options: {
        formats: [`auto`, `webp`, `jpg`],
      },
    },
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-netlify`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `posts`,
        path: `src/posts`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `src/images`,
      },
    },
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-images`,
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-styled-components`,
    },
  ],
}
