<template>
  <nav class="navbar navbar-expand-lg navbar-dark">
    <img class="mr-2" src="/logo.png" alt="logo img" height="50">

    <div class="collapse navbar-collapse" id="navbar1">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item">
          <a class="navbar-brand font-weight-bold" href="/">
            ОНЛАЙН БРОНИРОВАНИЕ
            <br>СПОРТИВНЫХ ПЛОЩАДОК
          </a>
        </li>
      </ul>
      <form class="form-inline my-2 my-lg-0">
        <div class="input-group">
          <input
            type="text"
            class="form-control"
            placeholder="Поиск..."
            aria-describedby="basic-addon2"
          >
          <div class="input-group-append">
            <button class="btn btn-light btn-outline-secondary" type="button">
              <i class="fas fa-search"/>
            </button>
          </div>
        </div>
      </form>
      <ul class="navbar-nav ml-3">
        <li class="nav-item">
          <button type="button" class="btn btn-white" data-toggle="modal" data-target="#loginModal">
            ВОЙТИ
            <i class="fas fa-user"/>
          </button>
        </li>
      </ul>
      <div
        class="modal"
        id="loginModal"
        role="dialog"
        aria-labelledby="loginModalTitle"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-body">
              <h5
                class="modal-title mb-3 text-center blue-text"
                id="loginModalLongTitle"
              >Вход в личный кабинет</h5>
              <form class="text-center">
                <div class="form-group">
                  <input
                    type="login"
                    class="form-control"
                    id="exampleInputLogin1"
                    aria-describedby="loginHelp"
                    placeholder="Логин"
                  >
                </div>
                <div class="form-group">
                  <input
                    type="password"
                    class="form-control"
                    id="exampleInputPassword1"
                    placeholder="Пароль"
                  >
                  <a
                    :style="{ cursor: 'pointer' }"
                    data-toggle="modal"
                    data-target="#PassModal"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <small>Забыли пароль?</small>
                  </a>
                </div>
                <button type="submit" class="btn btn-primary modal-button">Войти</button>
                <button
                  data-toggle="modal"
                  data-target="#registerModal"
                  data-dismiss="modal"
                  aria-label="Close"
                  class="btn btn-primary modal-button"
                >Регистрация</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div
        class="modal"
        id="PassModal"
        role="dialog"
        aria-labelledby="loginModalTitle"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-body">
              <h5
                class="modal-title mb-3 text-center blue-text"
                id="loginModalLongTitle"
              >Восстановление пароля</h5>
              <form class="text-center">
                <div class="form-group">
                  <input
                    type="email"
                    class="form-control"
                    id="exampleInputLogin1"
                    aria-describedby="emailHelp"
                    placeholder="Введите E-mail"
                  >
                </div>
                <button type="submit" class="btn btn-primary">Далее</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div
        class="modal"
        id="isProvider"
        role="dialog"
        aria-labelledby="loginModalTitle"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-body">
              <h5
                class="modal-title mb-3 text-center blue-text"
                id="loginModalLongTitle"
              >Выберите роль</h5>
              <form action="asset('/')" id="selectModal" class="text-center">
                <div class="form-group">
                  <select name="is_provider" type="text" class="form-control" id="selectRole">
                    <option disabled selected hidden>Выберите роль</option>
                    <option type="checkbox" value="true">Собственник</option>
                    <option value="false">Обычный смертный</option>
                  </select>
                </div>
                <button type="button" id="send">заполнить</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <!-- <div
        class="modal fade"
        id="registerModal"
        :tabindex="-1"
        role="dialog"
        aria-labelledby="loginModalTitle"
        aria-hidden="true"
      >
        <RegisterForm/>
      </div>-->
    </div>
  </nav>
</template>
<style lang="scss" scoped>
</style>

