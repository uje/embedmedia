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

import webapp2
from google.appengine.ext.webapp import util
from google.appengine.api import users
import model,utils,json,mcache
from google.appengine.ext import db
import logging


class AddFavHandler(webapp2.RequestHandler):
    def post(self):
        self.add_fav()
    def get(self):
        self.add_fav()
    def add_fav(self):
        json=""
        token=self.request.get('token')
        name=self.request.get('name')
        url=self.request.get('url')
        tag=self.request.get('tag')
        if token is None or token.strip()=="":
            json='{"code":1}'

        if name is None or name.strip()=="":
            json='{"code":2}'

        if url is None or url.strip()=="":
            json='{"code":3}'

        if tag is None or tag.strip()=="":
            tag="Chrome"

        if json=="":
            oauth=mcache.get_oauth_by_token(token)
            if oauth is None:
                json='{"code":4}'
            else:
                try:
                    model.Anthors().insert(name,url,tag,oauth.owner)
                    model.Tags().insert_or_change(tag,oauth.owner)
                    mcache.clear_links_cache(oauth.owner)
                    mcache.clear_tags_cache(oauth.owner)
                    json='{"code":200}'
                except:
                    json='{"code":500}'

        self.response.out.write(json)

class GetTagsHandler(webapp2.RequestHandler):
    def post(self):
        json_str=""
        token=self.request.get('token')
        if token is None or token.strip()=="":
            json_str='{"code":1}'
        else:
            oauth=mcache.get_oauth_by_token(token)
            tags=mcache.getTags(oauth.owner)
            data=list()
            for t in tags:
                data.append(t.tagName)

            json_str=json.dumps(data)

        self.response.out.write(json_str)

class GetLinksHandler(webapp2.RequestHandler):
    def get(self):
        self.getLinks()
    def post(self):
        self.getLinks()
    def getLinks(self):
        json_str=""
        tag=self.request.get('tag')
        token=self.request.get('token')
        if tag is None or tag=={} or tag=="":
            json_str='{"code":4}'
        if token is None or token.strip()=="":
            json_str='{"code":1}'
        if json_str=="":
##            try:
            oauth=mcache.get_oauth_by_token(token)
            data=mcache.find_links_by_tag(oauth.owner,tag)
            json_str=json.dumps(data)
##            except:
##                json_str='{"code":500}'

        self.response.out.write(json_str)

class GetMyLinksHandler(webapp2.RequestHandler):
    def get(self):
        self.getLinks()
    def post(self):
        self.getLinks()
    def getLinks(self):
        json_str=""
        token=self.request.get('token')
        if token is None or token.strip()=="":
            json_str='{"code":1}'
        if json_str=="":
##            try:
            oauth=mcache.get_oauth_by_token(token)
            json_str=model.Anthors().getjson(mcache.find_links(oauth.owner))
##            except:
##                json_str='{"code":500}'

        self.response.out.write(json_str)

class TestHandler(webapp2.RequestHandler):
    def get(self):
        logging.info('API.Test')
        logging.warn('API.Test')
        logging.error("API.Test")
        self.response.out.write("It's work!")

app = webapp2.WSGIApplication([('/api/addfav',AddFavHandler),
                               ('/api/gettags', GetTagsHandler),
                               ('/api/getmylinks', GetMyLinksHandler),
                               ('/api/getlinks', GetLinksHandler),
                               ('/api/test', TestHandler)],
                              debug=True)
