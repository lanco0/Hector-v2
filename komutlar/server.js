const source = require('gamedig');
const Discord = require('discord.js')

module.exports.run = async (client, message, args) => {

  try {
   let host = '51.77.77.237';
    let port = 27015;

    let data = await source.query({
      type: 'garrysmod',
      host: host,
      port: port
    });

    let stats = [
      {
        name: '<a:order_zil:879864884689502218>・Oyuncu Sayısı',
        value: `${data.players.length}/${data.maxplayers}`,
        inline: false
      },
      {
        name: '<a:order_zil:879864884689502218>・Sunucu Adresi',
        value: data.connect,
        inline: false
      },
      {
        name: '<a:order_zil:879864884689502218>・Harita',
        value: data.map,
        inline: false
      },
            {
        name: '<a:order_zil:879864884689502218>・Ping',
        value: data.ping,
        inline: false
      },
    ];

    let footer;
    if (data.password) {
      footer = {
        text: 'Gizli Sunucu',
        icon_url: ''
      };
    }

    message.channel.send({
      embed: {
        color: 0x00000,
        title: '[TR] New Order Roleplay | discord.gg/x6uHuK6jf3',
        fields: stats,
        footer: footer,
        thumbnail: {
        url: 'https://cdn.discordapp.com/icons/869590217978425344/d94343ae05388d49e50b1c7b09abb99a.png',
      }
        }
    });

    message.channel.send({
      embed: {
        color: 0x00000,
        description: '<a:order_url:879862650497007626> **Sunucuya Direkt Bağlanmak İçin Linke Tıkla \n steam://connect/51.89.178.178:27016**',
        footer: footer,
           }
        }
    );

  }
  catch (e) {
    if (e.toString() === 'Sunucu Aktif Değil') {
      return message.reply('bilinmeyen ip. Lütfen doğru ip giriniz.').then(msg => msg.delete(10000));
    }
    throw e;
  }
};


exports.conf = {
  aliases: ["server", "sunucu"],
  enabled: true,
  guildOnly: false,
permLevel: 0
};

exports.help = {
  name: 'ip',
  description: 'serveri hakkında istatistikleri öğrenirsiniz.',
  usage: 'ip'
};
