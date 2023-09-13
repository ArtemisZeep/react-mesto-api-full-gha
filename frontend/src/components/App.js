import React, { useEffect, useCallback } from "react";

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
  baseUrl: "https://api.mesto.artemiszeep.nomoredomainsicu.ru",
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
  const [emailName, setEmailName] = React.useState(null);
  const [popupImage, setPopupImage] = React.useState("");
  const [popupTitle, setPopupTitle] = React.useState("");
  const [infoTooltip, setInfoTooltip] = React.useState(false);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [isFetching, setFetching] = React.useState(false);
  const [isLoading, setLoading] = React.useState(true);
  const [isRegisterLoading, setIsRegisterLoading] = React.useState(false);
  const [isLoginLoading, setIsLoginLoading] = React.useState(false);



  

  const tokenCheck = useCallback(() => { 
    const authorized = localStorage.getItem('authorized')
    console.log(authorized)
    if (authorized) {
      auth
        .getToken()
        .then((res) => {
          console.log(res)
          if (res) {
            setLoggedIn(true);
            setEmailName(res.email);
            navigate("/");
          }
        })
        .catch((err) => {
          console.log(`Возникла ошибка, ${err}`);
        });
    }
  }, [navigate]);

  useEffect(() => {
    tokenCheck();
  }, []);

  useEffect(() => {
    if (loggedIn) {
    Promise.all([api.getUserData(), api.getInitialCards()])
      .then(([profileInfo, cards]) => {
        console.log(profileInfo)
        setCurrentUser(profileInfo);
        setCards(cards);
        console.log(cards)
      })
      .catch((err) => {
        console.log(`Возникла глобальная ошибка, ${err}`);
      })
}},[loggedIn]);

  const handleRegister = (email, password) => {
    setIsRegisterLoading(true);
    return auth
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
      .finally(() => {
        setTimeout(() => {
          setIsRegisterLoading(false);
        }, 1500);
      });
  };

  const handleLogin = (email, password) => {
    if (!email || !password) {
      return;
    }
    auth
      .loginUser(password, email)
      .then((res) => {
        localStorage.setItem('authorized', 'true');
        setLoggedIn(true);
        setEmailName(email);
        navigate("/");
      })
      .catch(() => {
        setPopupImage(Error);
        setPopupTitle("Что-то пошло не так! Попробуйте ещё раз.");
        handleInfoTooltip();
      })
      .finally(() => {
        setTimeout(() => {
          setIsLoginLoading(false);
        }, 1500);
      });
  };


  function signOut() {
    auth
      .signout()
      .then(() => {
        localStorage.removeItem('authorized')
        setLoggedIn(false);
        navigate("/sign-in");
  })
     .catch((err) => { 
       console.log(err);
  });
  }








  function handleUpdateUser(data) {
    setFetching(true);
    api
      .sendUserData(data)
      .then((newProfileInfo) => {
        setCurrentUser(newProfileInfo);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Возникла ошибка, ${err}`);
      })
      .finally(() => setFetching(false));
  }

  function handleAddPlaceSubmit(props) {
    console.log(props)
    api
      .addNewCard(props)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Возникла ошибка, ${err}`);
      })
  }

  function handleAvatarUpdate(data) {
    setFetching(true);
    api
      .sendAvatarData(data)
      .then((newAvatar) => {
        setCurrentUser(newAvatar);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Возникла ошибка, ${err}`);
      })
      .finally(() => setFetching(false));
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

 

  function handleInfoTooltip() {
    setInfoTooltip(true);
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
                    isLogged={loggedIn}
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
              element={<Navigate to={loggedIn ? "/" : "/sign-in"} />}
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
