(function() {
    var error = 2;

    module.exports =
    {
        root: true,
        extends: "eslint:recommended",
        formatter: "unix",
        env: {
            browser: true,
            amd: true,
            node: true,
            jasmine: true,
            jquery: true
        },
        rules: {
            semi: [error, "always"],
            quotes: [error, "double"],
            strict: [error, "never"],
            yoda: 2,
            eqeqeq: 2,
            curly: 2,
            "wrap-iife": [
                error,
                "inside"
            ],
			"indent": ["error", "tab"],
			"no-mixed-spaces-and-tabs": error,
            "no-useless-call": error,
            "no-self-compare": error,
            "no-sequences": error,
            "no-return-assign": error,
            "no-lone-blocks": error,
            "no-labels": error,
            "no-eval": error,
            "no-alert": error,
            "default-case": error,
            "consistent-return": error,
            "space-before-function-paren": [
                error,
                "never"
            ],
            "no-trailing-spaces": error,
            "no-multiple-empty-lines": [
                error,
                {
                    max: 1
                }
            ],
            "linebreak-style": [error, "unix"],
            "eol-last": [
                error,
                "unix"
            ],
            "one-var": [
                error,
                "never"
            ],
            "no-unused-vars": [
                error,
                {
                    args: "none"
                }
            ],
            "no-use-before-define": [
                error,
                "nofunc"
            ]
        }
    };
})();
