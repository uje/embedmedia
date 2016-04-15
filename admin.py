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

import webapp2,uuid
from google.appengine.ext.webapp import util
from google.appengine.api import users
import model,utils,json,mcache
from google.appengine.ext import db
import logging

class MainHandler(webapp2.RequestHandler):
    def get(self):
        if utils.isLogin():
            #domain=model.Domains().find(utils.getOwner())
            #using cache
            domain=mcache.getDomain(utils.getOwner())
            if domain:
                domain={
                    "title":domain.title,
                    "domain":domain.domain,
                    "owner":domain.owner,
                    "themeName":domain.theme,
                    "theme":utils.gettheme_by_path(domain.theme)
                }
            else:
                self.redirect('/admin/guide')
                return

            oauth=mcache.get_oauth_by_owner(domain["owner"])
            if oauth is None:
                oauth=model.OAuth(owner=domain["owner"],token=utils.getGuid())
                oauth.put()


            temp_values={
                "domain":domain,
                "theme": utils.theme,
                "domainjson":json.dumps({"code":200,"data":domain}),
                "id": oauth.token
            }
            self.response.out.write(utils.render('template/admin.html',temp_values))
        else:
            self.redirect('admin/login')
            #self.redirect(users.create_login_url(self.request.url))

class LoginHandler(webapp2.RequestHandler):
    def get(self):
        self.response.out.write(utils.render('template/login.html', {}))
    def post(self):
        uid = self.request.get('uid')
        pwd = self.request.get('pwd')

        if uid == "":
            self.response.out.write(json.dumps({ "message": "帐户为空！" }))
            return

        if pwd == "":
            self.response.out.write(json.dumps({ "message": "密码为空！" }))
            return

        domain = model.Domains().find(uid)
        if domain:
            if domain.pwd is None or domain.pwd == '':
                domain.pwd = pwd
                utils.login(domain.owner)
                self.response.out.write(json.dumps({ "code": 200 }))
            elif domain.pwd == pwd:
                utils.login(domain.owner)
                self.response.out.write(json.dumps({ "code": 200 }))
            else:
                self.response.out.write(json.dumps({ "message": "密码不匹配！" })) 
        else:
           self.response.out.write(json.dumps({ "message": "帐户不存在！" })) 


class LogoutHandler(webapp2.RequestHandler):
    def get(self):
        utils.logout()
        self.redirect('/')


class AddFavHandler(webapp2.RequestHandler):
    def get(self):
        self.response.out.write('access Permission')
    def post(self):
        if utils.isLogin():
            title=self.request.get('title')
            url=self.request.get('url')
            tag=self.request.get('tag')

            if title=="" or url=="" or tag=="":
                self.response.out.write(json.dumps({"code":500 }))
                return

            owner=utils.getOwner()
            if title and tag and url:
                try:
                    model.Anthors().insert(title=title,url=url,tag=tag,owner=owner)
                    model.Tags().insert_or_change(tag,owner)
                    mcache.clear_links_cache(owner)
                    mcache.clear_tags_cache(owner)
                    self.response.out.write(json.dumps({"code":200}))
                except:
                    self.response.out.write(json.dumps({"code":501}))

            else:
                self.response.out.write(json.dumps({"code":500}))
        else:
            self.redirect(users.create_login_url(self.request.url))


class DomainHandler(webapp2.RequestHandler):
    def post(self):
        if utils.isLogin()==False:
           self.response.out.write(json.dumps({"code":403}))
           return
        name=self.request.get('name')
        domain=self.request.get('domain')
        theme=self.request.get('theme')

        if name is None:
            self.response.out.write(json.dumps({"code":501}))
        if domain is None:
            self.response.out.write(json.dumps({"code":502}))
        if theme is None:
            theme=utils.theme[0].path
        try:
            model.Domains().insert_or_change(domain,utils.getOwner(),name,theme)
            self.response.out.write(json.dumps({"code":200}))
            mcache.clear()
        except:
            self.response.out.write(json.dumps({"code":500}))


class DeleteLinkHandler(webapp2.RequestHandler):
    def post(self):
        if utils.isLogin()==False:
           self.response.out.write(json.dumps({"code":403}))
           return
        name=self.request.get("name")
        try:
            names=name.split(",")
            for n in names:
                try:
                    model.Anthors().delete_link(utils.getOwner(),n)
                except:
                    continue

            mcache.clear()
            self.response.out.write(json.dumps({"code":200}))
        except:
            self.response.out.write(json.dumps({"code":500}))


class LinkChangeHandler(webapp2.RequestHandler):
    def post(self):
        if utils.isLogin()==False:
           self.response.out.write(json.dumps({"code":403}))
           return
        orig_title=self.request.get("origTitle")
        title=self.request.get("title")
        url=self.request.get("url")
        tag=self.request.get("tag")

        if title=="" or url=="" or tag=="":
            self.response.out.write(json.dumps({"code":500 }))
            return

        link=model.Anthors().find_link(utils.getOwner(),orig_title)
        if link is None:
            self.response.out.write(json.dumps({"code":500 }))
            return

        try:
            if link.title!=title:
                link.title=title
            if link.url!=url:
                link.url=url
            if link.tag!=tag:
                link.tag=tag
                model.Tags().insert_or_change(tag,utils.getOwner())
                model.Tags().delete_or_change(link.tag,utils.getOwner())

            link.put()
            mcache.clear()
            self.response.out.write(json.dumps({"code":200}))
        except:
            self.response.out.write(json.dumps({"code":500}))

