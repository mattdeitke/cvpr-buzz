/**
 * See: https://www.gatsbyjs.com/docs/gatsby-config/
 */

const path = require(`path`);

module.exports = {
  pathPrefix: "/cvpr-buzz",
  plugins: [
    `gatsby-plugin-typescript`,
    `gatsby-plugin-sass`,
    `gatsby-plugin-antd`,
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-emotion`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: path.join(__dirname, `paper-data`),
      },
    },
    `gatsby-plugin-sharp`,
    `gatsby-transformer-json`,
    `gatsby-transformer-sharp`,
  ],
}
