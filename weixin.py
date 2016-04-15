# -*- coding: utf-8 -*-
# Name:        模块1
# Purpose:
#
# Author:      jm
#
# Created:     25/02/2013
# Copyright:   (c) jm 2013
# Licence:     <your licence>
#-------------------------------------------------------------------------------

from google.appengine.ext import db
from google.appengine.api import memcache
from xml.etree import ElementTree as ET
from datetime import timedelta
import logging,webapp2,time, datetime, os
import utils

CACHE_TIME=3600*24*10

class Messages(db.Model):
    keyword=db.StringProperty(multiline=False)
    content=db.StringProperty(multiline=False)

class WeixinHandler(webapp2.RequestHandler):
    def get(self):
        echostr=self.request.get('echostr')
        if utils.weixin_isvalid(self):
            self.response.out.write(echostr)
        else:
            self.response.out.write('error')

    def post(self):
        logging.info(self.request.body)
        if utils.weixin_isvalid(self)==False:
            return

        xml=self.request.body
        root=ET.fromstring(xml)
        to_user=root.findall('./ToUserName')[0].text
        from_user=root.findall('./FromUserName')[0].text
        content=root.findall('./Content')[0].text

        if content=="今日课程".decode('utf-8'):
            message= get_kecheng(datetime.date.today())

        elif content=="明天课程".decode('utf-8'):
            now = datetime.date.today()
            aDay = timedelta(days=+1)
            now = now + aDay

            message= get_kecheng(now)

        elif content.find('课程'.decode('utf-8')) >-1:
            message= get_kecheng(datetime.datetime.strptime(content.replace('课程'.decode('utf-8'), ''), "%Y-%m-%d").date())

        else:
            message=show_cache_message(content)

        if message=="0":
            message="找不到相关信息~"
        output_xml='''<xml>
 <ToUserName><![CDATA[%s]]></ToUserName>
 <FromUserName><![CDATA[%s]]></FromUserName>
 <CreateTime>%s</CreateTime>
 <MsgType><![CDATA[text]]></MsgType>
 <Content><![CDATA[%s]]></Content>
 <FuncFlag>0</FuncFlag>
 </xml>'''%(from_user, to_user, str(time.time()), message)
        self.response.out.write(output_xml)
        logging.info('from %s,content %s response %s',from_user,content, message)

def show_message(k):
    messages=get_all_message()
    for m in messages:
        if k==m.keyword:
            return m.content
    return "0"

def show_alias_message(k):
    messages=get_all_message()
    message="您是不是要找：".decode('utf-8')
    count=0
    for m in messages:
        if k in m.keyword:
            count+=1
            message+="""
"""+ m.keyword
            if count==10:
                break

    if count==0:
        return "0"
    return message.strip(',')


def get_all_message():
    key="messages"
    data=memcache.get(key)
    if data is None:
        data=db.GqlQuery("SELECT * FROM Messages")
        memcache.set(key=key,value=data,time=CACHE_TIME)

    return data


def show_cache_message(keyword):
    message=show_message(keyword)
    if message=="0":
        message=show_alias_message(keyword)

    return message

kecheng={
    1: {
        "name": "高等数学".decode('utf-8'),
        "teacher":"游亚新".decode('utf-8'),
        "mobile": "13342886536",
        "time": "晚上（19：00--21：10）".decode('utf-8'),
        "weeks":{
            "2,3,4,5,6,7,8,9,10,11,12": "11号楼北302".decode('utf-8')
        }
        
    },
    3: {
        "name": "编程基础".decode('utf-8'),
        "teacher":"鲍镇邦".decode('utf-8'),
        "mobile": "13570706200",
        "time": "晚上（19：00--21：10）".decode('utf-8'),
        "weeks": {
            "1,3,4,5,7,9,11,13,15,16,17": "5号楼南209".decode('utf-8'),
            "6,8,10,12,14": "5号楼南515上机".decode('utf-8')
        }
    },
    4: {
        "name": "英语".decode('utf-8'),
        "teacher":"王永平".decode('utf-8'),
        "time": "晚上（19：00--21：10）".decode('utf-8'),
        "mobile": "13560436375",
        "weeks":{
            "1,2,3,4,5,6,7,8,9,10,11,12": "5号楼北507".decode('utf-8')
        }
    },
    7: {
        "name": "法律基础".decode('utf-8'),
        "teacher":"饶先稳".decode('utf-8'),
        "mobile": "13580385951",
        "time": "下午（15:40—17:50）".decode('utf-8'),
        "weeks":{
            "2,3,7,8,9,10,11,12,13,14,15": "5号楼南812".decode('utf-8')
        }
    }
}


def get_kecheng(date):

    result= "0"
    weekday= date.isoweekday()
    start_date= datetime.date(2013, 9, 1)


    # 算出当前时间与开始时间相差多少天
    days= (date - start_date).days

    # 算出总共有多少周
    weekCount= days / 7

    #logging.log("date: %s", str(date))

    # 有余数则加1
    if days % 7 > 0:
        weekCount+= 1

    # 检测课程是否存在
    if weekday in kecheng:
        _kecheng= kecheng[weekday]

        for week,addr in _kecheng["weeks"].items():
            if week.find(str(weekCount)) != -1:
                result= _kecheng["name"] + "（第".decode("utf-8") + str(weekCount) + "周）".decode("utf-8") + "\n"
                result+= "老师：".decode('utf-8') + _kecheng["teacher"] + "\n"
                result+= "手机：".decode('utf-8') + _kecheng["mobile"] + "\n"
                result+= "地址：".decode('utf-8') + addr + "\n"
                result+= "日期：".decode('utf-8') + str(date) + ', ' + _kecheng["time"] + "\n"
                break

    return result


    #return _kecheng["name"] + _kecheng["time"]
