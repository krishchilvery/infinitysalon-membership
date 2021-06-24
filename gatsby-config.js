module.exports = {
  siteMetadata: {
    title: "Infinity Salons",
    titleTemplate: "%s | Infinity Salons",
    description:
      "Membership for Infinity Salons",
  },
  plugins: [
    {
      resolve: `gatsby-plugin-create-client-paths`,
      options: { prefixes: [`/*`] },
    },
  ],
};