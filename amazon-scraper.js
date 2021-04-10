const puppeteer = require('puppeteer');

(async () => {
  try {
    // Se abre un navegador de puppeteer
    const browser = await puppeteer.launch({ headless: false }) ;
    const page = await browser.newPage();

    // Se accede a la url de amazon
    await page.goto('https://www.amazon.es/');

    // Click en botón para aceptar las cookies
    await page.click('#sp-cc-accept')

    // Se escribe en la entrada de texto de búsqueda
    await page.type('#twotabsearchtextbox', 'libros de web scraping')

    // Se clickea el botón para buscar
    await page.click('.nav-search-submit input')

    // Se espera que se realize la busqueda y que aparezca un selector específico
    await page.waitForSelector('[data-component-type=s-search-result]')
    await page.waitFor(2000)

    // Se obtienen todos los títulos de los resultados
    const enlaces = await page.evaluate(() => {
      const elements = document.querySelectorAll('[data-component-type=s-search-result] h2 a')

      let links = [];
      for(let element of elements){
        links.push(element.href)
      }
      return links;
    })

    // Se recorren todos los enlaces de los resultados y se guardan el título y autor de cada libro
    let books = [];
    for(let enlace of enlaces){
      await page.goto(enlace)
      await page.waitForSelector('#productTitle')

      const book = await page.evaluate(() => {
        let info = {};

        info.title = document.querySelector('#productTitle').innerText;
        info.author = document.querySelector('.author a').innerText;

        return info;
      })

      books.push(book)
    }

    // Se muestra la información obtenida en la navegación
    console.log(books);

    // Cerramos el puppeteer
    await browser.close();
  } catch (error) {
    console.error(error);
  }
})();
