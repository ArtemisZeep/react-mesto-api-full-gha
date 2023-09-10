function InfoTooltip(props) {
  return (
    <div
      className={`popup ${props.isOpen ? "popup_opened" : ""}`}
      onClick={props.onCloseClick}
    >
      <div className="popup__info">
        <img className="popup__status" src={props.image} alt={props.title} />
        <p className="popup__message">{props.title}</p>
        <button
          className="popup__close"
          type="button"
          title="Закрыть"
          onClick={props.onClose}
        />
      </div>
    </div>
  );
}

export default InfoTooltip;
