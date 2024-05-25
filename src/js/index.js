import { global } from "./global.js";

/**
 * Инициализирует функции в зависимости от страницы.
 */
function init() {
  switch (global.currentPage) {
    // Если текущая страница корневая или index.html
    case "/":
    case "/index.html":
      // Вызываем функции для отображения фильмов в прокате (слайдер), а также популярных фильмов и сериалов

      break;
    case "/movie-details.html":
      // Вызываем функцию для отображения деталей о фильме
      break;
    case "/tv-details.html":
      // Вызываем функцию для отображения деталей о сериале
      break;
    case "/search.html":
      // Вызываем функцию для выполнения поиска
      break;
  }
}

document.addEventListener("DOMContentLoaded", init);
