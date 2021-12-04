"use strict";
const {
	downloadContentFromMessage
} = require("@adiwajshing/baileys-md")
const { color, bgcolor } = require('../lib/color')
const { getBuffer, fetchJson, fetchText, getRandom, getGroupAdmins, runtime, sleep } = require("../lib/myfunc");

const fs = require ("fs")
const moment = require("moment-timezone");
const { exec, spawn } = require("child_process");
const xfar = require('xfarr-api');
const axios = require('axios')

moment.tz.setDefault("Asia/Jakarta").locale("id");

module.exports = async(client, msg, m, setting) => {
	try {
		let { ownerNumber, botName } = setting
		const jam = moment.tz('asia/jakarta').format('HH:mm:ss')
		const type = Object.keys(msg.message)[0]
		const content = JSON.stringify(msg.message)
		const fromMe = msg.key.fromMe
		const from = msg.key.remoteJid
		const chats = (type === 'conversation' && msg.message.conversation) ? msg.message.conversation : (type == 'imageMessage') && msg.message.imageMessage.caption ? msg.message.imageMessage.caption : (type == 'documentMessage') && msg.message.documentMessage.caption ? msg.message.documentMessage.caption : (type == 'videoMessage') && msg.message.videoMessage.caption ? msg.message.videoMessage.caption : (type == 'extendedTextMessage') && msg.message.extendedTextMessage.text ? msg.message.extendedTextMessage.text : (type == 'buttonsResponseMessage' && msg.message.buttonsResponseMessage.selectedButtonId) ? msg.message.buttonsResponseMessage.selectedButtonId : (type == 'templateButtonReplyMessage') && msg.message.templateButtonReplyMessage.selectedId ? msg.message.templateButtonReplyMessage.selectedId : ''
		const toJSON = j => JSON.stringify(j, null,'\t')
		if (client.multi) {
			var prefix = /^[°•><π÷×¶∆£¢€¥®™✓Z=|~!?#$%^&.\/\\©^]/.test(chats) ? chats.match(/^[°•><π÷×¶∆£¢€¥®™✓Z=|~!?#$%^&.\/\\©^]/gi)[0] : '-'
		} else {
			if (client.nopref) {
				prefix = ''
			} else {
				prefix = client.prefa
			}
		}
		const args = chats.split(' ')
		const command = chats.toLowerCase().split(' ')[0] || ''
		const isCmd = command.startsWith(prefix)
		const isGroup = msg.key.remoteJid.endsWith('@g.us')
		const sender = isGroup ? (msg.key.participant ? msg.key.participant : msg.participant) : msg.key.remoteJid
		const isOwner = ownerNumber.includes(sender)
		const pushname = msg.pushName
		const q = chats.slice(command.length + 1, chats.length)
		const body = chats.startsWith(prefix) ? chats : ''
		const botNumber = client.user.id.split(':')[0] + '@s.whatsapp.net'
		const groupMetadata = isGroup ? await client.groupMetadata(from) : ''
		const groupName = isGroup ? groupMetadata.subject : ''
		const groupId = isGroup ? groupMetadata.id : ''
		const groupMembers = isGroup ? groupMetadata.participants : ''
		const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
		const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
		const isGroupAdmins = groupAdmins.includes(sender)
		
		const isUrl = (url) => {
			return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
		}
		const reply = (teks) => {
			client.sendMessage(from, { text: teks }, { quoted: msg })
		}
		const sendMess = (hehe, teks) => {
			client.sendMessage(hehe, { text, teks })
		}
		const buttonWithText = (from, text, footer, buttons) => {
			return client.sendMessage(from, { text: text, footer: footer, templateButtons: buttons })
		}
		const sendContact = (jid, numbers, name, quoted, mn) => {
			let number = numbers.replace(/[^0-9]/g, '')
			const vcard = 'BEGIN:VCARD\n' 
			+ 'VERSION:3.0\n' 
			+ 'FN:' + name + '\n'
			+ 'ORG:;\n'
			+ 'TEL;type=CELL;type=VOICE;waid=' + number + ':+' + number + '\n'
			+ 'END:VCARD'
			return client.sendMessage(from, { contacts: { displayName: name, contacts: [{ vcard }] }, mentions : mn ? mn : []},{ quoted: quoted })
		}
		const Exif = require(process.cwd() + '/lib/exif.js')
		const exif = new Exif()
		const stikerwm = (media, packname, author) => {
			ran = 'stikerweem.webp'
			exif.create(packname, author, sender.split("0")[0])
			exec(`webpmux -set exif ./temp/${sender.split("0")[0]}.exif ./${media} -o ./${ran}`, (err, stderr, stdout) => {
				if (err) return reply(String(err))
				client.sendMessage(from, { sticker: { fs.readFileSync(ran) }, { quoted: msg }).then(v => fs.unlinkSync(ran))
			})
		}
		
		const templateButtons = [
			{ callButton: {displayText: `Call Owner!`, phoneNumber: `+6285770269605`} },
            { urlButton: { displayText: `Star Bot in Github!`, url : `https://github.com/FebbAdityaN/termux-wabotmd`} },
            { quickReplyButton: { displayText: `🧑 Owner`, id: `${prefix}owner` } },
            { quickReplyButton: { displayText: `💰 Donasi`, id: `${prefix}donate` } },
            { quickReplyButton: { displayText: `🧬 Test Respon Bot`, id: `${prefix}test` } }
        ]
		
		const isMedia = (type === 'imageMessage' || type === 'videoMessage')
		const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
		const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
		const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')
		const isQuotedAudio = type === 'extendedTextMessage' && content.includes('audioMessage')
		
		if (chats.startsWith('>') && isOwner) {
			try {
				let evaled = chats.replace('>' + " ", "")
				let woo = await eval(sy)
				reply(`${toJSON(woo)}`)
			} catch (e) {
				await reply('\`\`\`Console Error\`\`\`\n\n' + require('util').inspect(e))
			}
		}
		
		// Logs;
		if (!isGroup && isCmd) console.log('->[\x1b[1;32mCMD\x1b[1;37m]', color(moment(msg.messageTimestamp * 1000).format('DD/MM/YYYY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushName))
		if (isGroup && isCmd) console.log('->[\x1b[1;32mCMD\x1b[1;37m]', color(moment(msg.messageTimestamp *1000).format('DD/MM/YYYY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushName), 'in', color(groupName))
		
		switch(command) {
			case prefix+'test':
				reply('Test, sukses respon!')
				break
			case prefix+'donate':
			case prefix+'donasi':
				reply(`──「 MENU DONATE 」──\n\nHi ${pushname} 👋🏻\n\`\`\`GOPAY/DANA : 085770269605\`\`\`\n\`\`\`PULSA : 0895382331666 (Tri/3)\`\`\`\nTerimakasih untuk kamu yang sudah donasi untuk perkembangan bot ini _^\n──「 THX FOR YOU ! 」──`)
				break
			case prefix+'owner':
				for (let x of ownerNumber) {
					sendContact(from, x.split('@s.whatsapp.net')[0], 'Owner', msg)
				}
				break
			case prefix+'menu':
			case prefix+'help':
				buttonWithText(from, `Heyyyoooo *${pushname}* 🐨

≻ ${prefix}test
≻ ${prefix}sticker

Fitur lainnya masih tahap pengembangan_^`, `WhatsApp Bot © 2020`, buttonsDefault)
				break
			case prefix+'s':
			case prefix+'sticker':
			case prefix+'stiker':
				if ((isMedia && !msg.message.videoMessage || isQuotedImage) && args.length == 0) {
					const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(msg).replace('quotedM','m')).message.extendedTextMessage.contextInfo : msg
					const media = await client.downloadAndSaveMediaMessage(encmedia)
					ran = getRandom('.webp')
					await ffmpeg(`./${media}`)
					.input(media)
					.on('start', function (cmd) {
						console.log(`Started : ${cmd}`)
					})
					.on('error', function (err) {
						console.log(`Error : ${err}`)
						fs.unlinkSync(media)
						reply('Gagal saat mengkonversi gambar ke sticker❌')
					})
					.on('end', function () {
						console.log('Finish')
						stikerwm(ran, `${settings.packname}`, `${settings.author}`)
						fs.unlinkSync(media)
					})
					.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
					.toFormat('webp')
					.save(ran)
				} else if ((isMedia && msg.message.videoMessage.seconds < 11 || isQuotedVideo && msg.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.seconds < 11) && args.length == 0) {
					const encmedia = isQuotedVideo ? JSON.parse(JSON.stringify(msg).replace('quotedM','m')).message.extendedTextMessage.contextInfo : msg
					const media = await client.downloadAndSaveMediaMessage(encmedia)
					ran = getRandom('.webp')
					reply('Tunggu sebentar..')
					await ffmpeg(`./${media}`)
					.inputFormat(media.split('.')[1])
					.on('start', function (cmd) {
						console.log(`Started : ${cmd}`)
					})
					.on('error', function (err) {
						console.log(`Error : ${err}`)
						fs.unlinkSync(media)
						tipe = media.endsWith('.mp4') ? 'video' : 'gif'
						reply(`❌ Gagal, pada saat mengkonversi ${tipe} ke stiker`)
					})
					.on('end', function () {
						console.log('Finish')
						stikerwm(ran, `${settings.packname}`, `${settings.author}`)
						fs.unlinkSync(media)
					})
					.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
					.toFormat('webp')
					.save(ran)
				} else if ((isMedia || isQuotedImage) && colors.includes(args[0])) {
					const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(msg).replace('quotedM','m')).message.extendedTextMessage.contextInfo : msg
					const media = await client.downloadAndSaveMediaMessage(encmedia)
					ran = getRandom('.webp')
					await ffmpeg(`./${media}`)
					.on('start', function (cmd) {
						console.log('Started :', cmd)
					})
					.on('error', function (err) {
						fs.unlinkSync(media)
						console.log('Error :', err)
					})
					.on('end', function () {
						console.log('Finish')
						fs.unlinkSync(media)
						stikerwm(ran, `${settings.packname}`, `${settings.author}`)
					})
					.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=${args[0]}@0.0, split [a][b]; [a] palettegen=reserve_transparent=off; [b][p] paletteuse`])
					.toFormat('webp')
					.save(ran)
				} else {
					reply(`Kirim gambar dengan caption ${prefix}sticker atau tag gambar yang sudah dikirim, dan maksimal 10 detik untuk video`)
				}
				break
			default:
			if (!isGroup && isCmd) {
				reply(`Command belum tersedia, coba beberapa hari kedepan yaa! _^`)
			}
		}
	} catch (e) {
		console.log('Error : %s', color(e, 'red'))
	}
}