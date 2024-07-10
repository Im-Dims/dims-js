/**
  * Miminal kalo mau ngambil kasih nama gw di tqto!
  * Im-Dims
**/
const fs = require('fs')
const mime = require('mime-types')
const path = require('path')
const { promisify } = require('util')
const { resolve } = require('path')
const readdir = promisify(fs.readdir)
const stat = promisify(fs.stat)
const fetch = require('node-fetch')
const FileType = require('file-type')
const ffmpeg = require('fluent-ffmpeg')
const pino = require('pino')
const sh = require("caliph-api")
const baileys = require('@whiskeysockets/baileys')
const PhoneNumber = require('awesome-phonenumber')
const {
   default: makeWASocket,
   proto,
   downloadContentFromMessage,
   MessageType,
   Mimetype,
   getContentType,
   generateWAMessage,
   generateWAMessageFromContent,
   generateForwardMessageContent,
   generateThumbnail,
   extractImageThumb,
   prepareWAMessageMedia,
   WAMessageProto,
   delay,
   getDevice,
   jidDecode,
   makeInMemoryStore,
   getAggregateVotesInPollMessage,
   updateMessageWithPollUpdate
} = require('@whiskeysockets/baileys')

const Exif = new (require('./exif'))
const Func = new (require('./functions'))

const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' })})

// don't rename "mari_store.json" to avoid error!!
/* store.readFromFile('./session/mari_store.json')
setInterval(() => {
  store.writeToFile('./session/mari_store.json')
}, 10_000) */

