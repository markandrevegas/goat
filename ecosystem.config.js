// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: "floatinggoat",
      script: "./.output/server/index.mjs",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        NUXT_PUBLIC_GTM_ID: "GTM-PN69ZCQJ"
      }
    }
  ]
}