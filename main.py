# -*- coding: utf-8 -*-
#!/usr/bin/env python
#
# Copyright 2007 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
# modify in 2012-4-27

from google.appengine.ext.webapp import util
from google.appengine.api import users
from google.appengine.api import images
from google.appengine.api import mail
from hashlib import md5
from xml.etree import ElementTree as ET
import os,re,cgi,time
import webapp2
import logging
import utils,model,mcache,weixin


class MainHandler(webapp2.RequestHandler):
    def get(self):
        #owner=model.Domains().getOwner(utils.getDomain(self))
        #owner='test@example.com'
        #using cache
        if utils.isTrashDomain(self):
            return

        if utils.getDomain(self)=="www.ruguo.info":
            self.showMuuouPage()
            return

        owner=mcache.getOwner(utils.getDomain(self))

        if owner is None or owner== "":
            self.redirect("/error")
            return

        #domain=model.Domains().find(owner)
        #using cache
        domain=mcache.getDomain(owner)
        if domain:
            domain={
                "title":domain.title,
                "domain":domain.domain,
                "owner":domain.owner,
                "themeName":"basev1"
            }
        else:
            domain={
                "themeName":"basev1"
            }


        temp_values={
            "domain":domain,
            "pages":mcache.get_cache_pages(owner)
        }
        cur_theme=utils.gettheme_by_path(domain["themeName"])
        temp_path="template/"+cur_theme["tmpl"]
        html=utils.render(temp_path,temp_values)
        self.response.headers["cache-control"]="public;max-age=3600"
        self.response.out.write(html)


    def showMuuouPage(self):
        self.response.out.write(utils.render("template/muuou.html",{
            "domain":{
                "themeName":"basev1",
                "pages":[],
                "title":"风语"
            }
        }))



class GetLinkHandler(webapp2.RequestHandler):
    def get(self):
        #owner=model.Domains().getOwner(utils.getDomain(self))
        #owner='test@example.com'
        #using cache

        jsonp= self.request.get('callback')
        owner=mcache.getOwner(utils.getDomain(self))

        if owner is None or owner== "":
            self.redirect("/error")
            return

        links=model.Anthors()

        self.response.content_type="text/plain"
        self.response.headers["cache-control"]="public;max-age=120"
        #self.response.out.write(links.getjson(links.find(owner)))
        #using cache
        if jsonp is not None and jsonp is not '':
            self.response.out.write(jsonp+ '(' + links.getjson(mcache.find_links(owner)) + ')')
        else:
            self.response.out.write(links.getjson(mcache.find_links(owner)))


class LogoutHandler(webapp2.RequestHandler):
    def get(self):
        self.redirect(users.create_logout_url('/'))

class SignupHandler(webapp2.RequestHandler):
    def get(self):
        self.response.out.write(utils.render("template/signup.html",{
            "domain":{
                "themeName":"basev1",
                "title":"风语"
            }
        }))

class ErrorHandler(webapp2.RequestHandler):
    def get(self):
        self.response.out.write('该页面不存在,地址为:%s' % self.request.url)
        self.error(404)

class PageHandler(webapp2.RequestHandler):
    def get(self,name):
        if utils.isTrashDomain(self):
            return
        owner = mcache.getOwner(utils.getDomain(self))
        if owner is None:
            return
        ##owner='test@example.com'
        html = ''
        domain = mcache.getDomain(owner)
        domain.themeName = domain.theme
        page = mcache.get_cache_page(owner,name[1:])
        if page:
            if page.useFrame is True:
                tmp={
                    "title":page.title,
                    "content":utils.unescape(page.html),
                    "domain":domain,
                    "name":page.name,
                    "pages":mcache.get_cache_pages(owner)
                }
                html = utils.render("template/blank.html",tmp)
            else:
                html = utils.unescape(page.html)

            self.response.out.write(html)
        else:
            self.response.out.write('该页面不存在')
            self.error(404)

class IPHandler(webapp2.RequestHandler):
    def get(self):
        self.response.out.write(self.request.remote_addr)

class WeiboHandler(webapp2.RequestHandler):
    def get(self):

##        owner=mcache.getOwner(utils.getDomain(self))
##        if owner is None:
##            return
        self.response.out.write(utils.render("template/timeline.html",{
            "domain":{
                "themeName":"basev3",
                "title":"风语"
            }
        }))


app = webapp2.WSGIApplication([('/', MainHandler),
                                        ('/ip', IPHandler),
                                        ('/signup' , SignupHandler),
                                        ('/timeline', WeiboHandler),
                                        ('/logout',LogoutHandler),
                                        ('/getlinks', GetLinkHandler),
                                        ('/weixinhelper', weixin.WeixinHandler),
                                        ('/error', ErrorHandler),
                                        ('(.+)',PageHandler)],
                              debug=True)
