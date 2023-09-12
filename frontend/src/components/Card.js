import React from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Card(props) {
  const currentUser = React.useContext(CurrentUserContext);
  console.log(currentUser)
  console.log(props)
  const isOwn = props.card.owner._id === currentUser._id;
  const isLiked = props.card.likes.some((i) => i._id === currentUser._id);

  const cardLikeButtonClasses = `element__like ${
    isLiked ? "element__like_active" : ""
  }`;

  const cardDeleteButtonClasses = `element__delete ${
    isOwn ? "element__delete_active" : ""
  }`;

  function handleClick() {
    props.onCardClick(props.card);
  }

  function handleLikeClick() {
    props.onCardLike(props.card);
  }

  function handleDeleteClick() {
    props.onCardDelete(props.card);
  }

  return (
    <div className="element">
      <img
        className="element__photo"
        onClick={handleClick}
        src={props.link}
        alt={props.name}
      />
      <div className="element__description">
        <h3 className="element__title">{props.name}</h3>
        <div className="element__like-container">
          <button
            className={cardLikeButtonClasses}
            onClick={handleLikeClick}
            type="button"
          />
          <p className="element__like-counter">{props.likes}</p>
        </div>
      </div>
      <button
        className={cardDeleteButtonClasses}
        onClick={handleDeleteClick}
        type="button"
      />
    </div>
  );
}

export default Card;
