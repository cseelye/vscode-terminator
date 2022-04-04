# vscode-terminator
Launch customized terminals in VS Code

This extension allows you to define custom terminals in your settings and launch them with a command from the palette (*Terminator: Launch Terminal*) or API (`vscode-terminator.launchTerminal`).

## Settings
Top level settings:  
`terminator.env` allows you to specify environment variables to set for all terminals.  
`terminator.terminals` is a list of terminal objects where you specify your terminal configurations.

Per-terminal settings:
| Setting   | Description |
| --------- | ----------- |
| name      | Friendly name for the terminal |
| color     | Color to make the terminal icon; see https://code.visualstudio.com/api/references/theme-color#integrated-terminal-colors |
| icon      | Icon to set for the terminal; see https://code.visualstudio.com/api/references/icons-in-labels#icon-listing |
| message   | Initial message to show when the terminal is created |
| shellPath | Path to the shell executable |
| shellArgs | Args to pass to the shell executable, in exec format |
| workDir   | Directory to start the shell in |
| env       | Shell-specific environment variables to set |

Environment variables are combines from the global list and per-terminal list, with the per-terminal list having precedence. Environment variables that are used in shellPath or shellArgs will be replaced with the values.

## Example Configuration

```js
{
    "terminator.env": {
        "asdf": "123",
        "qwerty": "some string"
    },
    "terminator.terminals": [
        {
            "name": "first",
            "color": "terminal.ansiCyan",
            "icon": "server",
            "message": "\nThis is your important terminal\n",
            "shellPath": "/bin/bash",
            "shellArgs": ["${login}"],
            "workDir": "/tmp",
            "env": {
                "asdf": "987",
                "hello": "there",
                "login": "-l"
            }
        }
    ]
}
```
