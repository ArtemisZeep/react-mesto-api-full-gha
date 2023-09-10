export default class Api {
  constructor({ baseUrl, headers }) {
    this._link = baseUrl;
    this._headers = headers;
  }

  // Ответ сервера
  _processingServerResponse(res) {
    if (res.ok) {
      return res.json();
    } else {
      return Promise.reject(`Ошибка: ${res.status}`);
    }
  }

  // Получение данных пользователя
  getUserData() {
    return fetch(`${this._link}users/me`, {
      method: "GET",
      headers: this._headers,
    }).then((res) => {
      return this._processingServerResponse(res);
    });
  }

  // отправка данных пользователя
  sendUserData(profileData) {
    return fetch(`${this._link}users/me`, {
      headers: this._headers,
      method: "PATCH",
      body: JSON.stringify({
        name: profileData.name,
        about: profileData.description,
      }),
    }).then((res) => {
      return this._processingServerResponse(res);
    });
  }

  // Инициализация карточек
  getInitialCards() {
    return fetch(`${this._link}cards`, {
      method: "GET",
      headers: this._headers,
    }).then((res) => {
      return this._processingServerResponse(res);
    });
  }
  // Добавление новой карточки
  addNewCard({ name, link }) {
    return fetch(`${this._link}cards`, {
      headers: this._headers,
      method: "POST",
      body: JSON.stringify({ name, link }),
    }).then((res) => {
      return this._processingServerResponse(res);
    });
  }
  // Удаление карточки
  deleteCard(cardId) {
    return fetch(`${this._link}cards/${cardId}`, {
      headers: this._headers,
      method: "DELETE",
    }).then((res) => {
      return this._processingServerResponse(res);
    });
  }

  // Отправка нового аватара
  sendAvatarData(link) {
    console.log(link);
    return fetch(`${this._link}users/me/avatar`, {
      headers: this._headers,
      method: "PATCH",
      body: JSON.stringify({ avatar: link.avatar }),
    }).then((res) => {
      return this._processingServerResponse(res);
    });
  }
  // Отправка лайка
  putCardLike(cardId) {
    return fetch(`${this._link}cards/${cardId}/likes`, {
      headers: this._headers,
      method: "PUT",
    }).then((res) => {
      return this._processingServerResponse(res);
    });
  }
  // Удаление лайка
  deleteCardLike(cardId) {
    return fetch(`${this._link}cards/${cardId}/likes`, {
      headers: this._headers,
      method: "DELETE",
    }).then((res) => {
      return this._processingServerResponse(res);
    });
  }
}
