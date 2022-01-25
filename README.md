<p align="center">
  <img width="50%" height="50%"  src="https://raw.githubusercontent.com/terthesz/discord-simple.js/dev/.github/images/package-logo-with-text.png" />

  <p align="center">Simplified yet still as powerful version of discord.js<br/> for faster bot development. 🤖</p>

  <hr/>
</p>

<div align="right">
  <img src="https://img.shields.io/github/workflow/status/terthesz/discord-simple.js/%F0%9F%9A%80%20publish?label=publish&style=flat-square" />
  <img src="https://img.shields.io/npm/v/discord-simple.js?label=discord-simple.js&style=flat-square" />
  <img src="https://img.shields.io/snyk/vulnerabilities/npm/discord-simple.js?style=flat-square" />
</div>

## Usage

First of all, you need to install this package. You can do so

using npm: <br/>

```
npm install discord-simple.js
```

or using yarn: <br/>

```
yarn add discord-simple.js
```

<br/>

other instructions can be found in the [documentation (coming soon)](https://google.com)

## Example

Here is an example of how to make a simple bot using this package:

###### src/index.js

```javascript
const { SimpleClient } = require('discord-simple.js');

const client = new SimpleClient('token', 'client_id').load_commands();

// you can add your code here as you would in discord.js

client.login();
```

###### src/commands/ping.js

```javascript
const { SimpleCommand } = require('discord-simple.js');

module.exports = class PingCommand extends SimpleCommand {
  name = 'ping';
  description = 'Ping command';

  async execute(interaction, client) {
    interaction.reply('🏓 pong');
  }
};
```

<br/>

As you might have noticed, this library is not efficient for simple bots like this. However, it introduces a great advantage when making a bigger and/or more complex bot.

## About

I made this package to help other developers (but mainly myself) to make discord bots faster without the need to copy and paste or google code all the time.

<br/>

This package:

- uses the [discord.js](https://discord.js.org/) v13 library made by Discord.
- has a full support for TypeScript.
- is still in development. More changes will be made in the near future.

<br/>
