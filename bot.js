const Discord = require('discord.js');
const client = new Discord.Client({ partials: ["MESSAGE", "CHANNEL", "REACTION" ]}); //eğer en yukarıda client tanımlı ise bunu burdan kaldırıp yukarıya eklemelisin
const ayarlar = require('./ayarlar.json');
const fs = require('fs');
const Gamedig = require('gamedig');
const moment = require('moment');
// eklencekler
const db = require("quick.db");
//
require('./util/eventLoader')(client);

var prefix = ayarlar.prefix;

const log = message => {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./komutlar/", (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});
client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};
client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};
client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};


client.elevation = message => {
  if (!message.guild) {
    return;
  }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayarlar.sahip) permlvl = 4;
  return permlvl;
};

// kodlar
client.on("guildMemberAdd", async member => {
  let member2 = member.user;
  let zaman = new Date().getTime() - member2.createdAt.getTime();
  var user = member2;
  var takizaman = [];
  if (zaman < 2592000000) {
    takizaman = "Güvensiz Hesap <a:order_red:879790269573259274>";
  } else {
    takizaman = `Güvenli Hesap <a:order_onayla:879790240112455720>`;
  }
  require("moment-duration-format");
  let zaman1 = new Date().getTime() - user.createdAt.getTime();
  const gecen = moment
    .duration(zaman1)
    .format(
      ` YY **[Yıl •]** DD **[Gün •]** HH **[Saat •]** mm **[Dakika •]** ss **[Saniye]**`
    );
  let dbayarfalanfilan = await db.fetch(`takidbayar${member.guild.id}`);
  let message = client.channels.cache.get(`869607289206763522`); //id yazan kısma kanal id'si [orn: register-chat]  
  const taki = new Discord.MessageEmbed()
    .setTitle("***New Order'a Hoşgeldiniz***")
    .setDescription(
      `<a:order_settings:879789916324778004> | ${member} **Aramıza Katıldı!**

      <a:order_settings:879789916324778004> | Toplam Oyuncu Sayısı: **${message.guild.memberCount}**

      <a:order_settings:879789916324778004> | Hesap Oluşturma Tarihi: **${gecen}**

      <a:order_settings:879789916324778004> | Güvenlik Durumu: **${takizaman}**`
    )
    .setColor("RANDOM")
    .setFooter(`New Order`, client.user.avatarURL)
    .setTimestamp()
    .setThumbnail(user.avatarURL());
  message.send(taki);
});

client.on("ready", async () => {
  try {
    console.log(`${client.user.username} online`)
     setInterval(function () {
       Gamedig.query({
           type: 'garrysmod',
           host: '51.89.178.178',
          port: 27016
      }).then((state) => {
          client.user.setActivity( state.players.length + "/" + state.maxplayers + " [TR] New Order RolePlay", {type: "PLAYING"}).catch();
      }).catch((e) => {
        client.user.setActivity( "0/64 [TR] New Order Hogwarts RolePlay", {type: "PLAYING"}).catch();
       });
   }, 60000);
}catch (e) {
  console.log(e);
}
})

client.on('message', async message => {
  if (message.content === '!fakekatil') {
    client.emit('guildMemberAdd', message.member || await message.guild.fetchMember(message.author));
      }
  });

  client.on("message", async message => {
    if (message.channel.id === "869609527132176475") {
      message.react("879790240112455720");
      message.react("879790269573259274");
    }
  });

//Maine Atılacak!!!!!
const captcha = require("captcha-plus");

client.on("guildMemberAdd", async(member) => {
   captcha.create(member.id);
   member.author.send(new Discord.MessageEmbed().setThumbnail(captcha.convert(captcha.user(member.id).code).base64).setDescription("Doğrulama Kanalına Bu Kodu Yazın!"))
});

client.on("message", async(msg) => {
   if(message.channel.id !== "879907451800014858") return;
   let member = msg.guild.members.cache.find(r => r.id == msg.author.id)
   if(captcha.check(msg.author.id,message.content)) return member.roles.add("869595424120504360");
});


client.login(ayarlar.token);
