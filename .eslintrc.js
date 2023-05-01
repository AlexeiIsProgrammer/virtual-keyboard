module.exports = {
    extends: ["airbnb-base", "prettier"],
    parser: '@babel/eslint-parser',
    env: {
        browser: true,
        es6: true,
        jest: true,
        node: true,
    },
    rules: {
        "no-console": 0,
        "import/prefer-default-export": 0,
        "prefer-template": 0,
    },
    parserOptions: {
        "requireConfigFile": false,
        "ecmaVersion": 8
    }
};