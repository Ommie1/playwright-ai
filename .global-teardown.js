module.exports = async ({ browser }) => {
  if (browser) {
    await browser.close();
  }
};