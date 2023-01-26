const { Client, Location, List, Buttons, LocalAuth, MessageMedia} = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const solenolyrics= require("solenolyrics"); 
const tools = require('./Utilis/tools.js')
const database = require('./Database/products.json')

const adminNum = "918949950576@c.us"
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true,
    args: ["--no-sandbox"], }
});

client.initialize();

client.on('loading_screen', (percent, message) => {
    console.log('LOADING SCREEN', percent, message);
});

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('authenticated', () => {
    console.log('AUTHENTICATED');
});

client.on('auth_failure', msg => {
    // Fired if session restore was unsuccessful
    console.error('AUTHENTICATION FAILURE', msg);
});

client.on('ready', () => {
    console.log('READY');
	client.sendMessage(adminNum, "Client is ready!");
});

client.on('message', async msg => {
    console.log('MESSAGE RECEIVED', msg);
    let user = msg.body.toLocaleLowerCase()
    // Basic Commands
    if (user === '!ping reply') {
        // Send a new message as a reply to the current one
        msg.reply('pong');

    } else if (user === '!ping') {
        // Send a new message to the same chat
        client.sendMessage(msg.from, 'pong');

    } else if (user === 'test') {
        msg.reply('pass :)')

    } else if (msg.body === '!info') {
        let info = client.info;
        client.sendMessage(msg.from, `
            *Connection info*
            User name: ${info.pushname}
            My number: ${info.wid.user}
            Platform: ${info.platform}
        `);
    } else if (user === '!uptime') {
        msg.reply(`*Bot has been running for:* ${tools.humanTime(process.uptime() * 1000)}`)
    } 
  
    else if (user.indexOf('!eval') == 0) {
        try {
			let ui = msg.body.slice(5)
			let outp = eval(ui);
			switch (typeof outp) {
				case 'object': outp = JSON.stringify(outp, null, 2); break;
				case 'function': outp = outp.toString(); break;
				case 'undefined': outp = 'undefined'; break;
			}
			if ((!String(outp).split('\n')[1] && String(outp.length > 300))) client.sendMessage(msg.from,String(outp));
			else client.sendMessage(msg.from,String(outp));
		} catch (e) {console.log(e); client.sendMessage(msg.from,e.message)};
		return;
    } else if (user.indexOf('!hotpatch') == 0) {
      var serverjs;
      delete require.cache[require.resolve('./index.js')];
      serverjs = require('./index.js');
		  console.log('poggers')
		  client.sendMessage(msg.from,'Server has been hotpatched.');
    }

    // Major Features
    else if (user.indexOf('!lyrics') == 0) {
        msg.reply('Searching..')
        async function song() {
            try {
                let ar = msg.body.slice(8)
                console.log(ar)
                var lyrics = await solenolyrics.requestLyricsFor(ar); 
                console.log(lyrics);
                var title = await solenolyrics.requestTitleFor(ar); 
                console.log(title);
                var author = await solenolyrics.requestAuthorFor(ar); 
                console.log(author);
                client.sendMessage(msg.from, `*${title}* by *${author}*\n${lyrics}`)
            } catch(err) {
                console.log(err)
                client.sendMessage(msg.from, `Oops! There's an error while fetching the lyrcis.`)
            }	
        };
            song()

    
    } else if (user.indexOf('!yt') == 0) {
        msg.reply(`Loading....`)
	    var YoutubeMp3Downloader = require("youtube-mp3-downloader");
	    var link= msg.body.slice(4)
        if (link.includes("https://youtu.be/")) { link = link.slice(17)}
        if (link.includes("https://www.youtube.com/watch?v=")) { link = link.slice(32)}
        

        //Configure YoutubeMp3Downloader with your settings
        var YD = new YoutubeMp3Downloader({
            "ffmpegPath": "/usr/bin/ffmpeg",        // FFmpeg binary location
            "outputPath": "./Output/",    // Output file location (default: the home directory)
            "youtubeVideoQuality": "highestaudio",  // Desired video quality (default: highestaudio)
            "queueParallelism": 2,                  // Download parallelism (default: 1)
            "progressTimeout": 2000,                // Interval in ms for the progress reports (default: 1000)
            "allowWebm": false                      // Enable download from WebM sources (default: false)
        });
 
        //Download video and save as MP3 file
        YD.download(link);

        YD.on("finished", function(err, data) {
        	console.log(JSON.stringify(data));
        	var outputmp3 = MessageMedia.fromFilePath((data.file));
        	msg.reply('Your audio file has been downloaded!')
        	client.sendMessage(msg.from,outputmp3)
        });

        YD.on("error", function(error) {
        	console.log(error);
        	msg.reply('Error...')
        });

        YD.on("progress", function(progress) {
        	console.log(JSON.stringify(progress));
        });
    } 
});

client.on('message_create', (msg) => {
    // Fired on all message creations, including your own
    if (msg.fromMe) {
        // do stuff here
    }
});

client.on('message_revoke_everyone', async (after, before) => {
    // Fired whenever a message is deleted by anyone (including you)
    console.log(after); // message after it was deleted.
    if (before) {
        console.log(before); // message before it was deleted.
    }
});

client.on('message_revoke_me', async (msg) => {
    // Fired whenever a message is only deleted in your own view.
    console.log(msg.body); // message before it was deleted.
});

client.on('message_ack', (msg, ack) => {
    /*
        == ACK VALUES ==
        ACK_ERROR: -1
        ACK_PENDING: 0
        ACK_SERVER: 1
        ACK_DEVICE: 2
        ACK_READ: 3
        ACK_PLAYED: 4
    */

    if(ack == 3) {
        // The message was read
    }
});

client.on('group_join', (notification) => {
    // User has joined or been added to the group.
    console.log('join', notification);
    notification.reply('User joined.');
});

client.on('group_leave', (notification) => {
    // User has left or been kicked from the group.
    console.log('leave', notification);
    notification.reply('User left.');
});

client.on('group_update', (notification) => {
    // Group picture, subject or description has been updated.
    console.log('update', notification);
});

client.on('change_state', state => {
    console.log('CHANGE STATE', state );
});

client.on('disconnected', (reason) => {
    console.log('Client was logged out', reason);
});