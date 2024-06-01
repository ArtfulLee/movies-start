import { global } from "./global.js";
import { getData } from "./api/getData.js";
import { generateTemplate } from "../js/utils/generateTemplate.js";
import { tabsComponent } from "./components/tabs.js";
import { search } from "./api/searchServices.js";

const searchForm = document.querySelector(".search-form");

/**
 * Инициализирует функции в зависимости от страницы.
 */
function init() {
  switch (global.currentPage) {
    // Если текущая страница корневая или index.html
    case "/":
    case "/index.html":
      // Вызываем функции для отображения фильмов в прокате (слайдер), а также популярных фильмов и сериалов
      processFilmsAndShowsData("/movie/now_playing");
      processFilmsAndShowsData("/movie/popular");
      processFilmsAndShowsData("/tv/popular");

      // Табы TV's или Movies
      tabsComponent();
      break;
  }
}

document.addEventListener("DOMContentLoaded", init);

/**
 * Функция для обработки данных о фильмах и шоу.
 *
 * @param {string} endpoint - Конечная точка API, к которой нужно выполнить запрос.
 */
export const processFilmsAndShowsData = async (endpoint) => {
  try {
    const data = await getData(endpoint);

    // Определяем контейнер в зависимости от эндпоинта
    let containerSelector;

    switch (endpoint) {
      case "/movie/now_playing":
        containerSelector = ".swiper-wrapper";
        break;
      case "/movie/popular":
        containerSelector = ".popular-movies";
        break;
      default:
        containerSelector = ".popular-tv";
    }

    // Генерируем шаблон
    generateTemplate(data?.results ?? data, {
      containerSelector,
      // слайдер применяется только, если endpoint === "movie/now_playing"
      useSlider: endpoint === "/movie/now_playing",
    });
    console.log("Полученные данные:", data);
  } catch (error) {
    console.error("Произошла ошибка:", error);
  }
};

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchTerm = document.querySelector("#search-term");
  const searchType = document.querySelector(`input[name="type"]:checked`);
  global.search.term = searchTerm.value;
  global.search.type = searchType.value;

  search();
});
