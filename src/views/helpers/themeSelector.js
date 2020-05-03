const {
    details,
    summary,
    div,
    form,
    input,
    label,
    button,
    style,
    fieldset
} = require("hyperaxe");

const { themeNames } = require("@fraction/base16-css");

const requireStyle = require("require-style");

const testMessage = {
    value: {
        "content": {
            "type": "post",
            "text": "I have written a very [Test message](#).\n",
            "mentions": []
        },
        meta: {
            author: {
                name: 'Test user',
                avatar: {
                    url: ''
                }
            },
            timestamp: {
                received: {
                    since: ''
                }
            },
            votes: []
        }
    }
};


const cssPrefix = 'theme-examples';

const themes = themeNames.map(value => {
    const name = value;

    const packageName = "@fraction/base16-css";
    const filePath = `${packageName}/src/base16-${value}.css`;
    const css = requireStyle(filePath).match(/:root ([^]+)/m)[1];

    return {
        value,
        name,
        css
    }
});


function getId(value) {
    return `${cssPrefix}-${value}`;
}

function generateStyles(list) {
    return list.map(({name, value, css}, index, {length}) => `
        #${getId(value)}:checked + label
        ${Array(length - index - 1).fill('+ input + label').join('\n')} + .${cssPrefix}-post ${css}
    `).join('');
}

function generateInputs(list, currentTheme) {
    return list.reduce((result, {value, name}) => {
        const id = getId(value);

        return result.concat([
            input({
                name: 'theme',
                type: 'radio',
                value,
                id,
                ...(value === currentTheme)
                    ? {checked: true}
                    : {}
            }),
            label({for: id}, name)
        ]);
    }, []);
}

function themeSelector({post, i18n, currentTheme}) {
    return details(
        {open: true},
        summary('Themes preview'),
        style(generateStyles(themes)),
        form(
            { action: "/theme.css", method: "post" },
            button({ type: "submit" }, i18n.setTheme),
            div(
                {class: cssPrefix},
                ...generateInputs(themes, currentTheme),
                div({
                    class: `${cssPrefix}-post`
                },
                    post({
                        msg: testMessage
                    })
                )
            )
        ),
    );
}

module.exports = themeSelector;
