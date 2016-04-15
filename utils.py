# -*- coding: utf-8 -*--
# Name:        模块1
# Purpose:
#
# Author:      Jame
#
# Created:     11/04/2012
# Copyright:   (c) Jame 2012
# Licence:     <your licence>
#-------------------------------------------------------------------------------

from google.appengine.ext.webapp import template
from google.appengine.api import users
from google.appengine.ext import db
import os,re
import datetime,time
import uuid,hashlib
from gaesessions import get_current_session

redomain='http:\/\/(.+)\.[^.]+\.com'
re_muuou_domain='([^.]+)\.muuou\.com'
redomain2='([^:]+)'
theme=[{
        "path":"basev1",
        "name":"基本版",
        "tmpl":"mainv2.html"
    },{
        "path":"basev2",
        "name":"基本版v2",
        "tmpl":"mainv2.html"
    },{
        "path":"haiyan",
        "name":"海燕专用版",
        "tmpl":"mainv2.html"
    },{
        "path":"basev3",
        "name":"主题3",
        "tmpl":"mainv3.html"
    }]

def render(path,values):
    path=os.path.join(os.path.dirname(__file__), path)
    return template.render(path,values)

def isLogin():
    return get_current_session().has_key("user")
    #return users.get_current_user() is not None

def login(user):
    get_current_session()["user"] = user

def logout():
    get_current_session().terminate()

def getOwner():
    return get_current_session()["user"]
    #return users.get_current_user().email()

def getGuid():
    return str(uuid.uuid1()).replace("-","")

def getDomain(self):
    return re.compile(redomain2,re.IGNORECASE).sub(r"\1",self.request.host)

def getSubDomain(self):
    return re.compile(re_muuou_domain,re.IGNORECASE).sub(r"\1",self.request.host)

def gettheme_by_path(path):
    for t in theme:
        if t["path"]==path:
            return t

    return None

def gettheme_by_name(name):
    for t in theme:
        if t["name"]:
            return t

    return None
def sha1_str(str):
    mySha1 = hashlib.sha1()
    mySha1.update(str)
    return mySha1.hexdigest()


def isTrashDomain(self):
    domain=getDomain(self)
    if "_wildcard_" in domain:
        self.response.out.write('laji')
        return True
    else:
        return False


def isMuuouDomain(self):
    return "muuou.com" in self.request.url

def unescape(data, entities={}):
    """Unescape &amp;, &lt;, and &gt; in a string of data.

    You can unescape other strings of data by passing a dictionary as
    the optional entities parameter.  The keys and values must all be
    strings; each key will be replaced with its corresponding value.
    """
    data = data.replace("&lt;", "<")
    data = data.replace("&gt;", ">")
    if entities:
        data = __dict_replace(data, entities)
    # must do ampersand last
    return data.replace("&amp;", "&")


def weixin_isvalid(self):
    sign=self.request.get('signature')
    timestamp=self.request.get('timestamp')
    nonce=self.request.get('nonce')
    echostr=self.request.get('echostr')
    token='yuanhe'
    sorted_dict=sorted([timestamp,nonce,token])
    dict_str=''.join(sorted_dict)
    localsign=sha1_str(dict_str)
    if localsign==sign:
        return True
    return False
