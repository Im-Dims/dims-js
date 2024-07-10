const axios = require('axios')
const cheerio = require('cheerio')
const fetch = require('node-fetch')
const FormData = require('form-data')
const { fromBuffer } = require('file-type')
global.creator = '@dims.js - Dimas Triyatno'

module.exports = class Scraper {
   chatAI = (bid, key, text) => {
      return new Promise(async (resolve) => {
         try {
            let json = await (await axios.get('http://api.brainshop.ai/get?bid=' + bid + '&key=' + key + '&uid=neoxr&msg=' + encodeURI(text))).data
            if (typeof json.cnt == 'undefined') return resolve({
               creator: global.creator,
               status: false
            })
            resolve({
               cretor: global.creator,
               status: true,
               msg: json.cnt
            })
         } catch (e) {
            console.log(e)
            return resolve({
               creator: global.creator,
               status: false
            })
         }
      })
   }
   bard = (prompt) => {
      return new Promise(async (resolve) => {
         try {
            let response = await axios.post('https://bard.rizzy.eu.org/backend/conversation', { ask: prompt }, {
               headers: {
                  'Content-Type': 'application/json',
                  'accept': 'application/json'
               }
            })
            if (response.error) return resolve({
               creator: global.creator,
               status: false,
               msg: 'status code 404!'
            })
            resolve({
               creator: global.creator,
               status: true,
               data: {
                  respon: response.data.content
               }
            })
         } catch (e) {
            console.log(e)
            resolve({
               creator: global.creator,
               status: false,
               msg: e.message
            })
         }
      })
   }
   simsimi = (text, lang = 'id') => {
      return new Promise(async (resolve) => {
         try {
            let json = await (await axios.post('https://simsimi.vn/web/simtalk', `text=${encodeURI(text)}&lc=${lang}`, {
               headers: {
                  'Accept': '*/*',
                  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                  'Referer': 'https://simsimi.net/',
                  'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0.1; SM-J500G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Mobile Safari/537.36'
               }
            })).data
            if (json.success.match(new RegExp('Aku tidak mengerti', 'g'))) return resolve({
               creator: global.creator,
               status: false
            })
            resolve({
               cretor: global.creator,
               status: true,
               msg: json.success
            })
         } catch (e) {
            console.log(e)
            return resolve({
               creator: global.creator,
               status: false
            })
         }
      })
   }
   simsimiV2 = (text) => {
      return new Promise(async (resolve) => {
         try { // https://simsimi.net/ & https://simsimi.info
            let json = await (await axios.get('https://api.simsimi.net/v2/?text=' + encodeURI(text) + '&lc=id')).data
            if (json.success.match(new RegExp('Aku tidak mengerti', 'g'))) return resolve({
               creator: global.creator,
               status: false
            })
            resolve({
               cretor: global.creator,
               status: true,
               msg: json.success
            })
         } catch (e) {
            console.log(e)
            return resolve({
               creator: global.creator,
               status: false
            })
         }
      })
  }
  uploader = async (buffer) => {
    return new Promise(async (resolve) => {
      try {
        const { ext } = await fromBuffer(buffer)
        const form = new FormData()
        form.append('file', buffer, 'tmp.' + ext)
        const json = await (await axios.post("https://tmpfiles.org/api/v1/upload", form, {
          headers: {
            "accept": "*/*",
            "accept-language": "id-ID , id; q=O. 9 , en- US ; q=0.8, en q=0.7",
            "content-type": "multipart/form-data",
            "origin": "https://tmpfiles.orgi",
            "referer": "https://tmpfiles.org/",
            "sec-ch-ua": '"Chromium";v="107", "Not=A?Brand";v="24"',
            "sec-ch-ua-mobile": "?1",
            "sec-ch-ua-platform": "Android",
            "sec-fetch-dest": "empty",
            "sec-fetch-mcde": "cors",
            "sec-fetch-site": "same-origin",
            "user-agent": "Mozilla/5.0 (Linux; Android 6.0.1; SM-J500G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Mobile Safari/537.36",
            "x-requested-with": "XMLHttpRequest",
            ...form.getHeaders()
          }
        })).data
        if (json.status != 'success') return resolve({
          developer: global.creator,
          status: false,
          msg: 'Failed to uploaded'
        })
        resolve({
          developer: global.creator,
          status: true,
          timeout: '60 second',
          data: {
            url: json.data.url.replace('https://tmpfiles.org/', 'https://tmpfiles.org/dl/')
          }
        })
      } catch (e) {
        console.log(e)
        resolve({
          developer: global.creator,
          status: false,
          msg: e.message
        })
      }
    })
  }
  uploaderV2 = async input => {
    return new Promise(async resolve => {
      try {
        const image = Buffer.isBuffer(input) ? input : input.startsWith('http') ? await (await axios.get(input, {
          responseType: 'arraybuffer'
        })).data : input
        let form = new FormData
        form.append('source', Buffer.from(image), 'image.jpg')
        form.append('type', 'file')
        form.append('action', 'upload')
        form.append('timestamp', (new Date() * 1))
        form.append('auth_token', '3b0ead89f86c3bd199478b2e14afd7123d97507f')
        form.append('nsfw', 0)
        const json = await (await axios.post('https://freeimage.host/json', form, {
          headers: {
            "Accept": "*/*",
            "User-Agent": "Mozilla/5.0 (Linux; Android 6.0.1; SM-J500G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Mobile Safari/537.36",
            "Origin": "https://freeimage.host",
            "Referer": "https://freeimage.host/",
            "Referrer-Policy": "strict-origin-when-cross-origin",
            "sec-ch-ua": '"Chromium";v="107", "Not=A?Brand";v="24"',
            "sec-ch-ua-platform": "Android",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-requested-with": "XMLHttpRequest",
            ...form.getHeaders()
          }
        })).data
        if (json.status_code != 200) return resolve({
          creator: global.creator,
          status: false,
          msg: `Failed to Upload!`
        })
        resolve({
          creator: global.creator,
          status: true,
          timeout: '60 second',
          original: json,
          data: {
            url: json.image.url
          }
        })
      } catch (e) {
        console.log(e)
        resolve({
          creator: global.creator,
          status: false,
          msg: e.message
        })
      }
    })
  }  
  telegraph = async (buffer) => {
    return new Promise(async (resolve) => {
      try {
        const { ext } = await fromBuffer(buffer)
        let form = new FormData
        form.append('file', buffer, 'tmp.' + ext)
        let res = await fetch('https://telegra.ph/upload', {
          method: 'POST',
          body: form
        })
        let img = await res.json()
        if (img.error) throw img.error
        resolve({
          developer: global.creator,
          status: true,
          timeout: 'unknown',
          data: {
            url: 'https://telegra.ph' + img[0].src
          }
        })
      } catch (e) {
        console.log(e)
        resolve({
          developer: global.creator,
          status: false,
          msg: e.message
        })
      }
    })
  }
  uploadImage = (str) => {
      return new Promise(async resolve => {
         try {
            const parse = await (await axios.get('https://tiny-img.com/webp/'))
            const cookie = parse.headers['set-cookie'].join('; ')
            const image = Buffer.isBuffer(str) ? str : str.startsWith('http') ? await (await axios.get(str, {
               responseType: 'arraybuffer'
            })).data : str
            let form = new FormData
            form.append('file', Buffer.from(image), (Math.random() + 1).toString(36).substring(7) + '.webp')
            const json = await (await axios.post('https://tiny-img.com/app/webp-files/', form, {
               headers: {
                  "Accept": "*/*",
                  "User-Agent": "Mozilla/5.0 (Linux; Android 6.0.1; SM-J500G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Mobile Safari/537.36",
                  "Origin": "https://tiny-img.com/",
                  "Referer": "https://tiny-img.com",
                  "Referrer-Policy": "strict-origin-when-cross-origin",
                  "sec-ch-ua": '"Chromium";v="107", "Not=A?Brand";v="24"',
                  "sec-ch-ua-platform": "Android",
                  "sec-fetch-dest": "empty",
                  "sec-fetch-mode": "cors",
                  "sec-fetch-site": "same-origin",
                  cookie,
                  ...form.getHeaders(),
                  "x-requested-with": "XMLHttpRequest"
               }
            })).data
            if (!json.success) return resolve({
               creator: global.creator,
               status: false,
               msg: 'Failed to convert!'
            })
            resolve({
               creator: global.creator,
               status: true,
               data: {
                  url: json.optimized_image_url
               }
            })
         } catch (e) {
            console.log(e)
            resolve({
               creator: global.creator,
               status: false,
               msg: e.message
            })
         }
      })
  }
  uploadImageV2 = async (str) => {
    return new Promise(async resolve => {
      try {
        const parse = await (await axios.get('https://imgbb.com', {
          headers: {
            "User-Agent": "Mozilla/5.0 (Linux; Android 6.0.1; SM-J500G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Mobile Safari/537.36"
          }
        }))
        const token = parse.data.match(/PF\.obj\.config\.auth_token="([^"]*)/)[1]
        const cookie = parse.headers['set-cookie'].join(', ')
        const file = Buffer.isBuffer(str) ? str : str.startsWith('http') ? await (await axios.get(str, {
          responseType: 'arraybuffer'
        })).data : str
        const { ext } = await fromBuffer(Buffer.from(file))
        let form = new FormData
        form.append('source', Buffer.from(file), 'image.' + ext)
        form.append('type', 'file')
        form.append('action', 'upload')
        form.append('timestamp', (new Date() * 1))
        form.append('auth_token', token)
        const json = await (await axios.post('https://imgbb.com/json', form, {
          headers: {
            "Accept": "*/*",
            "User-Agent": "Mozilla/5.0 (Linux; Android 6.0.1; SM-J500G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Mobile Safari/537.36",
            "Origin": "https://imgbb.com",
            "Referer": "https://imgbb.com/upload",
            "Referrer-Policy": "strict-origin-when-cross-origin",
            cookie,
            ...form.getHeaders()
          }
        })).data
        if (json.status_code != 200) return resolve({
          developer: global.creator,
          status: false,
          msg: `Failed to Upload!`
        })
        resolve({
          developer: global.creator,
          status: true,
          timeout: 'unknown',
          original: json,
          data: {
            url: json.image.display_url
          }
        })
      } catch (e) {
        console.log(e)
        resolve({
          developer: global.creator,
          status: false,
          msg: e.message
        })
      }
    })
  }
  toVideo = async (str) => {
      return new Promise(async resolve => {
         try {
            const image = Buffer.isBuffer(str) ? str : str.startsWith('http') ? await (await axios.get(str, {
               responseType: 'arraybuffer'
            })).data : str
            let form = new FormData
            form.append('new-image', Buffer.from(image), 'image.webp')
            form.append('new-image-url', '')
            const html = await (await axios.post('https://s7.ezgif.com/webp-to-mp4', form, {
               headers: {
                  "Accept": "*/*",
                  "User-Agent": "Mozilla/5.0 (Linux; Android 6.0.1; SM-J500G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Mobile Safari/537.36",
                  "Origin": "https://ezgif.com",
                  "Referer": "https://ezgif.com/webp-to-mp4",
                  "Referrer-Policy": "strict-origin-when-cross-origin",
                  "sec-ch-ua": '"Chromium";v="107", "Not=A?Brand";v="24"',
                  "sec-ch-ua-platform": "Android",
                  "sec-fetch-dest": "empty",
                  "sec-fetch-mode": "cors",
                  "sec-fetch-site": "same-origin",
                  "x-requested-with": "XMLHttpRequest",
                  ...form.getHeaders()
               }
            })).data
            const $ = cheerio.load(html)
            let File = $('#main > form').find('input[type=hidden]:nth-child(1)').attr('value')
            let token = $('#main > form').find('input[type=hidden]:nth-child(2)').attr('value')
            let Submit = $('#tool-submit-button').find('input').attr('value')
            const Format = {
               file: File,
               token: token,
               convert: Submit
            }
            const proc = await (await axios({
               url: "https://ezgif.com/webp-to-mp4/" + File,
               method: "POST",
               data: new URLSearchParams(Object.entries(Format)),
               headers: {
                  "User-Agent": "Mozilla/5.0 (Linux; Android 6.0.1; SM-J500G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Mobile Safari/537.36",
                  "Origin": "https://ezgif.com",
                  "Referer": "https://ezgif.com/webp-to-mp4",
                  "Referrer-Policy": "strict-origin-when-cross-origin",
                  "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                  "accept-language": "en-US,en;q=0.9,id;q=0.8",
                  "content-type": "application/x-www-form-urlencoded",
                  "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\", \"Google Chrome\";v=\"90\""
               }
            })).data
            const link = cheerio.load(proc)('#output > p.outfile').find('video > source').attr('src')
            if (!link) return resolve({
               creator: global.creator,
               status: false,
               msg: 'Failed to convert!'
            })
            resolve({
               creator: global.creator,
               status: true,
               data: {
                  url: 'https:' + link
               }
            })
         } catch (e) {
            console.log(e)
            resolve({
               creator: global.creator,
               status: false,
               msg: e.message
            })
         }
      })
   }
}