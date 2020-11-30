require('dotenv').config()

const { Client } = require('discord.js')
const moment = require('moment-timezone')
const client = new Client()

const TOKYO = 'Asia/Tokyo'
const FORMAT = 'YYYY/MM/DD HH:mm:ss(z)'

const NOTIFY_CHANNEL_NAME = process.env.NOTIFY_CHANNEL || 'channel'

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
  
  let channel = client.channels.cache.filter(v=>v.type == 'text' && v.name == NOTIFY_CHANNEL_NAME).first()
  if(!channel) return
  channel.send(client.user.tag + ": " + (process.env.MY_SERVER_NAME || 'running on program'))
})


client.on('voiceStateUpdate', (oldState,newState)=>{

  let user = newState.member.user
  let message = ''
  if(oldState.channel && !newState.channel){
    message = `${moment().tz(TOKYO).format(FORMAT)}\n<@${user.id}> left from ${unescape('%uD83D%uDD0A')}<#${oldState.channel.id}>.`
  }
  if(!oldState.channel && newState.channel){
    message = `${moment().tz(TOKYO).format(FORMAT)}\n<@${user.id}> joined to ${unescape('%uD83D%uDD0A')}<#${newState.channel.id}>.`
  }
  if(oldState.channel && newState.channel){
    if(oldState.channel.id == newState.channel.id){
      return
    }else{
      message = `${moment().tz(TOKYO).format(FORMAT)}\n<@${user.id}> moved from ${unescape('%uD83D%uDD0A')}<#${oldState.channel.id}> to ${unescape('%uD83D%uDD0A')}<#${newState.channel.id}>.`
    }
  }
  let channel = newState.client.channels.cache.filter(v=>v.type == 'text' && v.name == NOTIFY_CHANNEL_NAME).first()
  if(!channel) return
  channel.send(message)
})

client.on('message', async msg => {
  if(msg.author.username == client.user.username) return
  if (-1 == msg.content.indexOf(process.env.FIND_TEXT)) return
  msg.reply(process.env.RES_TEXT)
})

client.login(process.env.DISCORD_TOKEN)
