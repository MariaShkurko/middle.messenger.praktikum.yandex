import autoprefixer from 'autoprefixer';
import postcssNesting from 'postcss-nesting';
import postcssPresetEnv from 'postcss-preset-env';
import stylelint from 'stylelint';

export default {
    plugins: [
        stylelint(),
        autoprefixer(),
        postcssNesting(),
        postcssPresetEnv(),
    ],
};