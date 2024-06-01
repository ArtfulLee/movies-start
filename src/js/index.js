import { global } from "./global.js";
import { generateTemplate } from "../js/utils/generateTemplate.js";
import { tabsComponent } from "./components/tabs.js";

/**
 * Инициализирует функции в зависимости от страницы.
 */
function init() {
  switch (global.currentPage) {
    // Если текущая страница корневая или index.html
    case "/":
    case "/index.html":
      // Вызываем функции для отображения фильмов в прокате (слайдер), а также популярных фильмов и сериалов
      generateTemplate("/movie/now_playing", ".swiper-wrapper", true);
      tabsComponent();

      generateTemplate("/movie/popular", ".popular-movies");
      generateTemplate("/tv/popular", ".popular-tv");
      break;
    case "/search.html":
      // Вызываем функцию для выполнения поиска
      break;
  }
}

document.addEventListener("DOMContentLoaded", init);
