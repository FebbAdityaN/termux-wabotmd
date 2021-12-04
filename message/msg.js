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
const imgbb = require('imgbb-uploader')

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
		
		async function downloadAndSaveMediaMessage (type_file, path_file) {
			if (type_file === 'image') {
				var stream = await downloadContentFromMessage(msg.message.imageMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.imageMessage, 'image')
				let buffer = Buffer.from([])
				for await(const chunk of stream) {
					buffer = Buffer.concat([buffer, chunk])
				}
				fs.writeFileSync(path_file, buffer)
			} else if (type_file === 'video') {
				var stream = await downloadContentFromMessage(msg.message.videoMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.videoMessage, 'video')
				let buffer = Buffer.from([])
				for await(const chunk of stream) {
					buffer = Buffer.concat([buffer, chunk])
				}
				fs.writeFileSync(path_file, buffer)
			} else if (type_file === 'sticker') {
				var stream = await downloadContentFromMessage(msg.message.stickerMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.stickerMessage, 'sticker')
				let buffer = Buffer.from([])
				for await(const chunk of stream) {
					buffer = Buffer.concat([buffer, chunk])
				}
				fs.writeFileSync(path_file, buffer)
			} else if (type_file === 'audio') {
				var stream = await downloadContentFromMessage(msg.message.audioMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.audioMessage, 'audio')
				let buffer = Buffer.from([])
				for await(const chunk of stream) {
					buffer = Buffer.concat([buffer, chunk])
				}
				fs.writeFileSync(path_file, buffer)
			}
		}
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
		
		const templateButtons = [
			{ callButton: {displayText: `Call Owner!`, phoneNumber: `+6285770269605`} },
			{ urlButton: { displayText: `Star & Fork in Github!`, url : `https://github.com/FebbAdityaN/termux-wabotmd`} },
			{ quickReplyButton: { displayText: `🧑 Owner`, id: `${prefix}owner` } },
			{ quickReplyButton: { displayText: `💰 Donasi`, id: `${prefix}donate` } },
			{ quickReplyButton: { displayText: `🧬 Test Respon Bot`, id: `${prefix}test` } }
		]
        
		const isImage = (type == 'imageMessage')
		const isVideo = (type == 'videoMessage')
		const isSticker = (type == 'stickerMessage')
		const isQuotedMsg = (type == 'extendedTextMessage')
		const isQuotedImage = isQuotedMsg ? content.includes('imageMessage') ? true : false : false
		const isQuotedAudio = isQuotedMsg ? content.includes('audioMessage') ? true : false : false
		const isQuotedDocument = isQuotedMsg ? content.includes('documentMessage') ? true : false : false
		const isQuotedVideo = isQuotedMsg ? content.includes('videoMessage') ? true : false : false
		const isQuotedSticker = isQuotedMsg ? content.includes('stickerMessage') ? true : false : false
		
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

Fitur lainnya masih tahap pengembangan_^`, `WhatsApp Bot © 2020`, templateButtons)
				break
			case prefix+'sticker':
			case prefix+'stiker':
			case prefix+'s':
			case prefix+'sgif':
				if (isImage && isQuotedImage) {
					let media = await downloadAndSaveMediaMessage('image', `./temp/${sender}.jpg`)
					let path = fs.readFileSync(`./temp/${sender}.jpg`)
					let buffer = await WSF.createSticker(path, { type: "full" ,pack: "@febbyadityan" ,author: "WhatsApp Bot MD" ,categories: ['Yah']})
					fs.writeFileSync(`./temp/${sender}.webp`, buffer)
					let b = await imgbb('579dd872aef3b0eaaa35b0b0730eea31', `./temp/${sender}.webp`)
					client.sendMessage(from, {sticker: { url: b.url }}, { quoted: msg })
					fs.unlinkSync(media)
					fs.unlinkSync(`./temp/${sender}.webp`)
				} else if (isVideo || isQuotedVideo) {
					let media = await downloadAndSaveMediaMessage('video', `./temp/${sender}`)
					reply("Tunggu Sebentar..")
					await ffmpeg(`${media}`)
					.input(media)
					.on('start', function (cmd) {
						console.log(`Started : ${cmd}`)
					})
					.on('error', function (err) {
						console.log(`Error : ${err}`)
						fs.unlinkSync(media)
						let tipe = media.endsWith('.mp4') ? 'video' : 'gif'
						reply(`Gagal mengkonversi ${tipe} ke Sticker❌`)
					})
					.on('end', function () {
						console.log('Finish')
						exec(`webpmux -set exif ./temp/data.exif ./temp/${sender}.webp -o ./temp/${sender}.webp`, async (error) => {
							if (error) return reply("Terjadi Kesalahan")
							let a = await imgbb('579dd872aef3b0eaaa35b0b0730eea31', `./temp/${sender}.webp`)
							client.sendMessage(from, {sticker: { url: a.url }}, {quoted: msg})
							fs.unlinkSync(media)
							fs.unlinkSync(`./temp/${sender}.webp`)
						})
					})
					.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
					.toFormat('webp')
					.save(`./temp/${sender}.webp`)
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