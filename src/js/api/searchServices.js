import { getData } from "./getData.js";
import { global } from "../global.js";
import { generateTemplate } from "../utils/generateTemplate.js";
import { smoothscroll } from "../components/smothScroll.js";

/**
 * Выполняет запрос к API для поиска данных.
 * Использует глобальные параметры для определения типа поиска, термина поиска и номера страницы.
 * Отображает спиннер во время выполнения запроса и скрывает его после получения данных.
 *
 * @returns {Promise<Object>} Возвращает промис с результатами поиска в формате JSON.
 * @throws {Error} Бросает ошибку в случае неудачного запроса или проблем с сетью.
 */
export const searchData = async () => {
  const endpoint = `/search/${global.search.type}?query=${global.search.term}&page=${global.search.page}`;

  return getData(endpoint);
};

/**
 * Выполняет поиск по введенным параметрам и отображает результаты.
 * Извлекает параметры поиска из строки запроса URL, устанавливает глобальные параметры поиска и вызывает функцию поиска API.
 * Если результаты поиска не пустые, отображает их и очищает поле ввода.
 */
export const search = async () => {
  const { results, total_pages } = await searchData();
  global.search.totalPages = total_pages;
  displaySearchResults(results);
};

/**
 * Отображает результаты поиска.
 * @param {Array} results - Массив объектов с результатами поиска.
 */
export const displaySearchResults = (results) => {
  // Основная логика
  console.log(results);
  // Селекторы для вставки результатов
  let searchResult = document.querySelector("#search-results");
  let pagination = document.querySelector("#pagination");
  // Очищаем селекторы от старых результатов

  // Как-то так пока что)))
  let options = {
    containerSelector: "#search-results",
  };

  searchResult.innerHTML = pagination.innerHTML = "";

  generateTemplate(results, options);

  // Отображаем пагинацию
  displayPagination();
};

/**
 * Отображает пагинацию для результатов поиска.
 */
export const displayPagination = () => {
  const div = document.createElement("div");

  div.classList.add("pagination");

  div.innerHTML = `
      <div>
        <button class="btn btn-outline" id="prev">Prev</button>
        <button class="btn btn-outline" id="next">Next</button>
      </div>
      <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>
    `;

  document.querySelector("#pagination").appendChild(div);

  // Отключаем кнопку "Назад", если находимся на первой странице
  if (global.search.page === 1) {
    document.querySelector("#prev").disabled = true;
  }

  // Отключаем кнопку "Вперед", если находимся на последней странице
  if (global.search.page === global.search.totalPages) {
    document.querySelector("#next").disabled = true;
  }

  // Обработчик события для перехода на следующую страницу
  document.querySelector("#next").addEventListener("click", async () => {
    global.search.page++;

    // Получаем результаты поиска для новой страницы
    const { results } = await searchData();

    // Отображаем результаты поиска для новой страницы
    displaySearchResults(results);

    // Плавная прокрутка к началу страницы
    smoothscroll();
  });

  // Обработчик события для перехода на предыдущую страницу
  document.querySelector("#prev").addEventListener("click", async () => {
    global.search.page--;

    // Получаем результаты поиска для новой страницы
    const { results } = await searchData();

    // Отображаем результаты поиска для новой страницы
    displaySearchResults(results);

    // Плавная прокрутка к началу страницы
    smoothscroll();
  });
};
