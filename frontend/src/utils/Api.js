export default class Api {
  constructor({ baseUrl}) {
    this._link = baseUrl;
    this._credentials = 'include';
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
    return fetch(`${this._link}/users/me`, {
      method: "GET",
      credentials: this._credentials,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then((res) => {
      return this._processingServerResponse(res);
    });
  }

  // отправка данных пользователя
  sendUserData(profileData) {
    return fetch(`${this._link}/users/me`, {
      method: "PATCH",
      credentials: this._credentials,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
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
    return fetch(`${this._link}/cards`, {
      method: "GET",
      credentials: this._credentials,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then((res) => {
      return this._processingServerResponse(res);
    });
  }
  // Добавление новой карточки
  addNewCard({ name, link }) {
    return fetch(`${this._link}/cards`, {
      method: "POST",
      credentials: this._credentials,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, link }),
    }).then((res) => {
      return this._processingServerResponse(res);
    });
  }
  // Удаление карточки
  deleteCard(cardId) {
    return fetch(`${this._link}/cards/${cardId}`, {
      method: "DELETE",
      credentials: this._credentials,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then((res) => {
      return this._processingServerResponse(res);
    });
  }

  // Отправка нового аватара
  sendAvatarData(link) {
    console.log(link);
    return fetch(`${this._link}/users/me/avatar`, {
      method: "PATCH",
      credentials: this._credentials,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ avatar: link.avatar }),
    }).then((res) => {
      return this._processingServerResponse(res);
    });
  }
  // Отправка лайка
  putCardLike(cardId) {
    return fetch(`${this._link}/cards/${cardId}/likes`, {
      method: "PUT",
      credentials: this._credentials,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then((res) => {
      return this._processingServerResponse(res);
    });
  }
  // Удаление лайка
  deleteCardLike(cardId) {
    return fetch(`${this._link}/cards/${cardId}/likes`, {
      method: "DELETE",
      credentials: this._credentials,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then((res) => {
      return this._processingServerResponse(res);
    });
  }
}
