import autoprefixer from "autoprefixer";
import postcssNested from "postcss-nested";
import postcssPresetEnv from "postcss-preset-env";

export default {
  plugins: [
    autoprefixer(),
    postcssNested(),
    postcssPresetEnv(),
  ],
};
