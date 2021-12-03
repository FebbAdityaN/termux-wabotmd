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
		const sendContact = (jid, numbers, name, quoted, mek) => {
			let number = numbers.replace(/[^0-9]/g, '')
			const vcard = 'BEGIN:VCARD\n' 
			+ 'VERSION:3.0\n' 
			+ 'FN:' + name + '\n'
			+ 'ORG:;\n'
			+ 'TEL;type=CELL;type=VOICE;waid=' + number + ':+' + number + '\n'
			+ 'END:VCARD'
			return client.sendMessage(from, { contacts: { displayName: name, contacts: [{ vcard }] }, mentions : mek ? mek : []},{ quoted: quoted })
		}
		
		const buttonsDefault = [
			{ callButton: {displayText: `Call Owner`, phoneNumber: `+6285770269605`} },
            { urlButton: { displayText: `Script Bot`, url : `https://github.com/FebbAdityaN/termux-wabotmd`} },
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
		
		switch(command) {
			case prefix+'test':
				reply('Test, sukses respon!')
				break
			case prefix+'donate':
			case prefix+'donasi':
				reply(`──「 MENU DONATE 」──\n\nHi ${pushname} 👋🏻\n\`\`\`GOPAY/DANA : 085770269605 (Customer)\`\`\`\n\`\`\`PULSA : 0895382331666 (Tri/3)\`\`\`\nTerimakasih untuk kamu yang sudah donasi untuk perkembangan bot ini _^\n──「 THX FOR YOU ! 」──`)
				break
			case prefix+'owner':
				for (let x of ownerNumber) {
					sendContact(from, x.split('@s.whatsapp.net')[0], 'Owner', msg)
				}
				break
			case prefix+'menu':
			case prefix+'help':
				buttonWithText(from, `Heyyyoooo *${pushname}* 🐨\n\nBot ini masih tahap uji coba, tunggu beberapa hari kedepan ya _^`, `WhatsApp Bot © 2020`, buttonsDefault)
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