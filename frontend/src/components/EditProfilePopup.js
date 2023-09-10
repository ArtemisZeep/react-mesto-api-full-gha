import React from "react";
import PopupWithForm from "./PopupWithForm";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function EditProfilePopup(props) {
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const currentUser = React.useContext(CurrentUserContext);

  function handleNameChange(evt) {
    setName(evt.target.value);
  }

  function handleDescriptionChange(evt) {
    setDescription(evt.target.value);
  }

  function handleSubmit(evt) {
    evt.preventDefault();

    props.onSubmit({
      name: name,
      description: description,
    });
  }

  React.useEffect(() => {
    if (props.isOpen) {
      setName(currentUser.name);
      setDescription(currentUser.about);
    }
  }, [props.isOpen, currentUser]);

  return (
    <PopupWithForm
      isOpen={props.isOpen}
      onCloseClick={props.onCloseClick}
      onClose={props.onClose}
      name={"edit"}
      form={"profileData"}
      title={"Редактировать профиль"}
      buttonText={"Сохранить"}
      onSubmit={handleSubmit}
    >
      <input
        className="popup__input popup__input_text_name"
        type="text"
        name="text-name"
        value={name}
        onChange={handleNameChange}
        required
        minLength="2"
        maxLength="40"
      />
      <span className="popup__input-error popup__input-error_type_text-name" />
      <input
        className="popup__input popup__input_text_status"
        type="text"
        name="text-status"
        value={description}
        onChange={handleDescriptionChange}
        required
        minLength="2"
        maxLength="200"
      />
      <span className="popup__input-error popup__input-error_type_text-status" />
    </PopupWithForm>
  );
}

export default EditProfilePopup;
