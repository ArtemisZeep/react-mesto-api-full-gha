function PopupWithForm(props) {
  return (
    <section
      className={`popup popup_form_place_${props.name} ${
        props.isOpen ? `popup_opened` : ""
      }`}
    >
      <div className="popup__container">
        <h3 className="popup__title">{props.title}</h3>
        <form
          className={`popup__form popup__form_place_${props.form}`}
          name={props.form}
          onSubmit={props.onSubmit}
        >
          {props.children}
          <button className="popup__submit-button" type="submit">
            {props.buttonText}
          </button>
        </form>
        <button
          className="popup__close popup__close_type_edit"
          type="button"
          onClick={props.onClose}
        />
      </div>
    </section>
  );
}

export default PopupWithForm;
