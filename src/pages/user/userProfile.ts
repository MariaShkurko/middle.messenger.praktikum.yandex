import { Avatar, Button, Input } from "../../components";
import Block, { type Props } from "../../core/Block";
import arrowIcon from "../../assets/arrow-icon.svg?raw";
import { validateInput } from "../../utils/validateForm";
import { INPUT_NAME } from "../../constants/INPUT_NAME";
import { userMockData } from "../../mockData";

type TUserProfilePage = Props & {
  formState: {
    email: string;
    login: string;
    firstName: string;
    secondName: string;
    displayName: string;
    phone: string;
  };
  errors: {
    email: string;
    login: string;
    firstName: string;
    secondName: string;
    displayName: string;
    phone: string;
  };
  isEdit: boolean;
};

export default class UserProfilePage extends Block<TUserProfilePage> {
  constructor() {
    const formState = {
      email: "",
      login: "",
      firstName: "",
      secondName: "",
      displayName: "",
      phone: "",
    };
    const errors = {
      email: "",
      login: "",
      firstName: "",
      secondName: "",
      displayName: "",
      phone: "",
    };
    const isEdit = false;

    const onChange = (id: string, value: string) => {
      this.setProps({
        formState: {
          ...this.props.formState,
          [id]: value,
        },
        errors: {
          ...this.props.errors,
          [id]: validateInput(id, value),
        },
      });
    };
    const onChangeIsEdit = (newValue: boolean) => {
      this.setProps({ isEdit: newValue });
    };

    const BackButton = new Button({
      variant: "icon",
      page: "chats",
      icon: arrowIcon,
      onClick: (e: Event) => {
        e.preventDefault();
        console.log("navigate to chats");
      },
    });
    const EditProfileButton = new Button({
      label: "Изменить данные",
      variant: "link",
      type: "button",
      onClick: (e) => {
        e.preventDefault();
        onChangeIsEdit(true);
      },
    });
    const EditPasswordButton = new Button({
      label: "Изменить пароль",
      variant: "link",
      page: "edit-password",
      type: "button",
      onClick: (e) => {
        e.preventDefault();
        console.log("navigate to edit password");
      },
    });
    const ExitButton = new Button({
      label: "Выйти",
      variant: "link",
      page: "login",
      type: "button",
      onClick: (e) => {
        e.preventDefault();
        console.log("navigate to login");
      },
    });
    const SubmitButton = new Button({
      label: "Сохранить",
      variant: "primary",
      type: "submit",
      onClick: (e) => {
        e.preventDefault();
        console.log(this.props.formState);
        onChangeIsEdit(false);
      },
    });
    const UserAvatar = new Avatar({
      width: "130px",
      height: "130px",
      avatarUrl: userMockData.avatarUrl,
    });
    const InputEmail = new Input({
      id: INPUT_NAME.EMAIL,
      formId: "user-profile-form",
      type: "email",
      variant: "line",
      value: formState.email,
      errorMessage: errors.email,
      disabled: !isEdit,
      onChange: (e) => {
        const target = e.target as HTMLInputElement;
        onChange(INPUT_NAME.EMAIL, target.value);
      },
    });
    const InputLogin = new Input({
      id: INPUT_NAME.LOGIN,
      formId: "user-profile-form",
      type: "text",
      variant: "line",
      value: formState.login,
      errorMessage: errors.login,
      disabled: !isEdit,
      onChange: (e) => {
        const target = e.target as HTMLInputElement;
        onChange(INPUT_NAME.LOGIN, target.value);
      },
    });
    const InputFirstName = new Input({
      id: INPUT_NAME.FIRST_NAME,
      formId: "user-profile-form",
      type: "text",
      variant: "line",
      value: formState.firstName,
      errorMessage: errors.firstName,
      disabled: !isEdit,
      onChange: (e) => {
        const target = e.target as HTMLInputElement;
        onChange(INPUT_NAME.FIRST_NAME, target.value);
      },
    });
    const InputSecondName = new Input({
      id: INPUT_NAME.SECOND_NAME,
      formId: "user-profile-form",
      type: "text",
      variant: "line",
      value: formState.secondName,
      errorMessage: errors.secondName,
      disabled: !isEdit,
      onChange: (e) => {
        const target = e.target as HTMLInputElement;
        onChange(INPUT_NAME.SECOND_NAME, target.value);
      },
    });
    const InputDisplayName = new Input({
      id: INPUT_NAME.DISPLAY_NAME,
      formId: "user-profile-form",
      type: "text",
      variant: "line",
      value: formState.displayName,
      errorMessage: errors.displayName,
      disabled: !isEdit,
      onChange: (e) => {
        const target = e.target as HTMLInputElement;
        onChange(INPUT_NAME.DISPLAY_NAME, target.value);
      },
    });
    const InputPhone = new Input({
      id: INPUT_NAME.PHONE,
      formId: "user-profile-form",
      type: "tel",
      variant: "line",
      value: formState.phone,
      errorMessage: errors.phone,
      disabled: !isEdit,
      onChange: (e) => {
        const target = e.target as HTMLInputElement;
        onChange(INPUT_NAME.PHONE, target.value);
      },
    });

    super("div", {
      formState,
      errors,
      isEdit,
      user: userMockData,
      className: "user-profile",
      BackButton,
      UserAvatar,
      InputEmail,
      InputLogin,
      InputFirstName,
      InputSecondName,
      InputDisplayName,
      InputPhone,
      EditProfileButton,
      EditPasswordButton,
      ExitButton,
      SubmitButton,
    });
  }

  render() {
    const ControlsBlock = this.props.isEdit
      ? `
        <div class="user-profile__controls user-profile__controls--edit">
          {{{ SubmitButton }}}
        </div>
      `
      : `
        <div class="user-profile__controls">
          <div class="user-profile__line">
            {{{ EditProfileButton }}}
          </div>
          <div class="user-profile__line">
            {{{ EditPasswordButton }}}
          </div>
          <div class="user-profile__line button--exit">
            {{{ ExitButton }}}
          </div>
        </div>
      `;

    return `
      <div class="user-profile__back-button">
        {{{ BackButton }}}
      </div>
      <div class="user-profile__main">
        <form id="user-profile-form">

          <div class="user-profile__short-info">
            {{{ UserAvatar }}}
            <p>{{user.display_name}}</p>
          </div>

          <div class="user-profile__detailed-info">
            <div class="user-profile__line">
              <span>Почта</span>
              {{{ InputEmail }}}
            </div>
            <div class="user-profile__line">
              <span>Логин</span>
              {{{ InputLogin }}}
            </div>
            <div class="user-profile__line">
              <span>Имя</span>
              {{{ InputFirstName }}}
            </div>
            <div class="user-profile__line">
              <span>Фамилия</span>
              {{{ InputSecondName }}}
            </div>
            <div class="user-profile__line">
              <span>Имя в чате</span>
              {{{ InputDisplayName }}}
            </div>
            <div class="user-profile__line">
              <span>Телефон</span>
              {{{ InputPhone }}}
            </div>
          </div>
          ${ControlsBlock}
        </form>
      </div>

      {{#> Modal id="change-avatar-modal" active=false }}
        <form id="user-avatar-form">
          <p class="modal__title">Загрузите файл</p>

          <label class="avatar-modal__file-label">
            <input type="file" name="avatar" accept="image/*" class="avatar-modal__file-input" />
            <span class="avatar-modal__file-text">Выбрать файл на компьютере</span>
          </label>

          {{> Button label="Поменять" type="submit" class="avatar-modal__submit" }}
        </form>
      {{/Modal}}
    `;
  }
}
