import logo from "../images/logo/__logo.svg";
import { Link } from "react-router-dom";
import { useState } from "react";

function Header(props) {
  const [isBurgerOpened, setIsBurgerOpened] = useState(false);

  const BurgerMenuClassName = `header__list ${
    isBurgerOpened && "header__list_opened"
  }`;
  const BurgerButtonClassName = `header__burger-button ${
    isBurgerOpened && "header__burger-button_hidden"
  }`;
  const CloseBurgerButtonClassName = `header__close-burger-button ${
    isBurgerOpened && "header__close-burger-button_visible"
  }`;
  const openBurgerMenu = () => {
    setIsBurgerOpened(true);
  };
  const closeBurgerMenu = () => {
    setIsBurgerOpened(false);
  };

  const isItAuth = () => {
    if (props.authPage == "Yes") {
      return (
        <header className="header header_authPage">
          <img className="header__logo" src={logo} alt="Логотип" />

          <nav className="header__auth header__auth_authPage">
            <Link
              to={props.route}
              className="header__link"
              type="button"
              onClick={props.onClick}
            >
              {props.title}
            </Link>
          </nav>
        </header>
      );
    } else {
      return (
        <header className="header">
          <div className="header__top">
            <img className="header__logo" src={logo} alt="Логотип" />
            <button
              className={BurgerButtonClassName}
              onClick={openBurgerMenu}
            ></button>
            <button
              className={CloseBurgerButtonClassName}
              onClick={closeBurgerMenu}
            ></button>
          </div>
          <div className={BurgerMenuClassName}>
            <nav className="header__auth">
              <p className="header__text">{props.accountMail}</p>
              <Link
                to={props.route}
                className="header__link"
                type="button"
                onClick={props.onClick}
              >
                {props.title}
              </Link>
            </nav>
          </div>
        </header>
      );
    }
  };

  return isItAuth();
}

export default Header;
