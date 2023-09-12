import React, { useEffect } from "react";
import Card from "./Card";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";

function Main(props) {
  const currentUser = React.useContext(CurrentUserContext);
  console.log(currentUser)

  return (
    <main className="main">
      <section className="profile">
        <div className="profile__content">
          <div className="profile__avatar-container">
            <img
              className="profile__avatar"
              alt="Аватар"
              src={currentUser.avatar}
            />
            <button
              type="button"
              className="profile__avatar-edit"
              onClick={props.onEditAvatar}
            />
          </div>

          <div className="profile__info">
            <div className="profile__row">
              <h1 className="profile__name">{currentUser.name}</h1>
              <button
                className="profile__edit-button"
                type="button"
                onClick={props.onEditProfile}
              />
            </div>
            <h2 className="profile__status">{currentUser.about}</h2>
          </div>
        </div>
        <button
          className="profile__add-button"
          type="button"
          onClick={props.onAddPlace}
        />
      </section>

      <section className="cards-grid">
        <div className="elements">
          {props.cards.map((card) => (
            <Card
              key={card._id}
              card={card}
              link={card.link}
              name={card.name}
              likes={card.likes ? card.likes.length : 0}
              onCardClick={props.onCardClick}
              onCardLike={props.onCardLike}
              onCardDelete={props.onCardDelete}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

export default Main;
