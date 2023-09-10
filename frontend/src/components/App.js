import React, { useEffect } from "react";

import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";
import Api from "../utils/Api";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";

import * as auth from "../utils/auth";
import Login from "./Login";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";
import InfoTooltip from "./InfoTooltip";
import Accept from "../images/login/Accept.svg";
import Error from "../images/login/Error.svg";

const api = new Api({
  baseUrl: "https://mesto.nomoreparties.co/v1/cohort-66/",
  headers: {
    authorization: "d76615bd-c18d-4153-a44e-90229c59fcdc",
    "Content-Type": "application/json",
  },
});


function App() {
  const navigate = useNavigate();
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
    React.useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
    React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState(null);
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);
  const [isProfilePopupOpened, setIsProfilePopupOpened] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [emailName, setEmailName] = React.useState(null);
  const [popupImage, setPopupImage] = React.useState("");
  const [popupTitle, setPopupTitle] = React.useState("");
  const [infoTooltip, setInfoTooltip] = React.useState(false);
  const [loggedIn, setLoggedIn] = React.useState(false);


  useEffect(() => {
    Promise.all([api.getUserData(), api.getInitialCards()])
      .then(([profileInfo, cards]) => {
        setCurrentUser(profileInfo);
        setCards(cards);
        console.log(cards)
      })
      .catch((err) => {
        console.log(`Возникла глобальная ошибка, ${err}`);
      });
  }, []);


  function handleUpdateUser(data) {
    api
      .sendUserData(data)
      .then((newProfileInfo) => {
        setCurrentUser(newProfileInfo);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Возникла ошибка, ${err}`);
      });
  }

  function handleAddPlaceSubmit(data) {
    api
      .addNewCard(data)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Возникла ошибка, ${err}`);
      });
  }

  function handleAvatarUpdate(data) {
    api
      .sendAvatarData(data)
      .then((newAvatar) => {
        setCurrentUser(newAvatar);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Возникла ошибка, ${err}`);
      });
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard(null);
    setIsProfilePopupOpened(false);
    setInfoTooltip(false);
  }

  function handlePopupCloseClick(evt) {
    if (evt.target.classList.contains("popup")) {
      closeAllPopups();
    }
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    if (!isLiked) {
      api
        .putCardLike(card._id)
        .then((newCard) => {
          setCards((s) => s.map((cd) => (cd._id === card._id ? newCard : cd)));
        })
        .catch((err) => {
          console.log(`Возникла ошибка, ${err}`);
        });
    } else {
      api
        .deleteCardLike(card._id)
        .then((newCard) => {
          setCards((s) => s.map((cd) => (cd._id === card._id ? newCard : cd)));
        })
        .catch((err) => {
          console.log(`Возникла ошибка, ${err}`);
        });
    }
  }

  function handleCardDelete(card) {
    api
      .deleteCard(card._id)
      .then(() => {
        setCards((items) => items.filter((c) => c._id !== card._id && c));
      })
      .catch((err) => {
        console.log(`Возникла ошибка, ${err}`);
      });
  }

  useEffect(() => {
    if (
      isEditAvatarPopupOpen ||
      isEditProfilePopupOpen ||
      isAddPlacePopupOpen ||
      selectedCard ||
      isProfilePopupOpened
    ) {
      function handleEsc(evt) {
        if (evt.key === "Escape") {
          closeAllPopups();
        }
      }

      function mouseOut(evt) {
        if (
          evt.target.classList.contains("popup_opened") ||
          evt.target.classList.contains("popup__close")
        ) {
          closeAllPopups();
        }
      }

      document.addEventListener("keydown", handleEsc);
      document.addEventListener("mousedown", mouseOut);

      return () => {
        document.removeEventListener("keydown", handleEsc);
        document.removeEventListener("mousedown", mouseOut);
      };
    }
  }, [
    isEditAvatarPopupOpen,
    isEditProfilePopupOpen,
    isAddPlacePopupOpen,
    selectedCard,
    isProfilePopupOpened,
  ]);

  const handleLoggedIn = () => {
    setLoggedIn(true);
  };

  function handleInfoTooltip() {
    setInfoTooltip(true);
  }

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      auth
        .getToken(jwt)
        .then((res) => {
          if (res) {
            setIsLoggedIn(true);
            setEmailName(res.data.email);
          }
        })
        .catch((err) => {
          console.log(`Возникла ошибка, ${err}`);
        });
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn === true) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const handleRegister = (email, password) => {
    auth
      .registerUser(password, email)
      .then(() => {
        setPopupImage(Accept);
        setPopupTitle("Вы успешно зарегистрировались!");
        navigate("/sign-in");
      })
      .catch(() => {
        setPopupImage(Error);
        setPopupTitle("Что-то пошло не так! Попробуйте ещё раз.");
      })
      .finally(handleInfoTooltip);
  };

  const handleLogin = (email, password) => {
    auth
      .loginUser(password, email)
      .then((res) => {
        localStorage.setItem("jwt", res.token);
        setIsLoggedIn(true);
        setEmailName(email);
        navigate("/");
      })
      .catch(() => {
        setPopupImage(Error);
        setPopupTitle("Что-то пошло не так! Попробуйте ещё раз.");
        handleInfoTooltip();
      });
  };

  function signOut() {
    setIsLoggedIn(false);
    setEmailName(null);
    navigate("/sign-in");
    localStorage.removeItem("jwt");
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <main>
          <Routes>
            <Route
              path="/sign-in"
              element={
                <>
                  <Header title="Регистрация" route="/sign-up" authPage="Yes" />
                  <Login handleLogin={handleLogin} />
                </>
              }
            />

            <Route
              path="/sign-up"
              element={
                <>
                  <Header title="Войти" route="/sign-in" authPage="Yes" />
                  <Register handleRegister={handleRegister} />
                </>
              }
            />

            <Route
              exact
              path="/"
              element={
                <>
                  <Header
                    title="Выйти"
                    accountMail={emailName}
                    onClick={signOut}
                    route=""
                    authPage="No"
                  />
                  <ProtectedRoute
                    component={Main}
                    isLogged={isLoggedIn}
                    onEditAvatar={handleEditAvatarClick}
                    onEditProfile={handleEditProfileClick}
                    onAddPlace={handleAddPlaceClick}
                    onCardClick={handleCardClick}
                    cards={cards}
                    onCardLike={handleCardLike}
                    onCardDelete={handleCardDelete}
                  />
                </>
              }
            />

            <Route
              path="*"
              element={<Navigate to={isLoggedIn ? "/" : "/sign-in"} />}
            />
          </Routes>
        </main>

        <Footer />

        <InfoTooltip
          image={popupImage}
          title={popupTitle}
          isOpen={infoTooltip}
          onCloseClick={handlePopupCloseClick}
          onClose={closeAllPopups}
        />

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onCloseClick={handlePopupCloseClick}
          onClose={closeAllPopups}
          onSubmit={handleUpdateUser}
        />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onCloseClick={handlePopupCloseClick}
          onClose={closeAllPopups}
          onSubmit={handleAddPlaceSubmit}
        />

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onCloseClick={handlePopupCloseClick}
          onClose={closeAllPopups}
          onSubmit={handleAvatarUpdate}
        />
        <ImagePopup
          card={selectedCard}
          onCloseClick={handlePopupCloseClick}
          onClose={closeAllPopups}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
