import { INPUT_NAME, type TInputName } from "../constants/INPUT_NAME";

export const validateInput = (inputName: TInputName, value: string): string => {
  switch (inputName) {
    case INPUT_NAME.FIRST_NAME:
    case INPUT_NAME.SECOND_NAME: {
      const regex = /^[А-ЯЁA-Z][а-яёa-z-]*$/;
      if (!regex.test(value)) {
        return "Разрешенный формат - первая буква заглавная, только буквы и дефис, без пробелов и цифр";
      }
      return "";
    }

    case INPUT_NAME.LOGIN: {
      const regex = /^(?!\d+$)[a-zA-Z0-9_-]{3,20}$/;
      if (!regex.test(value)) {
        return "Логин должен быть от 3 до 20 символов, только латиница, может содержать цифры, '-', '_', но не состоять только из цифр";
      }
      return "";
    }

    case INPUT_NAME.EMAIL: {
      const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+\.[a-zA-Z]+$/;
      if (!regex.test(value)) {
        return "Некорректный email";
      }
      return "";
    }

    case INPUT_NAME.PASSWORD:
    case INPUT_NAME.AGAIN_PASSWORD:
    case INPUT_NAME.OLD_PASSWORD:
    case INPUT_NAME.NEW_PASSWORD:
    case INPUT_NAME.AGAIN_NEW_PASSWORD: {
      const regex = /^(?=.*[A-Z])(?=.*\d)[^\s].{6,38}[^\s]$/; // разрешены любые символы, но пробелов в начале и конце быть не должно
      if (!regex.test(value)) {
        return "Пароль от 8 до 40 символов, хотя бы одна заглавная буква и цифра";
      }
      return "";
    }

    case INPUT_NAME.PHONE: {
      const regex = /^\+?\d{10,15}$/;
      if (!regex.test(value)) {
        return "Телефон должен быть от 10 до 15 цифр, может начинаться с +";
      }
      return "";
    }

    case INPUT_NAME.MESSAGE: {
      if (!value.trim()) {
        return "Сообщение не должно быть пустым";
      }
      return "";
    }

    default:
      return "";
  }
};
