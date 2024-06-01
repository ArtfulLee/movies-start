import { getData } from "../api/getData";
import { Sidebar } from "../components/sidebar.js";
import { initSwiper } from "../components/swiper.js";

/**
 * Асинхронная функция для получения и отображения контента в слайдере или без.
 * Получает данные о популярных фильмах или сериалах с помощью функции getData.
 * @param {string} endpoint - Конечная точка API, к которой нужно выполнить запрос.
 * @param {string} containerSelector - Селектор контейнера, в который будут добавлены элементы.
 * @param {boolean} useSlider - Нужно ли использовать слайдер для отображения контента.
 * @returns {Promise} Объект Promise.
 */
export const generateTemplate = async (
  endpoint,
  containerSelector,
  useSlider = false
) => {
  const { results } = await getData(endpoint);

  results.forEach((content) => {
    const div = document.createElement("div");

    div.classList.add(useSlider ? "swiper-slide" : "card");

    div.innerHTML = `
    <a class="${
      useSlider ? "slider-link" : "list-item-link"
    }" href="javascript:void(0);" data-id="${content.id}">
    <img src="https://image.tmdb.org/t/p/${useSlider ? "w500" : "w300"}${
      content.poster_path
    }" alt="${content.title || content.name}" />
    <h3 class="${useSlider ? "slider-rating" : "list-item-rating"}">
      <svg class="rating" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.15336 2.33977L10.3267 4.68643C10.4867 5.0131 10.9134 5.32643 11.2734 5.38643L13.4 5.73977C14.76 5.96643 15.08 6.9531 14.1 7.92643L12.4467 9.57977C12.1667 9.85977 12.0134 10.3998 12.1 10.7864L12.5734 12.8331C12.9467 14.4531 12.0867 15.0798 10.6534 14.2331L8.66003 13.0531C8.30003 12.8398 7.7067 12.8398 7.34003 13.0531L5.3467 14.2331C3.92003 15.0798 3.05336 14.4464 3.4267 12.8331L3.90003 10.7864C3.9867 10.3998 3.83336 9.85977 3.55336 9.57977L1.90003 7.92643C0.926698 6.9531 1.24003 5.96643 2.60003 5.73977L4.7267 5.38643C5.08003 5.32643 5.5067 5.0131 5.6667 4.68643L6.84003 2.33977C7.48003 1.06643 8.52003 1.06643 9.15336 2.33977Z" stroke="#FFAD49" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      ${content.vote_average.toFixed(1)} / 10
    </h3>
    <div class="${useSlider ? "slider-wrapper" : "list-item-descr"}">
      <h3 class="${useSlider ? "slider-title" : "list-item-title"}">${
      content.title || content.name
    }</h3>
      ${
        content.release_date
          ? `<p class="${
              useSlider ? "slider-subtitle" : "list-item-subtitle"
            }">Release: <small class="${
              useSlider ? "subtitle-muted" : "list-item-muted"
            }">${content.release_date}</small></p>`
          : ""
      }
    </div>
  </a>
    `;

    document.querySelector(containerSelector).appendChild(div);

    const links = document.querySelectorAll(containerSelector + " a.list-item-link");

    links.forEach((link) => link.addEventListener("click", attachListeners));
  });

  // Инициализация слайдера, если передан параметр
  useSlider && initSwiper();
};

/**
 * Обработчик события клика, для открытия сайдбара с деталями по фильму/сериалу.
 * @param {Event} event - Событие клика.
 * @returns {Promise<void>} - Промис.
 */
const attachListeners = async (event) => {
  // Обработка клика по div и получение data-id через дочерний элемент
  const id = event?.currentTarget?.parentElement?.children[0]?.dataset?.id;

  new Sidebar("#sidebar", `[data-id="${id}"]`, "right").open(); // Открываем сайдбар

  // Запрос на получение фильма по id
  const details = await getData(`movie/${id}`);

  console.log('Полученный фильм по id', details);

  // generateTemplate(`movie/${id}`, ".sidebar-list");
};
