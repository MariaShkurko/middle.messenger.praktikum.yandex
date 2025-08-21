import arrowIcon from "../../assets/arrow-icon.svg?raw";
import { Avatar, Button, Input } from "../../components";
import { INPUT_NAME } from "../../constants/INPUT_NAME";
import Block, { type Props } from "../../core/Block";
import { userMockData } from "../../mockData";
import { validateInput } from "../../utils/validateForm";

type TEditPasswordPage = Props & {
  formState: {
    oldPassword: string;
    newPassword: string;
    newPasswordAgain: string;
  };
  errors: {
    oldPassword: string;
    newPassword: string;
    newPasswordAgain: string;
  };
};

export default class EditPasswordPage extends Block<TEditPasswordPage> {
  constructor() {
    const formState = {
      oldPassword: "",
      newPassword: "",
      newPasswordAgain: "",
    };
    const errors = {
      oldPassword: "",
      newPassword: "",
      newPasswordAgain: "",
    };

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

    const BackButton = new Button({
      variant: "icon",
      page: "chats",
      icon: arrowIcon,
      onClick: (e: Event) => {
        e.preventDefault();
        console.log("navigate to chats");
      },
    });
    const SubmitButton = new Button({
      label: "Сохранить",
      variant: "primary",
      page: "user-profile",
      type: "submit",
      onClick: (e) => {
        e.preventDefault();
        console.log(this.props.formState);
      },
    });
    const UserAvatar = new Avatar({
      width: "130px",
      height: "130px",
      avatarUrl: userMockData.avatarUrl,
    });
    const InputOldPassword = new Input({
      id: INPUT_NAME.OLD_PASSWORD,
      formId: "user-profile-form",
      type: "password",
      variant: "line",
      value: formState.oldPassword,
      errorMessage: errors.oldPassword,
      onChange: (e) => {
        const target = e.target as HTMLInputElement;
        onChange(INPUT_NAME.OLD_PASSWORD, target.value);
      },
    });
    const InputNewPassword = new Input({
      id: INPUT_NAME.NEW_PASSWORD,
      formId: "user-profile-form",
      type: "password",
      variant: "line",
      value: formState.newPassword,
      errorMessage: errors.newPassword,
      onChange: (e) => {
        const target = e.target as HTMLInputElement;
        onChange(INPUT_NAME.NEW_PASSWORD, target.value);
      },
    });
    const InputAgainNewPassword = new Input({
      id: INPUT_NAME.AGAIN_NEW_PASSWORD,
      formId: "user-profile-form",
      type: "password",
      variant: "line",
      value: formState.newPasswordAgain,
      errorMessage: errors.newPasswordAgain,
      onChange: (e) => {
        const target = e.target as HTMLInputElement;
        onChange(INPUT_NAME.AGAIN_NEW_PASSWORD, target.value);
      },
    });

    super("div", {
      formState,
      errors,
      user: userMockData,
      className: "user-profile",
      BackButton,
      UserAvatar,
      InputOldPassword,
      InputNewPassword,
      InputAgainNewPassword,
      SubmitButton,
    });
  }

  render() {
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
              <span>Старый пароль</span>
              {{{ InputOldPassword }}}
            </div>
            <div class="user-profile__line">
              <span>Новый пароль</span>
              {{{ InputNewPassword }}}
            </div>
            <div class="user-profile__line">
              <span>Повторите новый пароль</span>
              {{{ InputAgainNewPassword }}}
            </div>
          </div>
          <div class="user-profile__controls user-profile__controls--edit">
            {{{ SubmitButton }}}
          </div>
        </form>
      </div>
    `;
  }
}
