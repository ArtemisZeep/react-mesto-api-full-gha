import React from "react";
import PopupWithForm from "./PopupWithForm";

function EditAvatarPopup(props) {
  const ref = React.useRef();

  function handleSubmit(evt) {
    evt.preventDefault();

    props.onSubmit({
      avatar: ref.current.value,
    });
  }

  React.useEffect(() => {
    ref.current.value = "";
  }, [props.isOpen]);

  return (
    <PopupWithForm
      isOpen={props.isOpen}
      onCloseClick={props.onCloseClick}
      onClose={props.onClose}
      name={"avatar"}
      form={"placeData"}
      title={"Обновить аватар"}
      buttonText={"Сохранить"}
      onSubmit={handleSubmit}
    >
      <input
        ref={ref}
        type="url"
        className="popup__input popup__input_avatar_input"
        name="avatar-edit"
        required
        placeholder="Введите ссылку на аватар"
      />
      <span className="popup__input-error popup__input-error_type_avatar-edit"></span>
    </PopupWithForm>
  );
}

export default EditAvatarPopup;