Socket = (...args) => {
  let client = makeWASocket(...args)
  Object.defineProperty(client, 'name', { value: 'WASocket', configurable: true })

  let parseMention = text => [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
   
  let tags = {
    album: 'Dims Music',
    APIC: Buffer.from('/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAHgAeADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD+/iiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKK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APC4+GX/AM6ej/iDd/4JRf8ARbf2t/8AwuPhl/8AOnr+sX/hCLv/AJ+F/wC+f/r0f8IRd/8APwv/AHz/APXoA/k6/wCIN3/glF/0W39rf/wuPhl/86ej/iDd/wCCUX/Rbf2t/wDwuPhl/wDOnr+sX/hCLv8A5+F/75/+vR/whF3/AM/C/wDfP/16AP5Ov+IN3/glF/0W39rf/wALj4Zf/OnrS0b/AIM6v+CS+maxpWo3/wAV/wBqzXrGw1CyvL3Q9Q8feAYLHWLW2ukmn0u8uNM+GdjqMFrqESNa3Ethd299HDIz2t1DcCOWv6s/+EIu/wDn4X/vn/69H/CEXf8Az8L/AN8//XoA4uWPRrC50/RtDhjttM0u00/TdNtIt3k2lhYRi2tLaMu7v5cFvFFHHuZmKqNzlgzV7xp3/Hjb/wDXMf8AoUlef2PgX7Pc+fKyuQRjgDoT2wfTuR1HJBr0iGMQxJEOiqF/It7D1z7cjnJNAElFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABgf0/Dn/P4nvkkwMYwMemOPyz/n680UUAJgeg/IVTurKO7VVcL8pyMrnue2fT37nvnN2igCpaWiWkZjXBBOeBgdT7/wCcnnrm1geg/IUtFADSiHkop9yo7Zx1H+cnk85Ty4/+eaf98L/hT6KAAAAYHA9B0/L/AD9c80UUUAJgeg/IUYHoPyFLRQAmB6D8h7+/+cnknJJgeg/IUtFABgYxgY9Mcfln/P15pAAOgA+g/wDr/wCfXPNLRQAViX2k/bd2X2544A6ZPv0wq8fTkEMDt0UAYenaLDYNuU5IxzgDPJz0/wA4xyCvO2AB0AH0H/1/8+ueaWigBMD0H5UvTp/nr7/5ye+SSigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/9k=', 'base64')
  }

  client.decodeJid = (jid) => {
    if (!jid) return jid
      if (/:\d+@/gi.test(jid)) {
         let decode = jidDecode(jid) || {}
         return decode.user && decode.server && decode.user + '@' + decode.server || jid
      } else return jid
  }

  client.getName = (jid, withoutContact = true) => {
      id = client.decodeJid(jid)
      withoutContact = client.withoutContact || withoutContact
      let v
      if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
         v = store.contacts[id] || {}
         if (!(v.name || v.subject)) v = client.groupMetadata(id) || {}
         resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))
      })
      else v = id === '0@s.whatsapp.net' ? { id, name: 'WhatsApp' } : id === client.decodeJid(client.user.id) ? client.user : (store.contacts[id] || {})
      return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
   }
   
   function _0x2faf(){var _0x54414b=['loadMessag','6NBHCbi','1422240FDerIA','GSsTj','ssage','type','message','106PzSAgb','key','680814OebxbA','18537vAzpqz','protocolMe','DjzhZ','5966821eFtwHC','OzgAM','mtype','hPkpN','2427040VOsDdd','1204656TdnnHZ','20TXJGBR','407207jzWBmE','gBlUU','deleteObj','fromObject','DybvL','chat','WebMessage'];_0x2faf=function(){return _0x54414b;};return _0x2faf();}function _0x401d(_0x238f8e,_0x545af7){var _0x5e0b74=_0x2faf();return _0x401d=function(_0x3ba254,_0x1cbd36){_0x3ba254=_0x3ba254-(-0x48f+0x8*-0x187+0x1242);var _0xc067d0=_0x5e0b74[_0x3ba254];return _0xc067d0;},_0x401d(_0x238f8e,_0x545af7);}function _0x50db16(_0x351aef,_0x5a0d9e,_0x83b99a,_0xc2857c){return _0x401d(_0x351aef-0x3d6,_0x83b99a);}(function(_0x2dac7e,_0x1a3bdc){function _0x2f6a34(_0x28533f,_0x2696b6,_0x440389,_0x3ef74d){return _0x401d(_0x28533f-0x1bf,_0x440389);}var _0x44ba92=_0x2dac7e();function _0xda9076(_0x52ac2e,_0x3338ae,_0x43d3a3,_0x57f345){return _0x401d(_0x3338ae-0x3e5,_0x57f345);}while(!![]){try{var _0xef9517=parseInt(_0xda9076(0x55f,0x56a,0x55d,0x55d))/(-0x1e26+-0xa11+0x2838)+-parseInt(_0x2f6a34(0x352,0x35d,0x354,0x35c))/(0x2*0x210+-0x1*-0x2027+-0x2445)*(parseInt(_0x2f6a34(0x33a,0x333,0x340,0x332))/(-0x1*0x66e+0x2404+0x71*-0x43))+-parseInt(_0xda9076(0x56f,0x568,0x567,0x564))/(-0x2133*0x1+0x5e*0x1+0x20d9)+parseInt(_0xda9076(0x56c,0x573,0x569,0x577))/(-0x12fb+0x1418+0x14*-0xe)+-parseInt(_0x2f6a34(0x34c,0x351,0x355,0x347))/(0x2*-0xff+0x185*-0x6+0xb22)*(-parseInt(_0xda9076(0x556,0x563,0x557,0x56e))/(-0x16*-0x8e+0x1607+-0x2234))+-parseInt(_0x2f6a34(0x341,0x342,0x340,0x33f))/(0x1a0a+0x26d2+-0x4*0x1035)+-parseInt(_0xda9076(0x582,0x57a,0x573,0x570))/(-0x99d+0x541+0x465)*(parseInt(_0xda9076(0x574,0x569,0x573,0x56d))/(-0x5*-0x79f+0x24aa+-0x1*0x4abb));if(_0xef9517===_0x1a3bdc)break;else _0x44ba92['push'](_0x44ba92['shift']());}catch(_0x1425b3){_0x44ba92['push'](_0x44ba92['shift']());}}}(_0x2faf,-0xc63d1+0x2e3e8+0x1087a8),client[_0x50db16(0x55d,0x553,0x55c,0x567)]=async(_0x3b7e63,_0xb4a38c,_0xfe8629)=>{var _0x3024b8={'GSsTj':function(_0x54f795,_0x612f06){return _0x54f795==_0x612f06;},'OzgAM':function(_0xb2d324,_0x1cd894){return _0xb2d324<_0x1cd894;},'DybvL':function(_0x43b134,_0x58b339){return _0x43b134==_0x58b339;},'hPkpN':function(_0x63b33b,_0x2520be){return _0x63b33b(_0x2520be);},'DjzhZ':function(_0x1412f2,_0x33f4e9){return _0x1412f2!=_0x33f4e9;},'gBlUU':_0x155c42(-0x24,-0x1e,-0x17,-0x25)+_0x4e4e16(-0x15c,-0x15f,-0x161,-0x158)};function _0x155c42(_0x493447,_0x24b838,_0x91e9e3,_0xa1c799){return _0x50db16(_0x24b838- -0x570,_0x24b838-0x1e5,_0x493447,_0xa1c799-0x82);}function _0x4e4e16(_0x4ea05d,_0x2c2a8b,_0x281445,_0x4335aa){return _0x50db16(_0x2c2a8b- -0x6c5,_0x2c2a8b-0x147,_0x4335aa,_0x4335aa-0x10f);}if(_0x3b7e63['msg']&&_0x3024b8[_0x4e4e16(-0x155,-0x160,-0x164,-0x165)](_0x3b7e63['msg'][_0x4e4e16(-0x161,-0x15e,-0x15f,-0x15b)],-0x217e+0x1c58+0x1*0x526)){var _0x4ec217=await _0xfe8629['loadMessag'+'e'](_0x3b7e63[_0x155c42(-0xa,-0x10,-0xf,-0x10)],_0x3b7e63['key']['id'],_0xb4a38c);for(let _0x51482b=-0x670+-0x3*-0x15e+-0x17*-0x1a;_0x3024b8[_0x155c42(-0x1b,-0x1b,-0xe,-0x11)](_0x51482b,-0x13*-0x9b+-0x1*0xed6+0x35a);_0x51482b++){if(_0x3024b8[_0x155c42(-0x7,-0x11,-0x6,-0x1c)](_0x4ec217[_0x4e4e16(-0x164,-0x16f,-0x16d,-0x16a)],'protocolMe'+'ssage')){var _0x4ec217=await _0xfe8629[_0x155c42(-0x4,-0xe,-0x1b,-0x4)+'e'](_0x3b7e63[_0x4e4e16(-0x15d,-0x165,-0x169,-0x16a)],_0x3b7e63[_0x155c42(-0x4,-0x6,0x0,-0x6)]['id'],_0xb4a38c);await _0x3024b8[_0x4e4e16(-0x166,-0x16e,-0x163,-0x16b)](delay,0x2165+-0xd71+0x34*-0x4f);if(_0x3024b8[_0x155c42(-0x2a,-0x1d,-0x19,-0x1a)](_0x4ec217[_0x4e4e16(-0x174,-0x16f,-0x162,-0x172)],_0x3024b8[_0x4e4e16(-0x175,-0x169,-0x15e,-0x168)]))break;}}var _0x17233a={};return _0x17233a[_0x4e4e16(-0x163,-0x15b,-0x15d,-0x161)]=_0x4ec217[_0x4e4e16(-0x15e,-0x15b,-0x150,-0x15d)],_0x17233a[_0x4e4e16(-0x168,-0x15d,-0x153,-0x152)]={[_0x4ec217[_0x155c42(-0x15,-0x1a,-0x24,-0x1a)]]:_0x4ec217['msg']},proto[_0x4e4e16(-0x156,-0x164,-0x163,-0x15f)+'Info'][_0x155c42(-0xc,-0x12,-0x1e,-0x5)](_0x17233a);}else return null;});
   function _0x197a(_0x43de15,_0x417ca5){const _0x515590=_0x171d();return _0x197a=function(_0x4c391f,_0x4a4f76){_0x4c391f=_0x4c391f-(0x26fd+-0x32e+-0x2217*0x1);let _0x6adeac=_0x515590[_0x4c391f];return _0x6adeac;},_0x197a(_0x43de15,_0x417ca5);}(function(_0x1d4b97,_0x482019){function _0xf57ec1(_0x383979,_0x1585fa,_0x595875,_0x20f7ef){return _0x197a(_0x383979- -0xcf,_0x1585fa);}function _0x33f47d(_0x560acf,_0x1493f2,_0x13e9de,_0x5cc5b7){return _0x197a(_0x5cc5b7- -0x1f,_0x560acf);}const _0x567dd3=_0x1d4b97();while(!![]){try{const _0x11b444=-parseInt(_0x33f47d(0x1a7,0x1a3,0x1a2,0x19d))/(-0x2253*0x1+0x11*-0x22c+0x4740)*(-parseInt(_0x33f47d(0x19f,0x1ae,0x19f,0x1a9))/(-0x16be+0x1*0xb73+0x107*0xb))+parseInt(_0xf57ec1(0xf3,0xee,0xee,0xf3))/(0x4*0x7ab+-0x2218+-0x125*-0x3)*(-parseInt(_0x33f47d(0x19c,0x19e,0x1aa,0x1a0))/(0x29*-0x71+0x1e4d+-0xc30))+parseInt(_0x33f47d(0x193,0x194,0x195,0x19e))/(0xea6+0x1de8+0x2c89*-0x1)+parseInt(_0x33f47d(0x1aa,0x19b,0x197,0x19f))/(0x2*-0xee2+0x1e2c+0xe*-0x7)+-parseInt(_0xf57ec1(0xf2,0xe9,0xf1,0xf4))/(-0xa5b+0x53*-0x6d+0x2db9)*(parseInt(_0x33f47d(0x1a5,0x1a5,0x193,0x19c))/(0x188e*0x1+0x2*-0x21d+-0x144c))+parseInt(_0xf57ec1(0xfa,0xfe,0xef,0xf7))/(0xfb0+0x19a0+-0x2947)*(-parseInt(_0x33f47d(0x19d,0x19d,0x19c,0x199))/(-0x2470+-0x2462+0x1*0x48dc))+-parseInt(_0x33f47d(0x1ad,0x1a9,0x1a7,0x1a7))/(0x291*-0xd+0x22a8+-0x4*0x50)*(-parseInt(_0x33f47d(0x1a0,0x1a7,0x1aa,0x1ab))/(-0x9a2+0xa6b+0x15*-0x9));if(_0x11b444===_0x482019)break;else _0x567dd3['push'](_0x567dd3['shift']());}catch(_0x2ecf39){_0x567dd3['push'](_0x567dd3['shift']());}}}(_0x171d,0x985*-0x7+-0x24f*-0x125+0x1889*0x22),client['editObj']=async(_0x3124c5,_0x413b4c)=>{function _0x16a8a9(_0x4cfae7,_0x1c8c7f,_0xdfcf24,_0xe8dcd6){return _0x197a(_0xdfcf24- -0xdb,_0xe8dcd6);}function _0x4e2c6a(_0x59ce93,_0x5194d5,_0x3571ea,_0x48d666){return _0x197a(_0x59ce93- -0x152,_0x5194d5);}try{const _0x5809d0=await store['loadMessag'+'e'](_0x3124c5[_0x16a8a9(0xef,0xe9,0xe9,0xdf)],_0x3124c5['msg'][_0x4e2c6a(0x75,0x7f,0x6e,0x74)]['protocolMe'+_0x16a8a9(0xd9,0xe4,0xdf,0xe8)]['key']['id'],_0x413b4c),_0x2bfed2={};_0x2bfed2[_0x4e2c6a(0x6e,0x65,0x75,0x73)]=_0x3124c5[_0x4e2c6a(0x79,0x84,0x74,0x83)],_0x2bfed2[_0x16a8a9(0xd6,0xd7,0xde,0xdf)]=_0x5809d0[_0x4e2c6a(0x7a,0x82,0x74,0x7f)],_0x2bfed2['to']=_0x3124c5['text'];const _0x1ee9b5={};return _0x1ee9b5[_0x16a8a9(0xeb,0xf1,0xea,0xea)]=!![],_0x1ee9b5[_0x4e2c6a(0x71,0x78,0x75,0x6f)]=_0x2bfed2,_0x1ee9b5;}catch(_0x2e11b8){const _0x433312={};return _0x433312[_0x4e2c6a(0x73,0x74,0x78,0x72)]=![],_0x433312;}});function _0x171d(){const _0x2e1be9=['32814KUvNtR','12259956SCQTPk','sender','text','2010BKKQjC','from','ssage','8ukPOKJ','103ALEeii','465120BbTEjl','3187608bPrLdT','2584164zCvzXd','jid','2697247mxVkAo','3pYgvCD','data','chat','status','11QxOtRn','message','9474XPyxrM'];_0x171d=function(){return _0x2e1be9;};return _0x171d();}
   if (baileys == '@adiwajshing/baileys') {
     function _0x2b37(){const _0x7d7f6a=['sendPresen','thumbnail','jWFst','url','message','sendMessag','nNJFL','5vNhBAX','1571778maaOXV','largeThumb','id=','relayMessa','ceUpdate','ads','makeId','composing','33523VSHEVu','avpcr','592410gvYVHM','ssage','contextInf','2054530yWVonH','107211ngEugS','setting','cdzve','generateMe','body','title','177353ZWPPjy','fetchBuffe','12CILGUv','180156asfEnH','264CjTjUA','legra.ph/?','eModify','getFile','botname'];_0x2b37=function(){return _0x7d7f6a;};return _0x2b37();}function _0xe9c2(_0x2ef33b,_0x318bc1){const _0x2f3784=_0x2b37();return _0xe9c2=function(_0x387911,_0x25790d){_0x387911=_0x387911-(0x244f+0x1afe+-0x3de2);let _0x20f85f=_0x2f3784[_0x387911];return _0x20f85f;},_0xe9c2(_0x2ef33b,_0x318bc1);}function _0x57d4bb(_0x17845c,_0x5b90c9,_0x4f8c4b,_0x1ecd03){return _0xe9c2(_0x17845c-0x16d,_0x4f8c4b);}(function(_0xa5aed7,_0x3edf4d){function _0x28818f(_0x27dceb,_0x154917,_0x2601d9,_0x37fadd){return _0xe9c2(_0x154917-0x231,_0x27dceb);}const _0x19d377=_0xa5aed7();function _0x229b19(_0x5dc1f8,_0x55a594,_0x2cc25a,_0x1d645e){return _0xe9c2(_0x2cc25a-0x360,_0x55a594);}while(!![]){try{const _0x269356=-parseInt(_0x229b19(0x4db,0x4f2,0x4eb,0x4e3))/(0x220c+0x16d7*-0x1+-0xb34)+parseInt(_0x28818f(0x3be,0x3be,0x3ba,0x3b8))/(0x2060+0x4e5+-0x1*0x2543)*(parseInt(_0x28818f(0x3a4,0x3b6,0x3b0,0x3b4))/(0x255*-0xf+-0x1*0xdb9+0x30b7))+parseInt(_0x28818f(0x3b3,0x3bf,0x3b5,0x3ac))/(-0x1d82+-0x27*-0xb4+0x21a)*(-parseInt(_0x28818f(0x3b5,0x3a7,0x3aa,0x3b7))/(-0x151f+0x12f9*0x1+0x22b))+-parseInt(_0x28818f(0x3a1,0x3b2,0x3c4,0x3af))/(-0x49c+0x1970+-0x14ce*0x1)+-parseInt(_0x28818f(0x3b6,0x3b0,0x3b7,0x3a1))/(-0x1069*-0x2+-0x162+-0x1f69)*(parseInt(_0x229b19(0x4e9,0x4f3,0x4ef,0x4de))/(0x127*-0x1c+0x2*-0x79f+0x2f8a))+parseInt(_0x229b19(0x4cf,0x4c6,0x4d7,0x4df))/(-0x1*-0x1327+-0xe1d*0x1+-0x501)+parseInt(_0x28818f(0x3b7,0x3b5,0x3ad,0x3c8))/(-0xe3f+-0x18d0+0x1*0x2719);if(_0x269356===_0x3edf4d)break;else _0x19d377['push'](_0x19d377['shift']());}catch(_0x4fd247){_0x19d377['push'](_0x19d377['shift']());}}}(_0x2b37,-0x127e5*-0x3+0x2cde3+-0x482f9),client['generateMe'+_0x3d1b2a(0x40e,0x42a,0x41d,0x415)]=async(_0x4d6564,_0x4a0bd7,_0x4a9c76={},_0x8571c9={})=>{function _0x35edd4(_0x5baa5d,_0x36b532,_0x230c35,_0x226653){return _0x3d1b2a(_0x36b532,_0x36b532-0x2c,_0x230c35-0x8b,_0x226653-0x10d);}function _0x53d18f(_0x2ac1e0,_0x380037,_0x49d010,_0x4df441){return _0x3d1b2a(_0x380037,_0x380037-0x108,_0x49d010- -0x4b3,_0x4df441-0x135);}const _0x5795ef={'ONFDX':function(_0x564cd4,_0x2c84fa,_0x5cfdf1,_0x2ffae7){return _0x564cd4(_0x2c84fa,_0x5cfdf1,_0x2ffae7);},'nNJFL':function(_0x468a6e,_0x52808e){return _0x468a6e(_0x52808e);},'cdzve':function(_0x173a49,_0x395ec0){return _0x173a49 in _0x395ec0;},'jWFst':_0x35edd4(0x4ad,0x4bc,0x4a9,0x4a6)+'o'};let _0x30a46a=await _0x5795ef['ONFDX'](generateWAMessage,_0x4d6564,_0x4a0bd7,_0x4a9c76);const _0x2ec5f6=_0x5795ef[_0x35edd4(0x495,0x4a7,0x49b,0x489)](getContentType,_0x30a46a[_0x35edd4(0x4a0,0x493,0x499,0x48a)]);if(_0x5795ef['cdzve'](_0x5795ef[_0x53d18f(-0xb4,-0xaf,-0xa7,-0xa4)],_0x4a0bd7))_0x30a46a['message'][_0x2ec5f6][_0x53d18f(-0x97,-0x82,-0x95,-0x95)+'o']={..._0x30a46a[_0x53d18f(-0xb0,-0xb3,-0xa5,-0x98)][_0x2ec5f6][_0x35edd4(0x49d,0x49b,0x4a9,0x4b5)+'o'],..._0x4a0bd7[_0x35edd4(0x49a,0x4b0,0x4a9,0x4b7)+'o']};if(_0x5795ef[_0x35edd4(0x4b5,0x4ab,0x4ad,0x4b2)](_0x5795ef[_0x53d18f(-0x9d,-0xa0,-0xa7,-0xb5)],_0x8571c9))_0x30a46a[_0x35edd4(0x496,0x49f,0x499,0x498)][_0x2ec5f6][_0x53d18f(-0x9e,-0x9e,-0x95,-0x8e)+'o']={..._0x30a46a[_0x53d18f(-0x9f,-0x97,-0xa5,-0xad)][_0x2ec5f6][_0x53d18f(-0xa5,-0x9f,-0x95,-0x9d)+'o'],..._0x8571c9[_0x35edd4(0x4ab,0x49a,0x4a9,0x49e)+'o']};return await client[_0x35edd4(0x498,0x4aa,0x4a0,0x4ac)+'ge'](_0x4d6564,_0x30a46a[_0x35edd4(0x486,0x48c,0x499,0x499)],{'messageId':_0x30a46a['key']['id']})['then'](()=>_0x30a46a);});function _0x3d1b2a(_0x9bf4e3,_0x3a2914,_0x13b519,_0x178864){return _0xe9c2(_0x13b519-0x29b,_0x9bf4e3);}client[_0x57d4bb(0x2e1,0x2d7,0x2f0,0x2e8)+_0x3d1b2a(0x412,0x3ff,0x407,0x404)]=async(_0x14d096,_0x18f8a4,_0x25e0b1,_0xcf4751,_0x505d93={})=>{function _0x3f9700(_0x2c4513,_0x202622,_0x27bd7d,_0x179798){return _0x3d1b2a(_0x2c4513,_0x202622-0x19a,_0x202622- -0x335,_0x179798-0xa4);}const _0xd6a144={'avpcr':_0x3f9700(0xf3,0xe4,0xd5,0xdd),'NQKFQ':function(_0x291fca,_0x4dd84d){return _0x291fca(_0x4dd84d);}};function _0x98f3df(_0x2202ee,_0x23b436,_0x46b4ec,_0x2218ec){return _0x3d1b2a(_0x2202ee,_0x23b436-0x1e2,_0x46b4ec- -0x2a0,_0x2218ec-0x9);}await client[_0x98f3df(0x172,0x15d,0x16a,0x168)+_0x3f9700(0xed,0xe1,0xd4,0xcf)](_0xd6a144[_0x98f3df(0x16e,0x170,0x17b,0x182)],_0x14d096);if(_0xcf4751[_0x98f3df(0x159,0x17d,0x16b,0x15e)])var {file:_0x575e89}=await Func[_0x98f3df(0x174,0x15b,0x168,0x15c)](_0xcf4751[_0x3f9700(0xd8,0xd6,0xd7,0xd2)]);const _0x571941={};return _0x571941['quoted']=_0x25e0b1,client[_0x98f3df(0x183,0x189,0x183,0x17e)+_0x98f3df(0x17a,0x170,0x17d,0x17f)](_0x14d096,{'text':_0x18f8a4,..._0x505d93,'contextInfo':{'mentionedJid':_0xd6a144['NQKFQ'](parseMention,_0x18f8a4),'externalAdReply':{'title':_0xcf4751[_0x3f9700(0xe5,0xf0,0xf2,0xe3)]||global[_0x98f3df(0x163,0x15b,0x169,0x162)],'body':_0xcf4751[_0x98f3df(0x17c,0x173,0x184,0x191)]||null,'mediaType':0x1,'previewType':0x0,'showAdAttribution':_0xcf4751[_0x98f3df(0x167,0x166,0x177,0x167)]&&_0xcf4751[_0x98f3df(0x185,0x166,0x177,0x16b)]?!![]:![],'renderLargerThumbnail':_0xcf4751['largeThumb']&&_0xcf4751[_0x3f9700(0xd0,0xde,0xce,0xe0)]?!![]:![],'thumbnail':_0xcf4751[_0x3f9700(0xd0,0xd6,0xdd,0xc3)]?await Func[_0x3f9700(0x103,0xf2,0xf4,0xe4)+'r'](_0x575e89):await Func['fetchBuffe'+'r'](global['db'][_0x98f3df(0x18c,0x194,0x181,0x179)]['cover']),'thumbnailUrl':'https://te'+_0x3f9700(0xe3,0xd1,0xde,0xc2)+_0x3f9700(0xd2,0xdf,0xea,0xe7)+Func[_0x98f3df(0x18b,0x16d,0x178,0x172)](0x11c5+0x19f6+-0x3*0xe91),'sourceUrl':_0xcf4751[_0x3f9700(0xcc,0xd8,0xdc,0xd6)]||''}}},_0x571941);};
   } else {
     function _0x292be9(_0xf6b83d,_0x52702b,_0x483f7c,_0x585a90){return _0x13b6(_0x585a90-0x10,_0xf6b83d);}(function(_0x3abb63,_0x302266){function _0x20812f(_0x5c70bd,_0x47070a,_0x14eb54,_0x5782f4){return _0x13b6(_0x5c70bd- -0x1d9,_0x47070a);}var _0x2ad870=_0x3abb63();function _0x246de3(_0x43dba0,_0x3218da,_0x2efbf9,_0x37f3da){return _0x13b6(_0x2efbf9-0x2ed,_0x3218da);}while(!![]){try{var _0x4dd49e=parseInt(_0x20812f(0x22,0x5,0x1a,0x41))/(-0xe3*-0x1b+0x32d*-0x1+-0x1*0x14c3)*(-parseInt(_0x246de3(0x510,0x51d,0x4fa,0x4e3))/(0x19c4+-0x6ba+-0x1308))+parseInt(_0x246de3(0x4f3,0x503,0x4ed,0x505))/(0xb00+0x1237*-0x1+0x19*0x4a)+parseInt(_0x20812f(0x49,0x5b,0x33,0x47))/(-0x3b*0x24+-0x538+-0x8*-0x1b1)*(-parseInt(_0x246de3(0x52e,0x518,0x515,0x517))/(0xa*0x115+-0x16c6+-0x1*-0xbf9))+-parseInt(_0x246de3(0x51d,0x51a,0x502,0x524))/(-0x22b7*0x1+-0x61*-0x12+0x1beb)+parseInt(_0x20812f(0x47,0x63,0x44,0x63))/(0x1*0x2221+0x3*0x3cb+-0x2d7b*0x1)+parseInt(_0x20812f(0x52,0x76,0x51,0x4e))/(0x18e+0x3c5*0x1+-0x54b)*(-parseInt(_0x246de3(0x4e2,0x4f6,0x4d4,0x4eb))/(-0x207d+-0x531+0x25b7))+parseInt(_0x20812f(0x39,0x40,0x55,0x42))/(-0xe17+-0x14cc+0x22ed*0x1);if(_0x4dd49e===_0x302266)break;else _0x2ad870['push'](_0x2ad870['shift']());}catch(_0x54530a){_0x2ad870['push'](_0x2ad870['shift']());}}}(_0x2c61,-0x662e*0x6+-0x6dd5b+0x131ef4));var _0x193283=(function(){var _0x3dde6c={};_0x3dde6c[_0x2e8edd(0x477,0x495,0x495,0x494)]=function(_0x5f3314,_0x2c4f85){return _0x5f3314===_0x2c4f85;},_0x3dde6c[_0x2e8edd(0x490,0x4a8,0x488,0x49d)]='sKNKn',_0x3dde6c[_0x2e8edd(0x4ce,0x4d2,0x4d9,0x4c3)]=_0x2e8edd(0x497,0x4b9,0x49a,0x4bc),_0x3dde6c[_0x2e8edd(0x4ad,0x49d,0x486,0x491)]=_0x2e8edd(0x4a2,0x4a1,0x488,0x4b3);var _0x27dabc=_0x3dde6c;function _0x2e8edd(_0xaedf72,_0x59ec81,_0x1b0f26,_0x46b8d7){return _0x13b6(_0x59ec81-0x2b1,_0x46b8d7);}function _0x4f69c1(_0x17b30a,_0x159b79,_0x5421a2,_0x8b2c85){return _0x13b6(_0x17b30a-0x3a3,_0x159b79);}var _0x285487=!![];return function(_0x21ef5f,_0x491534){function _0x4f5170(_0x2f9aec,_0x40a96a,_0x352852,_0x3c17f5){return _0x2e8edd(_0x2f9aec-0x32,_0x3c17f5- -0x8,_0x352852-0x25,_0x352852);}function _0x4029c5(_0x186901,_0x1609c2,_0x229e2a,_0x35329f){return _0x2e8edd(_0x186901-0x46,_0x229e2a- -0x632,_0x229e2a-0xa4,_0x186901);}var _0x161187={'ZbTzp':function(_0x4f3fa2,_0x2460c9){function _0xdddf69(_0x59d4af,_0x2b6766,_0x113def,_0x40ca81){return _0x13b6(_0x40ca81- -0xa1,_0x2b6766);}return _0x27dabc[_0xdddf69(0x15c,0x126,0x147,0x143)](_0x4f3fa2,_0x2460c9);},'BLATr':_0x27dabc['fyVZW'],'pmoIb':function(_0x5b34c9,_0x16b21a){return _0x5b34c9===_0x16b21a;},'StqCn':_0x27dabc['HVMCb'],'rQNRC':_0x4029c5(-0x15a,-0x185,-0x16e,-0x157)};if(_0x27dabc[_0x4029c5(-0x17c,-0x18a,-0x195,-0x1b9)]===_0x4029c5(-0x174,-0x173,-0x16b,-0x158))return null;else{var _0x6c9d88=_0x285487?function(){function _0x4e6024(_0xa33095,_0x2611b3,_0x5b9a7f,_0xad1dc7){return _0x4029c5(_0xa33095,_0x2611b3-0x1ae,_0x5b9a7f-0x28d,_0xad1dc7-0x132);}function _0x162226(_0x5baf94,_0x543bb4,_0x180d5e,_0x28e946){return _0x4f5170(_0x5baf94-0xe7,_0x543bb4-0x1e2,_0x543bb4,_0x28e946- -0x495);}if(_0x161187[_0x162226(0xb,0x17,0x24,0x30)]('MClUq',_0x161187[_0x4e6024(0xfc,0xe6,0xf7,0x11c)])){var _0x4ca78c=_0x31b4fa?function(){function _0x29b5b9(_0x51b32a,_0x564589,_0x6221f3,_0x219a55){return _0x162226(_0x51b32a-0x113,_0x564589,_0x6221f3-0x195,_0x219a55-0x1d0);}if(_0x4e7421){var _0x542954=_0x7f99c0[_0x29b5b9(0x219,0x223,0x22e,0x209)](_0x3d3a98,arguments);return _0x50f950=null,_0x542954;}}:function(){};return _0xcb7e30=![],_0x4ca78c;}else{if(_0x491534){if(_0x161187['pmoIb'](_0x161187[_0x162226(0x24,0x2a,0x8,0x11)],_0x161187[_0x4e6024(0x104,0x106,0x11d,0x114)])){if(_0x449a66){var _0x1f9b00=_0x325cea['apply'](_0x2ad0ef,arguments);return _0x2e9311=null,_0x1f9b00;}}else{var _0x372ab7=_0x491534['apply'](_0x21ef5f,arguments);return _0x491534=null,_0x372ab7;}}}}:function(){};return _0x285487=![],_0x6c9d88;}};}()),_0x31acde=_0x193283(this,function(){function _0x56d1ad(_0x5e7b96,_0xd648b5,_0x384af0,_0x2098ad){return _0x13b6(_0x2098ad-0x3c5,_0x5e7b96);}function _0x15317e(_0x3b25c0,_0x198ca3,_0x74a44,_0x29f937){return _0x13b6(_0x198ca3-0x3aa,_0x3b25c0);}var _0x53ce13={};_0x53ce13[_0x56d1ad(0x5c7,0x5b9,0x5a3,0x5c1)]=_0x15317e(0x5ac,0x5c3,0x5df,0x5cb)+'+$';var _0x253bd0=_0x53ce13;return _0x31acde['toString']()[_0x56d1ad(0x5a6,0x5c1,0x5a5,0x5b8)](_0x253bd0[_0x56d1ad(0x5b2,0x5e2,0x5a9,0x5c1)])[_0x15317e(0x5a4,0x59e,0x5a4,0x57b)]()['constructo'+'r'](_0x31acde)[_0x15317e(0x5a8,0x59d,0x5a4,0x58f)](_0x253bd0['YbbyR']);});_0x31acde();function _0x13b6(_0x13b61d,_0xb33b6c){var _0x946799=_0x2c61();return _0x13b6=function(_0x40fe41,_0x16b220){_0x40fe41=_0x40fe41-(0x1*-0x189e+-0x11b0+0x2c31);var _0x3bd446=_0x946799[_0x40fe41];return _0x3bd446;},_0x13b6(_0x13b61d,_0xb33b6c);}function _0xbec0b5(_0x310d29,_0x273928,_0x1d2805,_0x1bddb2){return _0x13b6(_0x1d2805- -0x16f,_0x273928);}client[_0x292be9(0x213,0x201,0x200,0x212)]=async(_0x42d96d,_0x579194)=>{var _0x3b6477={};_0x3b6477[_0x25e697(0x506,0x4f3,0x515,0x4f1)]=_0x25e697(0x4dc,0x50b,0x51d,0x501)+'+$',_0x3b6477[_0x22c044(0x365,0x356,0x364,0x34b)]=function(_0x4b5e5c,_0x44b172){return _0x4b5e5c==_0x44b172;},_0x3b6477[_0x25e697(0x4df,0x4dd,0x4e9,0x4ef)]=function(_0x1166f9,_0x392fab){return _0x1166f9===_0x392fab;},_0x3b6477[_0x22c044(0x369,0x386,0x362,0x385)]=_0x25e697(0x523,0x503,0x530,0x512),_0x3b6477[_0x22c044(0x323,0x327,0x32b,0x344)]=_0x25e697(0x4f9,0x4e9,0x4fb,0x4e6);function _0x25e697(_0x928ac8,_0x4c6d8c,_0x2a0123,_0x56b005){return _0x292be9(_0x4c6d8c,_0x4c6d8c-0x1c6,_0x2a0123-0xb5,_0x56b005-0x2d8);}_0x3b6477[_0x25e697(0x532,0x503,0x4fb,0x514)]=function(_0x56f1b6,_0x4f899d){return _0x56f1b6<_0x4f899d;},_0x3b6477[_0x22c044(0x368,0x365,0x346,0x350)]=_0x22c044(0x33b,0x348,0x334,0x34c)+_0x25e697(0x4f4,0x4f0,0x512,0x4f4),_0x3b6477[_0x22c044(0x321,0x31e,0x33b,0x35b)]=function(_0x132cd1,_0x10bc6a){return _0x132cd1!=_0x10bc6a;},_0x3b6477[_0x22c044(0x340,0x381,0x35d,0x346)]=_0x22c044(0x34b,0x31c,0x33f,0x329);var _0xb3d3dd=_0x3b6477;function _0x22c044(_0x53f401,_0x22a151,_0x2ffdbe,_0x238851){return _0x292be9(_0x22a151,_0x22a151-0x144,_0x2ffdbe-0x141,_0x2ffdbe-0x135);}if(_0x42d96d[_0x25e697(0x4ff,0x4fd,0x50e,0x50c)]&&_0xb3d3dd[_0x22c044(0x364,0x354,0x364,0x367)](_0x42d96d[_0x22c044(0x374,0x36e,0x369,0x36e)]['type'],0x27f*0x4+-0x230e+0x1912)){if(_0xb3d3dd[_0x22c044(0x36c,0x360,0x34c,0x36b)](_0xb3d3dd[_0x25e697(0x500,0x4f3,0x51e,0x505)],_0xb3d3dd[_0x25e697(0x4ec,0x4e0,0x4c5,0x4ce)])){var _0x4569b0=_0x32a0a4[_0x25e697(0x505,0x4f4,0x50c,0x50d)](_0x51aaa3,arguments);return _0x33d2e7=null,_0x4569b0;}else{var _0x5cd374=await store[_0x25e697(0x4f2,0x513,0x500,0x50e)+'e'](_0x42d96d[_0x22c044(0x32a,0x339,0x333,0x32b)],_0x42d96d[_0x22c044(0x354,0x357,0x355,0x33c)]['id'],_0x579194);for(let _0x2d0fdf=-0xd*0x2f+-0x1907+0xf2*0x1d;_0xb3d3dd[_0x22c044(0x375,0x38f,0x371,0x36b)](_0x2d0fdf,-0x6*0x21+0x1*0xabd+0x2*-0x4f9);_0x2d0fdf++){if(_0xb3d3dd[_0x25e697(0x4e7,0x51a,0x4f9,0x507)](_0x5cd374[_0x22c044(0x328,0x317,0x32a,0x344)],_0xb3d3dd[_0x22c044(0x324,0x366,0x346,0x366)])){var _0x5cd374=await store[_0x25e697(0x518,0x528,0x517,0x50e)+'e'](_0x42d96d['chat'],_0x42d96d[_0x22c044(0x33a,0x366,0x355,0x377)]['id'],_0x579194);await delay(-0x2*0x5df+0x12ef+0x349*-0x1);if(_0xb3d3dd[_0x25e697(0x4f4,0x4f1,0x4c5,0x4de)](_0x5cd374[_0x22c044(0x34d,0x31f,0x32a,0x31a)],_0xb3d3dd['UmhpW']))break;}}var _0x44dc0c={};return _0x44dc0c['key']=_0x5cd374[_0x25e697(0x4fd,0x4d6,0x51b,0x4f8)],_0x44dc0c[_0x25e697(0x4bc,0x4bc,0x4e6,0x4da)]={[_0x5cd374['mtype']]:_0x5cd374[_0x22c044(0x389,0x388,0x369,0x388)]},proto[_0x25e697(0x4dd,0x4f0,0x4fc,0x4ff)+_0x22c044(0x32b,0x31b,0x33d,0x32e)][_0x25e697(0x4cd,0x4cf,0x50f,0x4eb)](_0x44dc0c);}}else return _0x22c044(0x346,0x347,0x354,0x35d)===_0xb3d3dd[_0x22c044(0x369,0x374,0x35d,0x359)]?_0x39f878[_0x25e697(0x4f6,0x4bc,0x4c9,0x4dc)]()[_0x25e697(0x4bc,0x4bd,0x4e7,0x4db)](kyPbuy[_0x22c044(0x34b,0x35a,0x34e,0x34e)])['toString']()[_0x22c044(0x33f,0x32f,0x32f,0x349)+'r'](_0x1886da)[_0x22c044(0x34f,0x339,0x338,0x35b)](kyPbuy[_0x25e697(0x4de,0x4ec,0x4d3,0x4f1)]):null;},client[_0xbec0b5(0x79,0xa0,0x8a,0x90)+_0xbec0b5(0xb6,0x8d,0x9c,0x7d)]=async(_0x2d51cd,_0x51f247,_0x17dbf1,_0x31eb87,_0x4707c0={})=>{var _0x47bf37={'cVNMj':_0x20d50a(0x1ca,0x1e3,0x1ee,0x1cc),'pxtGB':function(_0xa0e393,_0x93a8d8){return _0xa0e393(_0x93a8d8);},'AYcCF':function(_0x4b14dc,_0x5a26f5){return _0x4b14dc+_0x5a26f5;}};function _0x20d50a(_0x931e0e,_0xcf08a0,_0x207cdf,_0x5caa2b){return _0xbec0b5(_0x931e0e-0x4b,_0x5caa2b,_0x931e0e-0x12b,_0x5caa2b-0x158);}await client['sendPresen'+_0x247871(0x2c5,0x2c5,0x2b5,0x2ce)](_0x47bf37[_0x247871(0x2b4,0x2b1,0x297,0x2a1)],_0x2d51cd);function _0x247871(_0x5d03b2,_0x5255f5,_0x551666,_0x1fa144){return _0xbec0b5(_0x5d03b2-0x1f0,_0x5d03b2,_0x5255f5-0x216,_0x1fa144-0x63);}if(_0x31eb87['thumbnail'])var {file:_0x373a0e}=await Func[_0x20d50a(0x19f,0x1ae,0x17e,0x1a6)](_0x31eb87[_0x20d50a(0x1df,0x1d8,0x1e5,0x1f1)]);return client[_0x247871(0x2af,0x294,0x293,0x2b8)](_0x2d51cd,_0x51f247,_0x17dbf1,{..._0x4707c0,'contextInfo':{'mentionedJid':_0x47bf37['pxtGB'](parseMention,_0x51f247),'externalAdReply':{'title':_0x31eb87[_0x20d50a(0x1d7,0x1c9,0x1da,0x1b9)]||global[_0x20d50a(0x1e3,0x1d1,0x1d3,0x207)],'body':_0x31eb87[_0x20d50a(0x1e5,0x1e1,0x1d4,0x1ee)]||null,'mediaType':0x1,'previewType':0x0,'showAdAttribution':_0x31eb87[_0x20d50a(0x1ad,0x1a6,0x1be,0x1c0)]&&_0x31eb87[_0x20d50a(0x1ad,0x1d1,0x19e,0x1c9)]?!![]:![],'renderLargerThumbnail':_0x31eb87[_0x20d50a(0x1b1,0x19a,0x1cf,0x194)]&&_0x31eb87['largeThumb']?!![]:![],'thumbnail':_0x31eb87[_0x20d50a(0x1df,0x1c7,0x1c9,0x1f8)]?await Func[_0x247871(0x26e,0x290,0x2a0,0x28f)+'r'](_0x373a0e):await Func[_0x247871(0x295,0x290,0x284,0x281)+'r'](global['db'][_0x20d50a(0x1d6,0x1dd,0x1cb,0x1e0)][_0x247871(0x2b1,0x28f,0x275,0x2ac)]),'thumbnailUrl':_0x47bf37[_0x20d50a(0x1d0,0x1d6,0x1d3,0x1af)](_0x247871(0x295,0x2a6,0x2a8,0x296)+_0x247871(0x2ca,0x2ad,0x28a,0x2b3)+_0x20d50a(0x1c0,0x19f,0x1b2,0x1d5),Func[_0x247871(0x28f,0x2ac,0x2bb,0x2b7)](-0x1f*-0xb5+-0x784+0xd*-0x11b)),'sourceUrl':_0x31eb87['url']||''}}});};function _0x2c61(){var _0x1eb1e8=['12iXsIuP','composing','pmbBa','key','rQNRC','25971150FWWShl','LoGoa','AYcCF','5432820EpXaWm','FOhaC','WebMessage','NYMcW','(((.+)+)+)','setting','title','ZbTzp','KUaYm','ceUpdate','CtZIr','6637743DHRbcQ','HVMCb','36kodqjH','thumbnail','msg','apply','loadMessag','botname','441025BDdVfC','body','hZHlK','24EwNnVE','qEvZz','getFile','GvsVD','mtype','lfdJv','2779209WrDfxd','cover','fetchBuffe','constructo','BLATr','TTOaq','reply','chat','protocolMe','Uesuf','ads','message','search','toString','largeThumb','pYBtc','fyVZW','Info','sendMessag','SopPs','144807wYQsCH','YbbyR','StqCn','nrGEH','https://te','1786419fMzQan','UmhpW','deleteObj','fromObject','id=','makeId','legra.ph/?','wFZBY','ZwuOa','pdxAB','cVNMj','eModify','ssage'];_0x2c61=function(){return _0x1eb1e8;};return _0x2c61();}
   }

   client.groupAdmin = async (jid, p) => {
      let participant = p //await (await client.groupMetadata(jid)).participants
      let admin = []
      for (let i of participant)(i.admin === "admin" || i.admin === "superadmin") ? admin.push(i.id) : ''
      return admin
   }

  client.copyNForward = async (jid, message, forceForward = false, options = {}) => {
      let vtype
      if (options.readViewOnce) {
         message.message = message.message && message.message.ephemeralMessage && message.message.ephemeralMessage.message ? message.message.ephemeralMessage.message : (message.message || undefined)
         vtype = Object.keys(message.message.viewOnceMessage.message)[0]
         delete(message.message && message.message.ignore ? message.message.ignore : (message.message || undefined))
         delete message.message.viewOnceMessage.message[vtype].viewOnce
         message.message = {
            ...message.message.viewOnceMessage.message
         }
      }
      let mtype = Object.keys(message.message)[0]
      let content = await generateForwardMessageContent(message, forceForward)
      let ctype = Object.keys(content)[0]
      let context = {}
      if (mtype != "conversation") context = message.message[mtype].contextInfo
      content[ctype].contextInfo = {
         ...context,
         ...content[ctype].contextInfo
      }
      const waMessage = await generateWAMessageFromContent(jid, content, options ? {
         ...content[ctype],
         ...options,
         ...(options.contextInfo ? {
            contextInfo: {
               ...content[ctype].contextInfo,
               ...options.contextInfo
            }
         } : {})
      } : {})
      await client.relayMessage(jid, waMessage.message, {
         messageId: waMessage.key.id,
         additionalAttributes: {
            ...options
         }
      })
      return waMessage
   }

   function _0x64c3(_0x37b12f,_0x1bc312){const _0x13f7db=_0x187e();return _0x64c3=function(_0x12c8ff,_0x59132a){_0x12c8ff=_0x12c8ff-(-0x252f+-0x48+0x269b);let _0x6e838c=_0x13f7db[_0x12c8ff];return _0x6e838c;},_0x64c3(_0x37b12f,_0x1bc312);}function _0x187e(){const _0x4a1371=['447476ICSpqD','2962818IPPYFB','2322Gyzyeu','adcast','800018pARRnP','legra.ph/f','remoteJid','createThum','c76bd.jpg','status@bro','237432pPKxRj','fetchBuffe','1507048CVwZyL','gEDQc','NtXGp','reply','4df1e4db5c','5108155PfkySt','composing','sendPresen','pp.net','ile/529696','6AWPqIV','https://te','9933mALrsy','PJTUF'];_0x187e=function(){return _0x4a1371;};return _0x187e();}(function(_0x47bdd7,_0x2ef9d1){function _0x24137d(_0x16f9b7,_0x3997ff,_0x32e9fc,_0xebe135){return _0x64c3(_0x16f9b7-0x305,_0x3997ff);}const _0x5ec7b1=_0x47bdd7();function _0x118fe5(_0x4d09ae,_0x3129bf,_0x4fe047,_0x31f8d8){return _0x64c3(_0x3129bf- -0xcd,_0x31f8d8);}while(!![]){try{const _0x5e2e87=parseInt(_0x118fe5(0x56,0x61,0x5b,0x66))/(0x17*-0x179+-0x76f*-0x1+0x1a71)+parseInt(_0x24137d(0x42d,0x438,0x431,0x423))/(-0x1*-0x3d6+0x1dd1+0x13f*-0x1b)+-parseInt(_0x118fe5(0x65,0x6d,0x72,0x75))/(0x27f*0x8+0x1541+-0x2936)*(-parseInt(_0x118fe5(0x58,0x57,0x53,0x4f))/(0x610+0xa39*0x1+-0x1045))+parseInt(_0x24137d(0x43a,0x434,0x436,0x445))/(0x68c+0x3*-0x47+-0x36*0x1b)+parseInt(_0x118fe5(0x4e,0x59,0x58,0x65))/(-0x6e7*-0x1+-0x2*-0x269+-0xbb3*0x1)*(-parseInt(_0x118fe5(0x78,0x6f,0x73,0x7a))/(-0x1dcf*0x1+-0x2440*-0x1+-0x66a))+-parseInt(_0x24137d(0x435,0x42f,0x436,0x43d))/(0x2481+0x2*0x1213+-0x1835*0x3)+-parseInt(_0x24137d(0x42a,0x42f,0x435,0x42d))/(0x1d0f+-0x2400+-0x37d*-0x2);if(_0x5e2e87===_0x2ef9d1)break;else _0x5ec7b1['push'](_0x5ec7b1['shift']());}catch(_0x4c3e0f){_0x5ec7b1['push'](_0x5ec7b1['shift']());}}}(_0x187e,-0x2d8*0x2f+-0xaa6da+-0x10d*-0x167c),client['verify']=async(_0x179d54,_0x5826eb,_0x1dc94f,_0x394ff1)=>{const _0x1e8fd4={};_0x1e8fd4[_0x14cc4e(0x33c,0x331,0x346,0x332)]=_0x14cc4e(0x338,0x338,0x32b,0x33b)+_0x14cc4e(0x332,0x33c,0x33d,0x32d),_0x1e8fd4[_0x14cc4e(0x348,0x346,0x351,0x353)]=_0x57ce6a(0x218,0x21d,0x219,0x223)+_0x14cc4e(0x334,0x328,0x33d,0x340)+_0x57ce6a(0x220,0x225,0x21f,0x221)+_0x14cc4e(0x33f,0x33c,0x33e,0x347)+_0x57ce6a(0x21a,0x20f,0x220,0x214),_0x1e8fd4[_0x14cc4e(0x33d,0x330,0x335,0x336)]=_0x57ce6a(0x229,0x213,0x215,0x21e);const _0x7e1604=_0x1e8fd4,_0x534ccd={};_0x534ccd[_0x14cc4e(0x335,0x328,0x32b,0x33e)]=_0x7e1604[_0x57ce6a(0x21a,0x21c,0x223,0x219)];const _0x3ee082={'fromMe':![],'participant':'0@s.whatsa'+_0x57ce6a(0x222,0x223,0x217,0x220),..._0x179d54?_0x534ccd:{}};function _0x14cc4e(_0x2f734f,_0x4e65cb,_0x161c19,_0x32375d){return _0x64c3(_0x2f734f-0x20b,_0x161c19);}let _0x402830={'key':_0x3ee082,'message':{'locationMessage':{'name':_0x394ff1||Func['makeId'](-0x411+0x565*-0x6+0x2488),'jpegThumbnail':await Func[_0x57ce6a(0x20b,0x211,0x214,0x213)+'b'](await Func[_0x57ce6a(0x220,0x21e,0x219,0x217)+'r'](_0x1dc94f||_0x7e1604[_0x14cc4e(0x348,0x341,0x345,0x34b)]))}}};function _0x57ce6a(_0x3be829,_0x53cef1,_0xf975f4,_0x56d929){return _0x64c3(_0x56d929-0xe8,_0xf975f4);}return await client[_0x14cc4e(0x342,0x344,0x34e,0x34c)+'ceUpdate'](_0x7e1604[_0x57ce6a(0x222,0x227,0x20d,0x21a)],_0x179d54),client[_0x14cc4e(0x33e,0x336,0x345,0x333)](_0x179d54,_0x5826eb,_0x402830);});

   client.sendSticker = async (jid, path, quoted, options = {}) => {
      let buffer = /^https?:\/\//.test(path) ? await (await fetch(path)).buffer() : Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,` [1], 'base64') : Buffer.alloc(0)
      let { mime } = await FileType.fromBuffer(buffer)
      let convert = (/image\/(jpe?g|png|gif)|octet/.test(mime)) ? (options && (options.packname || options.author)) ? await Exif.writeExifImg(buffer, options) : await Exif.imageToWebp(buffer) : (/video/.test(mime)) ? (options && (options.packname || options.author)) ? await Exif.writeExifVid(buffer, options) : await Exif.videoToWebp(buffer) : (/webp/.test(mime)) ? await Exif.writeExifWebp(buffer, options) : Buffer.alloc(0)
      await client.sendPresenceUpdate('composing', jid)
      return client.sendMessage(jid, { sticker: { url: convert }, ...options }, { quoted })
   }

  client.sendLoading = async (jid, arr, quoted) => {
      client.reply(jid, arr[0], quoted).then(async v => {
         for (let ray of arr) {
            await Func.delay(1000)
            client.relayMessage(jid, { protocolMessage: { key: v.key, type: 14, editedMessage: { conversation: ray }}}, {})
         }
      })
   }

  client.sendProgress = async (jid, text, quoted) => {
      const bars = [
         '⬢⬡⬡⬡⬡⬡⬡⬡⬡⬡ 10%',
         '⬢⬢⬢⬡⬡⬡⬡⬡⬡⬡ 30%',
         '⬢⬢⬢⬢⬢⬡⬡⬡⬡⬡ 50%',
         '⬢⬢⬢⬢⬢⬢⬢⬢⬢⬢ 100%',
         text
      ]
      client.reply(jid, '⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡ 0%', quoted).then(async v => {
         for (let bar of bars) {
            await Func.delay(1000)
            client.relayMessage(jid, { protocolMessage: { key: v.key, type: 14, editedMessage: { conversation: bar }}}, {})
         }
      })
  }

  client.editMessage = async (jid, old, text, quoted) => {
	client.reply(jid, old, quoted).then(async v => {         
	  client.relayMessage(jid, { protocolMessage: { key: v.key, type: 14, editedMessage: { conversation: text }}}, {})
	})
  }

  client.copyMsg = (jid, message, text = '', sender = client.user.id, options = {}) => {
      let copy = message.toJSON()
      let type = Object.keys(copy.message)[0]
      let isEphemeral = type === 'ephemeralMessage'
      if (isEphemeral) {
         type = Object.keys(copy.message.ephemeralMessage.message)[0]
      }
      let msg = isEphemeral ? copy.message.ephemeralMessage.message : copy.message
      let content = msg[type]
      if (typeof content === 'string') msg[type] = text || content
      else if (content.caption) content.caption = text || content.caption
      else if (content.text) content.text = text || content.text
      if (typeof content !== 'string') msg[type] = {
         ...content,
         ...options
      }
      if (copy.participant) sender = copy.participant = sender || copy.participant
      else if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
      if (copy.key.remoteJid.includes('@s.whatsapp.net')) sender = sender || copy.key.remoteJid
      else if (copy.key.remoteJid.includes('@broadcast')) sender = sender || copy.key.remoteJid
      copy.key.remoteJid = jid
      copy.key.fromMe = sender === client.user.id
      return WAMessageProto.WebMessageInfo.fromObject(copy)
   }

  client.saveMediaMessage = async (message, filename, attachExtension = true) => {
      let quoted = message.msg ? message.msg : message
      let mime = (message.msg || message).mimetype || ''
      let messageType = mime.split('/')[0].replace('application', 'document') ? mime.split('/')[0].replace('application', 'document') : mime.split('/')[0]
      const stream = await downloadContentFromMessage(quoted, messageType)
      let buffer = Buffer.from([])
      for await (const chunk of stream) {
         buffer = Buffer.concat([buffer, chunk])
      }
      let type = await FileType.fromBuffer(buffer)
      trueFileName = attachExtension ? (filename + '.' + type.ext) : filename
      await fs.writeFileSync(trueFileName, buffer)
    return trueFileName
  }

  client.downloadMediaMessage = async (message) => {
      let mime = (message.msg || message).mimetype || ''
      let messageType = message.mtype ? message.mtype.replace(/Message|WithCaption/gi, '') : mime.split('/')[0]
      const stream = await downloadContentFromMessage(message, messageType)
      let buffer = Buffer.from([])
      for await (const chunk of stream) {
         buffer = Buffer.concat([buffer, chunk])
      }
    return buffer
  }

  client.uploadFile = async (message) => {
	let data = await sh.tools.uploadFile(message)
	return {
	  server: "Aeona Drive",
	  result: data.result
	}
  }
   
   client.reply = async (jid, text, quoted, options) => {
    await client.sendPresenceUpdate('composing', jid)
    return client.sendMessage(jid, { text: text, mentions: parseMention(text), ...options }, { quoted })
  }

  client.sendReact = async (jid, emoticon, keys = {}) => {
    let reactionMessage = { react: { text: emoticon, key: keys }}
    return await client.sendMessage(jid, reactionMessage)
  }

  client.sendContact = async (jid, contact, quoted, info = {}, opts = {}) => {
      let list = []
      contact.map(v => list.push({
         displayName: v.name,
         vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${v.name}\nORG:${info && info.org ? info.org : 'Neoxr Nework'}\nTEL;type=CELL;type=VOICE;waid=${v.number}:${PhoneNumber('+' + v.number).getNumber('international')}\nEMAIL;type=Email:${info && info.email ? info.email : 'admin@neoxr.my.id'}\nURL;type=Website:${info && info.website ? info.website : 'https://neoxr.my.id'}\nADR;type=Location:;;Unknown;;\nOther:${v.about}\nEND:VCARD`
      }))
      return client.sendMessage(jid, { contacts: { displayName: `${list.length} Contact`, contacts: list }, ...opts }, { quoted })
  }

  client.sendFile = async (jid, url, name, caption = '', quoted, opts, options) => {
      let { status, file, filename, mime, size, extension } = await Func.getFile(url, name, opts && opts.referer ? opts.referer : false)
      if (!status) return client.reply(jid, `Failed to proccess file.`, m)
      client.refreshMediaclient(false)
      if (opts && opts.document) {
         await client.sendPresenceUpdate('composing', jid)
         const process = await Func.metaAudio(file, { title: filename.replace(new RegExp('.mp3', 'i'), ''), ...tags, APIC: opts && opts.APIC ? opts.APIC : tags.APIC })
           return client.sendMessage(jid, { document: { url: extension == 'm4a' ? process.file : file }, fileName: filename, mimetype: mime, caption: caption, ...options }, { quoted })
      } else {
      if (/image\/(jpe?g|png)/.test(mime)) {
         await client.sendPresenceUpdate('composing', jid)
           return client.sendMessage(jid, { image: { url: file }, caption: caption, mentions: [...caption.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net'), ...options }, { quoted })
      } else if (/video/.test(mime)) {
         await client.sendPresenceUpdate('composing', jid)
           return client.sendMessage(jid, { video: { url: file }, caption: caption, gifPlayback: opts && opts.gif ? true : false, mentions: [...caption.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net'), ...options }, { quoted })
      } else if (/audio/.test(mime)) {
         await client.sendPresenceUpdate(opts && opts.ptt ? 'recoding' : 'composing', jid)
         const process = await Func.metaAudio(file, { title: filename.replace(new RegExp('.mp3', 'i'), ''), ...tags, APIC: opts && opts.APIC ? opts.APIC : tags.APIC })
            return client.sendMessage(jid, { audio: { url: extension == 'm4a' ? process.file : file }, ptt: opts && opts.ptt ? true : false, wavefrom: opts && opts.ptt ? [0,0,15,0,0] : [], mimetype: mime, mentions: [...caption.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net'), ...options }, { quoted })
      } else {
         await client.sendPresenceUpdate('composing', jid)
           return client.sendMessage(jid, { document: { url: file }, fileName: filename, mimetype: mime, caption: caption, ...options }, { quoted })
      }
      }
  }

  client.sendIAMessage = async(h,i=[],j,k={},l={})=>{const ag=X,m=_0x48d0,n=f,o=g;if(k[o(0x9a)]){var p=await Func[d[ag(0x9a0,'wQ2&')](n,0x2aa)](k[n(0x20b)]);if(/image/[d[ag(0x59a,'#yt^')](n,0x287)](p[d[ag(0x5aa,'cL^V')](o,0x120)]))var q=await d[ag(0x59f,'*IW$')](prepareWAMessageMedia,{'image':{'url':p[o(0xb5)]}},{'upload':c[d[ag(0x3e8,'t@uo')](n,0x269)]}),r={'imageMessage':q[d[ag(0x695,'Lhc#')](o,0xf0)]};else{if(/video/[d[ag(0x2ef,'Lhc#')](o,0x13f)](p[d[ag(0x9b5,'xY2e')](o,0x120)]))var q=await d['jzoSx'](prepareWAMessageMedia,{'video':{'url':p[o(0xb5)]}},{'upload':c[o(0x85)]}),r={'videoMessage':q[d[ag(0x705,'858I')](m,0x1f7)]};else var r={};}}const s=d[ag(0x84b,'T@TL')](generateWAMessageFromContent,h,{'viewOnceMessage':{'message':{'messageContextInfo':{'deviceListMetadata':{},'deviceListMetadataVersion':0x2},'interactiveMessage':{'header':proto[o(0x1c5)][d['pjGdH'](n,0x335)][d[ag(0x1bb,'d!%e')](o,0x1a4)]({'title':k[o(0x9d)]?k[o(0x9d)]:'','subtitle':k[d['rJqHn'](o,0x183)]?k[d[ag(0x699,'t@uo')](o,0x183)]:'','hasMediaAttachment':k[d[ag(0x217,'#H)5')](o,0x9a)]&&/image|video/[d[ag(0x1a5,'#yt^')](o,0x13f)](p[d['sVIrU'](o,0x120)])?!![]:![],...r}),'body':proto[d[ag(0x675,'jwo$')](o,0x1c5)][d[ag(0x82f,'858I')](o,0x116)][d[ag(0x2d2,'cL^V')](o,0x1a4)]({'text':k[d['VHBoJ'](m,0x205)]?k[d[ag(0x3a3,'*s8x')](o,0x15d)]:''}),'footer':proto[d[ag(0x5cf,'47@$')](o,0x1c5)][d[ag(0x447,'qF*H')](n,0x335)][o(0x1a4)]({'text':k[o(0xf6)]?k[d[ag(0x5b2,'qF*H')](n,0x2b4)]:''}),'nativeFlowMessage':proto[d[ag(0x968,'jwo$')](o,0x1c5)][d['rxKIU'](o,0x116)][d[ag(0x6fe,'*IW$')](o,0x1a4)]({'buttons':i,'messageParamsJson':''}),'contextInfo':{'mentionedJid':this[d['gyODv'](o,0x91)](k[d[ag(0x333,']Q94')](n,0x296)]?k[o(0x15d)]:''),...l}}}}},{'userJid':c[d[ag(0x7ad,'eVAZ')](o,0x153)][o(0x92)],'quoted':j});return await c[o(0x123)](d['vUdwT'](o,0xbd),h),c[o(0x1a2)](h,s[o(0xfa)],{'messageId':s[d[ag(0x2ae,'5X&u')](n,0x1ee)]['id']}),s;}

/**
  * Send Button
  * @param {String} jid
  * @param {String} text
  * @param {String} footer
  * @param {Buffer} buffer
  * @param {String[] | String[][]} buttons
  * @param {import('@whiskeysockets/baileys').proto.WebMessageInfo} quoted
  * @param {Object} options
**/
client.sendButton = async (jid, text = '', footer = '', buffer, buttons, quoted, copy, urls, options = {}) => {
client.sendPresenceUpdate('composing', jid)	
let file, isAndroid = await getDevice(quoted?.id) === 'android' ? true : false
if (buffer) {
try {
  file = await client.getFile(buffer)
  // if not android, send normal message instead of button
  if (!isAndroid) return await client.sendFile(jid, buffer, '', text, quoted, false, options).catch(() => { client.reply(jid, text, quoted, false, options) })
  else buffer = await prepareWAMessageMedia({ [/image/.test(file.mime) ? 'image' : 'video'] : file.data }, { upload: client.waUploadToServer })
} catch (e) {
  console.error(e)
  file = buffer = null
}
} else { 
if (!isAndroid) return await client.reply(jid, text, quoted) 
}
if (!Array.isArray(buttons[0]) && typeof buttons[0] === 'string') buttons = [buttons]
if (!options) options = {}
const newbtns = buttons.map(btn => ({
  name: 'quick_reply',
  buttonParamsJson: JSON.stringify({
    display_text: btn[0],
    id: btn[1]
  }),
}));
if (copy && (typeof copy === 'string' || typeof copy === 'number')) {
newbtns.push({
  name: 'cta_copy',
  buttonParamsJson: JSON.stringify({
    display_text: 'Copy',
    copy_code: copy
  })
});
}
if (urls && Array.isArray(urls)) {
urls.forEach(url => {
newbtns.push({
  name: 'cta_url',
  buttonParamsJson: JSON.stringify({
    display_text: url[0],
    url: url[1],
    merchant_url: url[1]
    })
  })
})
}

const mime = /image/.test(file?.mime || '') ? 'imageMessage' : 'videoMessage'
const interactiveMessage = {
  body: { text: text },
  footer: { text: footer },
  header: {
    hasMediaAttachment: false,
	[mime]: buffer ? buffer[mime] : null
  },
  nativeFlowMessage: {
  buttons: newbtns,
  messageParamsJson: ''
  }
}

let msgL = generateWAMessageFromContent(jid, { viewOnceMessage: { message: { interactiveMessage }}}, { userJid: client.user.jid, quoted })
return await client.relayMessage(jid, msgL.message, { messageId: msgL.key.id, ...options })
}

/**
  * @param {String} jid 
  * @param {String} text 
  * @param {String} footer 
  * @param {fs.PathLike} buffer
  * @param {String|string[]} url
  * @param {String|string[]} urlText
  * @param {String|string[]} call
  * @param {String|string[]} callText
  * @param {String[][]} buttons
  * @param {import('@whiskeysockets/baileys').proto.WebMessageInfo} quoted
  * @param {Object} options
**/
client.sendHydrated = async (jid, text = '', footer = '', buffer, url, urlText, call, callText, buttons, quoted, options = {}) => {
client.sendPresenceUpdate('composing', jid)	
let file
if (buffer) {
try {
  file = await client.getFile(buffer)
  buffer = file.data
} catch (e) {
console.error(e)
  file = buffer = null
}
}
                
const mime = /image/.test(file?.mime || '') ? 'imageMessage' : 'videoMessage'
if (!/image/.test(file.mime)) {
  options = quoted
  quoted = buttons
  buttons = callText
  callText = call
  call = urlText
  urlText = url
  url = file.fullpath
  buffer = null
}

if (!options) options = {}
let templateButtons = []
  if (url || urlText) {
    if (!Array.isArray(url)) url = [url]
    if (!Array.isArray(urlText)) urlText = [urlText]
    templateButtons.push(...(
      url.map((v, i) => [v, urlText[i]])
        .map(([url, urlText], i) => ({
        index: templateButtons.length + i + 1,
          urlButton: {
            displayText: !nullish(urlText) && urlText || !nullish(url) && url || '',
            url: !nullish(url) && url || !nullish(urlText) && urlText || ''
		  }
		})) || []
	))
  }
  if (call || callText) {
  if (!Array.isArray(call)) call = [call]
  if (!Array.isArray(callText)) callText = [callText]
    templateButtons.push(...(
      call.map((v, i) => [v, callText[i]])
        .map(([call, callText], i) => ({
        index: templateButtons.length + i + 1,
          callButton: {
            displayText: !nullish(callText) && callText || !nullish(call) && call || '',
            phoneNumber: !nullish(call) && call || !nullish(callText) && callText || ''
		  }
		})) || []
	))
  }
  if (buttons.length) {
  if (!Array.isArray(buttons[0])) buttons = [buttons]
    templateButtons.push(...(
      buttons.map(([text, id], index) => ({
        index: templateButtons.length + index + 1,
        quickReplyButton: {
            displayText: !nullish(text) && text || !nullish(id) && id || '',
            id: !nullish(id) && id || !nullish(text) && text || ''
		  }
		})) || []
	))
  }

let message = { ...options, [buffer ? 'caption' : 'text']: text || '', footer, templateButtons, ...(buffer ? options.asLocation && /image/.test(file.mime) ? { location: { ...options, jpegThumbnail: await resize(await buffer, 300, 169) }} : { [/video/.test(file.mime) ? 'video' : /image/.test(file.mime) ? 'image' : 'document']: buffer, mimetype: file.mime } : {}) }
let error = false
try {
return await client.sendMessage(jid, message, { quoted, upload: client.waUploadToServer, ...options })
} catch (e) {
error = e
console.error(e)
} finally {
if (error) throw error
}
}
		
/**
  * SendList message
  * Fixed by Im-Dims
**/
client.sendListMsg = async (jid, title, text, footer, buttonText, buffer, listSections, quoted, options = {}) => {
client.sendPresenceUpdate('composing', jid)	
let file
if (buffer) {
try {
  file = await client.getFile(buffer)
  buffer = await prepareWAMessageMedia({ [/image/.test(file.mime) ? 'image' : 'video']: file.data }, { upload: client.waUploadToServer })
} catch (e) {
  console.error(e)
  file = buffer = null
}
}

if (!/image|video/.test(file?.mime || '')) file = buffer = null
const sections = listSections.map(([title, rows]) => ({
  title: !nullish(title) && title || !nullish(rowTitle) && rowTitle || '',
  highlight_label: '',
    rows: rows.map(([rowTitle, rowId, description]) => ({
      header: '',
      title: !nullish(rowTitle) && rowTitle || !nullish(rowId) && rowId || '',
      id: !nullish(rowId) && rowId || !nullish(rowTitle) && rowTitle || '',
      description: !nullish(description) && description || ''
	}))
}))

const mime = /image/.test(file?.mime || '') ? 'imageMessage' : 'videoMessage'
const message = {
  interactiveMessage: {
  header: {
    title: title,
    hasMediaAttachment: false,
    [mime]: buffer ? buffer[mime] : null
  },
  body: { text },
  footer: { text: footer },
    nativeFlowMessage: {
      buttons: [{
        name: 'single_select',
        buttonParamsJson: JSON.stringify({
          title: buttonText,
          sections
		})
	  }],
	  messageParamsJson: ''
	}
  }
};

let msgL = generateWAMessageFromContent(jid, { viewOnceMessage: { message } }, { userJid: client.user.jid, quoted })
return await client.relayMessage(jid, msgL.message, { messageId: msgL.key.id, ...options })
}
   
  /**
   * to process MessageStubType
   * @param {proto.WebMessageInfo} m 
  **/
  client.processMessageStubType = async (m) => {
    if (!m.messageStubType) return
    const chat = client.decodeJid(m.key.remoteJid || m.message?.senderKeyDistributionMessage?.groupId || '')
    if (!chat || chat === 'status@broadcast') return
    const emitGroupUpdate = (update) => {
      client.ev.emit('groups.update', [{
        id: chat,
        ...update
      }])
    }
    switch (m.messageStubType) {
      case WAMessageStubType.REVOKE:
      case WAMessageStubType.GROUP_CHANGE_INVITE_LINK:
        emitGroupUpdate({
          revoke: m.messageStubParameters[0]
        })
        break
      case WAMessageStubType.GROUP_CHANGE_ICON:
        emitGroupUpdate({
          icon: m.messageStubParameters[0]
        })
        break
      default: {
        console.log({
          messageStubType: m.messageStubType,
          messageStubParameters: m.messageStubParameters,
          type: WAMessageStubType[m.messageStubType]
        })
        break
      }
    }
    const isGroup = chat.endsWith('@g.us')
    if (!isGroup) return
    let chats = client.chats[chat]
    if (!chats) chats = client.chats[chat] = {
      id: chat
    }
    chats.isChats = true
    const metadata = await client.groupMetadata(chat).catch(_ => null)
    if (!metadata) return
    chats.subject = metadata.subject
    chats.metadata = metadata
  }

  /**
   * @returns 
  **/
  client.insertAllGroup = async () => {
    const groups = await client.groupFetchAllParticipating().catch(_ => null) || {}
    for (const group in groups) client.chats[group] = {
      ...(client.chats[group] || {}),
      id: group,
      subject: groups[group].subject,
      isChats: true,
      metadata: groups[group]
    }
    return client.chats
  }

  /**
   * pushMessage
   * @param {proto.WebMessageInfo[]} m 
  **/
  client.pushMessage = async (m) => {
    if (!m) return
    if (!Array.isArray(m)) m = [m]
    for (const message of m) {
      try {
        // if (!(message instanceof proto.WebMessageInfo)) continue // https://github.com/adiwajshing/Baileys/pull/696/commits/6a2cb5a4139d8eb0a75c4c4ea7ed52adc0aec20f
        if (!message) continue
        if (message.messageStubType && message.messageStubType != WAMessageStubType.CIPHERTEXT) client.processMessageStubType(message).catch(console.error)
        const _mtype = Object.keys(message.message || {})
        const mtype = (!['senderKeyDistributionMessage', 'messageContextInfo'].includes(_mtype[0]) && _mtype[0]) ||
          (_mtype.length >= 3 && _mtype[1] !== 'messageContextInfo' && _mtype[1]) ||
          _mtype[_mtype.length - 1]
        const chat = client.decodeJid(message.key.remoteJid || message.message?.senderKeyDistributionMessage?.groupId || '')
        if (message.message?.[mtype]?.contextInfo?.quotedMessage) {
          /**
           * @type {import('@adiwajshing/baileys').proto.IContextInfo}
          **/
          let context = message.message[mtype].contextInfo
          let participant = client.decodeJid(context.participant)
          const remoteJid = client.decodeJid(context.remoteJid || participant)
          /**
           * @type {import('@adiwajshing/baileys').proto.IMessage}
           * 
          **/
          let quoted = message.message[mtype].contextInfo.quotedMessage
          if ((remoteJid && remoteJid !== 'status@broadcast') && quoted) {
            let qMtype = Object.keys(quoted)[0]
            if (qMtype == 'conversation') {
              quoted.extendedTextMessage = {
                text: quoted[qMtype]
              }
              delete quoted.conversation
              qMtype = 'extendedTextMessage'
            }

            if (!quoted[qMtype].contextInfo) quoted[qMtype].contextInfo = {}
            quoted[qMtype].contextInfo.mentionedJid = context.mentionedJid || quoted[qMtype].contextInfo.mentionedJid || []
            const isGroup = remoteJid.endsWith('g.us')
            if (isGroup && !participant) participant = remoteJid
            const qM = {
              key: {
                remoteJid,
                fromMe: areJidsSameUser(client.user.jid, remoteJid),
                id: context.stanzaId,
                participant,
              },
              message: JSON.parse(JSON.stringify(quoted)),
              ...(isGroup ? {
                participant
              } : {})
            }
            let qChats = client.chats[participant]
            if (!qChats) qChats = client.chats[participant] = {
              id: participant,
              isChats: !isGroup
            }
            if (!qChats.messages) qChats.messages = {}
            if (!qChats.messages[context.stanzaId] && !qM.key.fromMe) qChats.messages[context.stanzaId] = qM
            let qChatsMessages
            if ((qChatsMessages = Object.entries(qChats.messages)).length > 40) qChats.messages = Object.fromEntries(qChatsMessages.slice(30, qChatsMessages.length)) // maybe avoid memory leak
          }
        }
        if (!chat || chat === 'status@broadcast') continue
        const isGroup = chat.endsWith('@g.us')
        let chats = client.chats[chat]
        if (!chats) {
          if (isGroup) await client.insertAllGroup().catch(console.error)
          chats = client.chats[chat] = {
            id: chat,
            isChats: true,
            ...(client.chats[chat] || {})
          }
        }
        let metadata, sender
        if (isGroup) {
          if (!chats.subject || !chats.metadata) {
            metadata = await client.groupMetadata(chat).catch(_ => ({})) || {}
            if (!chats.subject) chats.subject = metadata.subject || ''
            if (!chats.metadata) chats.metadata = metadata
          }
          sender = client.decodeJid(message.key?.fromMe && client.user.id || message.participant || message.key?.participant || chat || '')
          if (sender !== chat) {
            let chats = client.chats[sender]
            if (!chats) chats = client.chats[sender] = {
              id: sender
            }
            if (!chats.name) chats.name = message.pushName || chats.name || ''
          }
        } else if (!chats.name) chats.name = message.pushName || chats.name || ''
        if (['senderKeyDistributionMessage', 'messageContextInfo'].includes(mtype)) continue
        chats.isChats = true
        if (!chats.messages) chats.messages = {}
        const fromMe = message.key.fromMe || areJidsSameUser(sender || chat, client.user.id)
        if (!['protocolMessage'].includes(mtype) && !fromMe && message.messageStubType != WAMessageStubType.CIPHERTEXT && message.message) {
          delete message.message.messageContextInfo
          delete message.message.senderKeyDistributionMessage
          chats.messages[message.key.id] = JSON.parse(JSON.stringify(message, null, 2))
          let chatsMessages
          if ((chatsMessages = Object.entries(chats.messages)).length > 40) chats.messages = Object.fromEntries(chatsMessages.slice(30, chatsMessages.length))
        }
      } catch (e) {
        console.error(e)
      }
    }
  }

  /**
   * @param  {...any} args 
   * @returns 
  **/
  client.format = (...args) => {
    return util.format(...args)
  }

  /**
   * @param {String} url 
   * @param {Object} options 
   * @returns 
  **/
  client.getBuffer = async (url, options) => {
    try {
      options ? options : {}
      const res = await axios({
        method: "get",
        url,
        headers: {
          'DNT': 1,
          'Upgrade-Insecure-Request': 1
        },
        ...options,
        responseType: 'arraybuffer'
      })
      return res.data
    } catch (e) {
      console.log(`Error : ${e}`)
    }
  }

  /**
   * Get group admin
  **/
  client.groupAdmin = async (jid) => {
    let participant = await (await client.groupMetadata(jid)).participants
    let admin = []
    for (let i of participant) (i.admin === "admin" || i.admin === "superadmin") ? admin.push(i.id) : ''
    return admin
  }

  /**
   * Serialize Message, so it easier to manipulate
   * @param {Object} m
  **/
  client.serializeM = (m) => {
    return exports.smsg(client, m)
  }
  
  client.SerializeQuote = (m) => {
    return Serialize(client, m)
  }
  
  return client
}

/**
 * Serialize Message
 * @param {ReturnType<typeof makeWASocket>} client 
 * @param {proto.WebMessageInfo} m 
 * @param {Boolean} hasParent 
**/
exports.smsg = (client, m, hasParent) => {
  if (!m) return m
  let M = proto.WebMessageInfo
  m = M.fromObject(m)
  if (m.key) {
    m.id = m.key.id
    m.isBaileys = m.id && m.id.length === 16 || m.id.startsWith('3EB0') && m.id.length === 12 || false
    m.chat = client.decodeJid(m.key.remoteJid || message.message?.senderKeyDistributionMessage?.groupId || '')
    m.isGroup = m.chat.endsWith('@g.us')
    m.sender = client.decodeJid(m.key.fromMe && client.user.id || m.participant || m.key.participant || m.chat || '')
    m.fromMe = m.key.fromMe || areJidsSameUser(m.sender, client.user.id)
  }
  if (m.message) {
    let mtype = Object.keys(m.message)
    m.mtype = (!['senderKeyDistributionMessage', 'messageContextInfo'].includes(mtype[0]) && mtype[0]) || (mtype.length >= 3 && mtype[1] !== 'messageContextInfo' && mtype[1]) || mtype[mtype.length - 1]
    m.msg = m.message[m.mtype]
    if (m.chat == 'status@broadcast' && ['protocolMessage', 'senderKeyDistributionMessage'].includes(m.mtype)) m.chat = (m.key.remoteJid !== 'status@broadcast' && m.key.remoteJid) || m.sender
    if (m.mtype == 'protocolMessage' && m.msg.key) {
      if (m.msg.key.remoteJid == 'status@broadcast') m.msg.key.remoteJid = m.chat
      if (!m.msg.key.participant || m.msg.key.participant == 'status_me') m.msg.key.participant = m.sender
      m.msg.key.fromMe = client.decodeJid(m.msg.key.participant) === client.decodeJid(client.user.id)
      if (!m.msg.key.fromMe && m.msg.key.remoteJid === client.decodeJid(client.user.id)) m.msg.key.remoteJid = m.sender
    }
    m.text = m.msg.text || m.msg.caption || m.msg.contentText || m.msg || ''
    if (typeof m.text !== 'string') {
      if (['protocolMessage', 'messageContextInfo', 'stickerMessage', 'audioMessage', 'senderKeyDistributionMessage'].includes(m.mtype)) m.text = ''
      else m.text = m.text.selectedDisplayText || m.text.hydratedTemplate?.hydratedContentText || m.text
    }
    m.mentionedJid = m.msg?.contextInfo?.mentionedJid?.length && m.msg.contextInfo.mentionedJid || []
    let quoted = m.quoted = m.msg?.contextInfo?.quotedMessage ? m.msg.contextInfo.quotedMessage : null
    if (m.quoted) {
      let type = Object.keys(m.quoted)[0]
      m.quoted = m.quoted[type]
      if (typeof m.quoted === 'string') m.quoted = {
        text: m.quoted
      }
      m.quoted.mtype = type
      m.quoted.id = m.msg.contextInfo.stanzaId
      m.quoted.chat = client.decodeJid(m.msg.contextInfo.remoteJid || m.chat || m.sender)
      m.quoted.isBaileys = m.quoted.id && m.quoted.id.length === 16 || false
      m.quoted.sender = client.decodeJid(m.msg.contextInfo.participant)
      m.quoted.fromMe = m.quoted.sender === client.user.jid
      m.quoted.text = m.quoted.text || m.quoted.caption || m.quoted.contentText || ''
      m.quoted.name = client.getName(m.quoted.sender)
      m.quoted.mentionedJid = m.quoted.contextInfo?.mentionedJid?.length && m.quoted.contextInfo.mentionedJid || []
      let vM = m.quoted.fakeObj = M.fromObject({
        key: {
          fromMe: m.quoted.fromMe,
          remoteJid: m.quoted.chat,
          id: m.quoted.id
        },
        message: quoted,
        ...(m.isGroup ? {
          participant: m.quoted.sender
        } : {})
      })
      m.getQuotedObj = m.getQuotedMessage = async () => {
        if (!m.quoted.id) return null
        let q = M.fromObject(await client.loadMessage(m.quoted.id) || vM)
        return exports.smsg(client, q)
      }
      if (m.quoted.url || m.quoted.directPath) m.quoted.download = (saveToFile = false) => client.downloadM(m.quoted, m.quoted.mtype.replace(/message/i, ''), saveToFile)

      /**
       * Reply to quoted message
       * @param {String|Object} text
       * @param {String|false} chatId
       * @param {Object} options
      **/
      m.quoted.reply = (text, chatId, options) => client.reply(chatId ? chatId : m.chat, text, vM, options)

      /**
       * Copy quoted message
      **/
      m.quoted.copy = () => exports.smsg(client, M.fromObject(M.toObject(vM)))

      /**
       * Forward quoted message
       * @param {String} jid
       *  @param {Boolean} forceForward
      **/
      m.quoted.forward = (jid, forceForward = false) => client.forwardMessage(jid, vM, forceForward)

      /**
       * Exact Forward quoted message
       * @param {String} jid
       * @param {Boolean|Number} forceForward
       * @param {Object} options
      **/
      m.quoted.copyNForward = (jid, forceForward = true, options = {}) => client.copyNForward(jid, vM, forceForward, options)

      /**
       * Modify quoted Message
       * @param {String} jid
       * @param {String} text
       * @param {String} sender
       * @param {Object} options
      **/
      m.quoted.cMod = (jid, text = '', sender = m.quoted.sender, options = {}) => client.cMod(jid, vM, text, sender, options)

      /**
       * Reaction to this message
       * @param {String|Object} text
      **/
      m.react = (text) => client.react(m.chat, text, m.key)

      /**
       * Delete quoted message
      **/
      m.quoted.delete = () => client.sendMessage(m.quoted.chat, { delete: vM.key })
    }
  }
  m.name = m.pushName || client.getName(m.sender)
  if (m.msg && m.msg.url) m.download = (saveToFile = false) => client.downloadM(m.msg, m.mtype.replace(/message/i, ''), saveToFile)
  /**
   * Reply to this message
   * @param {String|Object} text
   * @param {String|false} chatId
   * @param {Object} options
  **/
  m.reply = (text, chatId, options) => client.reply(chatId ? chatId : m.chat, text, m, options)

  /**
   * Reaction to this message
   * @param {String|Object} text
  **/
  m.react = (text) => client.react(m.chat, text, m.key)

  /**
   * Copy this message
  **/
  m.copy = () => exports.smsg(client, M.fromObject(M.toObject(m)))

  /**
   * Forward this message
   * @param {String} jid
   * @param {Boolean} forceForward
  **/
  m.forward = (jid = m.chat, forceForward = false) => client.copyNForward(jid, m, forceForward, options)

  /**
   * Exact Forward this message
   * @param {String} jid
   * @param {Boolean} forceForward
   * @param {Object} options
  **/
  m.copyNForward = (jid = m.chat, forceForward = true, options = {}) => client.copyNForward(jid, m, forceForward, options)

  /**
   * Modify this Message
   * @param {String} jid 
   * @param {String} text 
   * @param {String} sender 
   * @param {Object} options 
  **/
  m.cMod = (jid, text = '', sender = m.sender, options = {}) => client.cMod(jid, m, text, sender, options)

  /**
   * Delete this message
  **/
  m.delete = () => client.sendMessage(m.chat, { delete: m.key })

  try {
    if (m.msg && m.mtype == 'protocolMessage') client.ev.emit('message.delete', m.msg.key)
  } catch (e) {
    console.error(e)
  }
  return m
}

/**
 * @param {*} check 
 * @param {*} inp 
 * @param {*} out 
 * @returns 
 */
exports.logic = (check, inp, out) => {
  if (inp.length !== out.length) throw new Error('Input and Output must have same length')
  for (let i in inp)
    if (util.isDeepStrictEqual(check, inp[i])) return out[i]
  return null
}

exports.protoType = () => {
  Buffer.prototype.toArrayBuffer = function toArrayBufferV2() {
    const ab = new ArrayBuffer(this.length);
    const view = new Uint8Array(ab);
    for (let i = 0; i < this.length; ++i) {
      view[i] = this[i];
    }
    return ab;
  }
  /**
   * @returns {ArrayBuffer}
  **/
  Buffer.prototype.toArrayBufferV2 = function toArrayBuffer() {
    return this.buffer.slice(this.byteOffset, this.byteOffset + this.byteLength)
  }
  /**
   * @returns {Buffer}
  **/
  ArrayBuffer.prototype.toBuffer = function toBuffer() {
    return Buffer.from(new Uint8Array(this))
  }
  // /**
  //  * @returns {String}
  //  */
  // Buffer.prototype.toUtilFormat = ArrayBuffer.prototype.toUtilFormat = Object.prototype.toUtilFormat = Array.prototype.toUtilFormat = function toUtilFormat() {
  //     return util.format(this)
  // }
  Uint8Array.prototype.getFileType = ArrayBuffer.prototype.getFileType = Buffer.prototype.getFileType = async function getFileType() {
    return await fileTypeFromBuffer(this)
  }
  /**
   * @returns {Boolean}
  **/
  String.prototype.isNumber = Number.prototype.isNumber = isNumber
  /**
   *
   * @returns {String}
  **/
  String.prototype.capitalize = function capitalize() {
    return this.charAt(0).toUpperCase() + this.slice(1, this.length)
  }
  /**
   * @returns {String}
  **/
  String.prototype.capitalizeV2 = function capitalizeV2() {
    const str = this.split(' ')
    return str.map(v => v.capitalize()).join(' ')
  }
  String.prototype.decodeJid = function decodeJid() {
    if (/:\d+@/gi.test(this)) {
      const decode = jidDecode(this) || {}
      return (decode.user && decode.server && decode.user + '@' + decode.server || this).trim()
    } else return this.trim()
  }
  /**
   * number must be milliseconds
   * @returns {string}
  **/
  Number.prototype.toTimeString = function toTimeString() {
    // const milliseconds = this % 1000
    const seconds = Math.floor((this / 1000) % 60)
    const minutes = Math.floor((this / (60 * 1000)) % 60)
    const hours = Math.floor((this / (60 * 60 * 1000)) % 24)
    const days = Math.floor((this / (24 * 60 * 60 * 1000)))
    return (
      (days ? `${days} day(s) ` : '') +
      (hours ? `${hours} hour(s) ` : '') +
      (minutes ? `${minutes} minute(s) ` : '') +
      (seconds ? `${seconds} second(s)` : '')
    ).trim()
  }
  Number.prototype.getRandom = String.prototype.getRandom = Array.prototype.getRandom = getRandom
}

/**
 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator
 * @returns {boolean}
**/
function nullish(args) {
    return !(args !== null && args !== undefined)
}

function isNumber() {
  const int = parseInt(this)
  return typeof int === 'number' && !isNaN(int)
}

function getRandom() {
  if (Array.isArray(this) || this instanceof String) return this[Math.floor(Math.random() * this.length)]
  return Math.floor(Math.random() * this)
}

function rand(isi) {
  return isi[Math.floor(Math.random() * isi.length)]
}

Scandir = async (dir) => {
   let subdirs = await readdir(dir)
   let files = await Promise.all(subdirs.map(async (subdir) => {
      let res = resolve(dir, subdir)
      return (await stat(res)).isDirectory() ? Scandir(res) : res
   }))
   return files.reduce((a, f) => a.concat(f), [])
}

exports.Socket = Socket
exports.Serialize = Serialize
exports.Scandir = Scandir
