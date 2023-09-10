import { useState } from "react";
import { Link } from "react-router-dom";

function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleEmailInput(event) {
    setEmail(event.target.value);
  }

  function handlePasswordInput(event) {
    setPassword(event.target.value);
  }

  const handleSubmit = (evt) => {
    evt.preventDefault();
    props.handleLogin(email, password);
  };

  return (
    <section className="login">
      <h3 className="login__title">Вход</h3>
      <form className="login__form" onSubmit={handleSubmit}>
        <input
          className="login__input"
          type="email"
          value={email}
          onChange={handleEmailInput}
          placeholder="Email"
          required
        />
        <input
          className="login__input"
          type="password"
          value={password}
          autoComplete="on"
          onChange={handlePasswordInput}
          placeholder="Пароль"
          required
        />
        <button className="login__button" type="submit">
          Войти
        </button>
      </form>
    </section>
  );
}

export default Login;
