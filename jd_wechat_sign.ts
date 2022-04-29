/**
 * 微信小程序签到红包
 * cron: 8 0 * * *
 */

import {sendNotify} from './sendNotify'
import {post, requireConfig, wait} from './TS_USER_AGENTS'
import {H5ST} from "./h5st";

let cookie: string = '', res: any = '', UserName: string, msg: string = ''

!(async () => {
  let cookiesArr: string[] = await requireConfig()
  for (let [index, value] of cookiesArr.entries()) {
    cookie = value
    UserName = decodeURIComponent(cookie.match(/pt_pin=([^;]*)/)![1])
    console.log(`\n开始【京东账号${index + 1}】${UserName}\n`)

    let timestamp: number = Date.now(), t: { key: string, value: string }[] = [
      {key: 'appid', value: 'hot_channel'},
      {key: 'body', value: JSON.stringify({"activityId": "10002"})},
      {key: 'client', value: 'android'},
      {key: 'clientVersion', value: '7.16.250'},
      {key: 'functionId', value: 'SignComponent_doSignTask'},
      {key: 't', value: timestamp.toString()},
    ]
    let h5st: string = await new H5ST(t, "9a38a", 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15F79 MicroMessenger/8.0.15(0x18000f2e) NetType/WIFI Language/zh_CN', "6468223550974529").__run()
    res = await post(`https://api.m.jd.com/signTask/doSignTask?functionId=SignComponent_doSignTask&appid=hot_channel&body={"activityId":"10002"}&client=android&clientVersion=7.16.250&t=${timestamp}&h5st=${h5st}`, '', {
      'content-type': 'application/json',
      'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15F79 MicroMessenger/8.0.15(0x18000f2e) NetType/WIFI Language/zh_CN',
      'referer': 'https://servicewechat.com/wx91d27dbf599dff74/581/page-frame.html',
      'cookie': cookie
    })
    if (res.data) {
      console.log('已签到', res.data.signDays, '天，奖励', res.data.rewardValue, '元')
      msg += `【京东账号${index + 1}】  ${UserName}\n已签到  ${res.data.signDays}天\n奖励  ${res.data.rewardValue}元\n\n`
    } else
      console.log(res.message)
    await wait(3000)
  }
  await sendNotify('微信小程序签到红包', msg)
})()