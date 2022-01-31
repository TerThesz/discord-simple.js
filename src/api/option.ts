import { SimpleDriver } from 'classes';
import { ServerResponse } from 'http';
import { SimpleRequest } from 'interfaces';
import fetch from 'node-fetch';

export default async function option(req: SimpleRequest, res: ServerResponse) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5500');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  const driver = req.client.driver as SimpleDriver;

  switch (req.method) {
    case 'GET':
      get();
      break;
    case 'POST':
      post();
      break;
    case 'OPTIONS':
      res.writeHead(200).end();
      break;
    default:
      error(405, 'Method not allowed');
      break;
  }

  async function auth(req: SimpleRequest, res: ServerResponse) {
    let auth = req.headers.authorization;

    if (!auth) return error(401, 'Unauthorized');

    const [token, id] = auth.split('.');

    const user = await fetch('https://discordapp.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => res.json());

    if (user.id !== id) return error(401, 'Unauthorized');

    const guilds = await fetch('https://discordapp.com/api/v9/users/@me/guilds', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => res.json());

    if (!guilds || !guilds.length) return error(401, 'Unauthorized');

    const guild = guilds?.find((_guild: any) => _guild.id === req.query.guild_id);

    if (!guild) return error(404, 'Guild not found');

    if (!guild.owner && !((BigInt(guild.permissions) & (1n << 3n)) == 1n << 3n)) return error(401, 'Unauthorized');

    return true;
  }

  async function get() {
    let { guild_id, options } = req.query;
    if (!guild_id) return error(400, 'Missing guild_id');

    if (!(await auth(req, res))) return;

    if (
      !driver.guild_entry_exists({
        guild_id: guild_id,
        client: req.client,
      })
    )
      return error(404, "Guild doesn't have an error.");

    if (!options || options.toLowerCase() === 'all' || options === '*')
      return res.end(
        JSON.stringify(
          await driver.get_all_entries({
            client: req.client,
            guild_id: guild_id,
          })
        )
      );

    const response: any = {};
    await options.split(',').forEach(async (query_option) => {
      response[query_option] = await driver.get_entry({
        client: req.client,
        guild_id: guild_id,
        option: { key: query_option },
      });
    });

    return res.end(JSON.stringify(response));
  }

  async function post() {
    let { guild_id, option, value } = req.query;
    if (!guild_id) return error(400, 'Missing guild_id');
    if (!option || !value) return error(400, 'Missing option or value');

    if (!(await auth(req, res))) return;

    if (
      !driver.guild_entry_exists({
        guild_id: guild_id,
        client: req.client,
      })
    )
      return error(404, "Guild doesn't have an error.");

    const entry = {
      client: req.client,
      guild_id: guild_id,
      option: {
        key: option,
        value: value,
      },
    };

    if (await driver.get_entry(entry)) await driver.update_entry(entry);
    else await driver.add_entry(entry);

    return res.end(JSON.stringify({ success: true }));
  }

  function error(code: number, message: string) {
    res.writeHead(code).end(
      JSON.stringify({
        code: code,
        error: message,
      })
    );

    return false;
  }
}
