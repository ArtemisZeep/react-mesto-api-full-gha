function ImagePopup(props) {
  return (
    <section
      className={`popup popup-photo ${props.card ? "popup_opened" : ""}`}
    >
      <div className="popup__container popup-photo__container">
        <img
          className="popup-photo__photo"
          src={props.card ? props.card.link : ""}
          alt={props.card ? props.card.name : ""}
        />
        <p className="popup-photo__name">{props.card ? props.card.name : ""}</p>
        <button
          className="popup__close"
          type="button"
          onClick={props.onClose}
        />
      </div>
    </section>
  );
}

export default ImagePopup;