class ErrorHandler(webapp2.RequestHandler):
    def get(self,u):
        self.response.out.write('page not found')


class GetLinksHandler(webapp2.RequestHandler):
    def get(self):
            if utils.isLogin()==False:
               self.response.out.write(json.dumps({"code":403}))
               return
            links=list()
            anthors=model.Anthors()
            tag=self.request.get('tag')
            if tag:
                #links=anthors.find_links(utils.getOwner(),tag)
                #using cache
                links=mcache.fink_links_by_tag(utils.getOwner(),tag)
            else:
                #links=anthors.find(utils.getOwner())
                #using cache
                links=mcache.find_links(utils.getOwner())
            self.response.out.write(anthors.getjson(links))

class GuideHandler(webapp2.RequestHandler):
    def get(self):
        if utils.isLogin()==False:
            self.redirect(users.create_login_url(self.request.url))
        else:
            domain=mcache.getDomain(utils.getOwner())
            if domain is None:
                self.response.out.write(utils.render("template/guide.html",{
                    "themes":utils.theme,
                    "domain":{
                        "themeName":"basev3",
                        "title":"风语"
                    }
                }))
            else:
                self.redirect('/admin')

class NewTokenHandler(webapp2.RequestHandler):
    def get(self):
        if utils.isLogin():
            token=utils.getGuid()
            domain=mcache.getDomain(utils.getOwner())
            old_oauth=mcache.get_oauth_by_owner(domain.owner)
            oauth=model.OAuth().insert_or_change(domain.owner,token)
            mcache.del_oauth_cache(old_oauth.owner)
            mcache.del_oauth_cache(old_oauth.token)
            self.response.out.write(token)

#####页面区域#####

class PagesHandler(webapp2.RequestHandler):
    def get(self):
        if utils.isLogin()==False:
            self.redirect(users.create_login_url(self.request.url))
        else:
            tmp={
                "theme":utils.theme,
                "domain":{
                    "themeName":"basev1"
                },
                "pages":mcache.get_cache_pages(utils.getOwner())
            }
            self.response.out.write(utils.render("template/pages.html",tmp))

class PageGetHandler(webapp2.RequestHandler):
    def post(self):
        name=self.request.get('name')
        if utils.isLogin()==False:
            raise
        else:
            page=mcache.get_cache_page(utils.getOwner(),name)
            self.response.out.write(json.dumps({"name":page.name,"title":page.title,"html":page.html,"showInTop":page.showInTop, "useFrame": page.useFrame}))

class PageAddHandler(webapp2.RequestHandler):
    def post(self):
        if utils.isLogin()==False:
            raise
        name=self.request.get('name')
        title=self.request.get('title')
        html=self.request.get('html')
        _showInTop = self.request.get('showInTop')
        _useFrame = self.request.get('useFrame')
        useFrame = False
        showInTop = False
        if name is None or name=="":
            raise
        if title is None or title=="":
            raise
        if html is None or html=="":
            raise
        if model.Pages().exist(utils.getOwner(),name):
            self.response.out.write('{"code":503}')
            return
        if _showInTop=="1":
			showInTop=True

        if _useFrame == "1":
            useFrame = True

        page=model.Pages(owner=utils.getOwner(),name=name,title=title,html=html,showInTop=showInTop, useFrame = useFrame)
        page.put()
        self.response.out.write('{"code":200}')
class PageChangeHandler(webapp2.RequestHandler):
    def post(self):
        if utils.isLogin()==False:
            raise
        oname=self.request.get('oname')
        name=self.request.get('name')
        title=self.request.get('title')
        html=self.request.get('html')
        _showInTop=self.request.get('showInTop')
        _useFrame = self.request.get('useFrame')
        useFrame = False
        showInTop=False
        if name is None and title is None and html is None:
            raise
        if _showInTop=="1":
			showInTop=True

        if _useFrame == "1":
            useFrame = True

        model.Pages().change(utils.getOwner(),name,oname,title,html,showInTop,useFrame)
        mcache.clear_pages_cache(utils.getOwner())
        self.response.out.write('{"code":200}')

class PageDeleteHandler(webapp2.RequestHandler):
    def post(self):
        if utils.isLogin()==False:
            raise
        name=self.request.get("name")
        if name is None or name=="":
            raise self.error("name is empty")
        else:
            model.Pages().delete_page(utils.getOwner(),name)
            self.response.out.write('{"code":200}')




app = webapp2.WSGIApplication([('/admin/addfav',AddFavHandler),
                                ('/admin/pages', PagesHandler),
                                ('/admin/domainchange', DomainHandler),
                                ('/admin/dellink', DeleteLinkHandler),
                                ('/admin/getlinks',GetLinksHandler),
                                ('/admin/linkchange',LinkChangeHandler),
                                ('/admin/guide', GuideHandler),
                                ('/admin/newtoken', NewTokenHandler),
                                ('/admin/getpage', PageGetHandler),
                                ('/admin/addpage', PageAddHandler),
                                ('/admin/pagedelete', PageDeleteHandler),
                                ('/admin/pagechange', PageChangeHandler),
                                ('/admin/login', LoginHandler),
                                ('/admin/logout', LogoutHandler),
                                ('/admin/?', MainHandler),
                                ('(.*)',ErrorHandler)],
                              debug=True)
