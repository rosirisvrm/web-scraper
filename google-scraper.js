const puppeteer = require('puppeteer');
const jsdom = require('jsdom');

(async () => {
  try {
    // Abrimos una instancia del puppeteer y accedemos a la url de google
    const browser = await puppeteer.launch({ headless: false }) ;
    const page = await browser.newPage();
    const response = await page.goto('https://www.google.com/search?q=web+scraping+libros');
    const body = await response.text();

    // Creamos una instancia del resultado devuelto por puppeter para parsearlo con jsdom
    const { window: { document } } = new jsdom.JSDOM(body);

    // Seleccionamos los titulos y lo mostramos en consola
    document.querySelectorAll('.g h3')
      .forEach(element => console.log(element.textContent));

    // Cerramos el puppeteer
    await browser.close();
  } catch (error) {
    console.error(error);
  }
})();
