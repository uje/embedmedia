# -*- coding: utf-8 -*--
# Name:        ??1
# Purpose:
#
# Author:      Jame
#
# Created:     01/04/2012
# Copyright:   (c) Jame 2012
# Licence:     <your licence>
#-------------------------------------------------------------------------------


from google.appengine.ext import db
import json, logging

class Anthors(db.Model):
    url=db.StringProperty(multiline=False)
    title=db.StringProperty(multiline=False)
    tag=db.StringProperty(multiline=False)
    addTime=db.DateTimeProperty(auto_now_add=True)
    owner=db.StringProperty(multiline=False)
    def insert(self,title,url,tag,owner):
        existAnthor=db.GqlQuery("SELECT * FROM Anthors WHERE owner=:1 AND title=:2", owner,title).get()
        if existAnthor:
            raise
        anthor=Anthors(url=url,title=title,tag=tag,owner=owner)
        anthor.put()

    def find(self,owner):
        anthors=db.GqlQuery("SELECT * FROM Anthors WHERE owner=:1 ORDER BY tag", owner)
        if anthors:
            return anthors
        return None

    def find_links(self,owner,tag):
        anthors=db.GqlQuery("SELECT * FROM Anthors WHERE owner=:1 AND tag=:2 ORDER BY tag", owner,tag)
        if anthors:
            return anthors
        return None

    def find_link(self,owner,name):
        anthor=db.GqlQuery("SELECT * FROM Anthors WHERE owner=:1 AND title=:2", owner, name).get()
        if anthor:
            return anthor
        return None

    def delete_link(self,owner,title):
       existAnthor=db.GqlQuery("SELECT * FROM Anthors WHERE owner=:1 AND title=:2", owner,title).get()
       if existAnthor:
            Tags().delete_or_change(existAnthor.tag,owner)
            existAnthor.delete()
       else:
            raise
    def getdata(self,anthors):
        data=list()
        for anthor in anthors:
            data.append({
                "url": anthor.url,
                "title": anthor.title,
                "tag": anthor.tag
            })
        return data
    def getjson(self,anthors):
        return json.dumps(self.getdata(anthors))

class Tags(db.Model):
    tagName=db.StringProperty(multiline=False)
    addTime=db.DateTimeProperty(auto_now_add=True)
    count=db.IntegerProperty()
    owner=db.StringProperty(multiline=False)

    def insert_or_change(self,tag,owner):
        oldtag=db.GqlQuery("SELECT * FROM Tags WHERE tagName=:1 AND owner=:2", tag, owner).get()
        if oldtag:
            count=oldtag.count
            oldtag.count+=1
            oldtag.put()
        else:
            t=Tags(tagName=tag,owner=owner,count=1)
            t.put()


    def delete_or_change(self,tag,owner):
        oldtag=db.GqlQuery("SELECT * FROM Tags WHERE tagName=:1 AND owner=:2", tag, owner).get()
        if oldtag:
            if oldtag.count==1:
                oldtag.delete()
            else:
                oldtag.count-=1
                oldtag.put()

    def find(self,owner):
        tags=db.GqlQuery("SELECT * FROM Tags WHERE owner=:1", owner)
        if tags:
            return tags
        return None

    def getjson(self,tags):
        data=list()
        for tag in tags:
            data.append(tag.tagName)

        return json.dumps(data)


class Domains(db.Model):
    domain=db.StringProperty(multiline=False)
    owner=db.StringProperty(multiline=False)
    pwd  = db.StringProperty(multiline=False)
    title=db.StringProperty(multiline=False)
    theme=db.StringProperty(multiline=False)
    addTime=db.DateTimeProperty(auto_now_add=True)
    def insert_or_change(self,domain,owner,title,theme):
        if db.GqlQuery("SELECT * FROM Domains WHERE domain=:1 AND owner!=:2", domain,owner).get():
            raise


        existDomain=db.GqlQuery("SELECT * FROM Domains WHERE owner=:1", owner).get()
        if existDomain:
            if domain:
                existDomain.domain=domain
            if title:
                existDomain.title=title
            if theme:
                existDomain.theme=theme
            existDomain.put()
        else:
            d=Domains(domain=domain,owner=owner,title=title,theme=theme)
            d.put()

    def find(self,owner):
        domain=db.GqlQuery("SELECT * FROM Domains WHERE owner=:1", owner).get()
        if domain:
            return domain
        return None

    def set_pwd(self, owner, pwd):
        domain = find(self, owner)
        if domain:
            domain.pwd = pwd
            domain.put()

    def getOwner(self,d):
       domain=db.GqlQuery("SELECT * FROM Domains WHERE domain=:1", d).get()
       if domain:
            return domain.owner
       else:
            return None


class OAuth(db.Model):
    token=db.StringProperty(multiline=False)
    owner=db.StringProperty(multiline=False)
    def get_oauth_by_token(self,t):
       oauth=db.GqlQuery("SELECT * FROM OAuth WHERE token=:1", t).get()
       if oauth:
            return oauth
       else:
            return None
    def get_oauth_by_owner(self,o):
       oauth=db.GqlQuery("SELECT * FROM OAuth WHERE owner=:1", o).get()
       if oauth:
            return oauth
       else:
            return None

    def insert_or_change(self,owner,token):
        existOAuth=db.GqlQuery("SELECT * FROM OAuth WHERE owner=:1", owner).get()
        if existOAuth:
            if token:
                existOAuth.token=token
                existOAuth.put()
        else:
            o=OAuth(owner=owner,token=token)
            o.put()


class Pages(db.Model):
    name=db.StringProperty(multiline=False)
    title=db.StringProperty(multiline=False)
    html=db.TextProperty()
    showInTop=db.BooleanProperty()
    useFrame = db.BooleanProperty()
    owner=db.StringProperty()
    def exist(self,owner,name):
        if db.GqlQuery("SELECT * FROM Pages WHERE owner=:1 AND name=:2", owner,name).get() is not None:
            return True
        else:
            return False
    def get_page(self,owner,name):
        page=db.GqlQuery("SELECT * FROM Pages WHERE owner=:1 AND name=:2", owner, name)
        if page:
            return page
        else:
            return None
    def get_pages(self,owner):
        pages=db.GqlQuery("SELECT * FROM Pages WHERE owner=:1", owner)
        if pages:
            return pages
        else:
            return None
    def insert(self,owner,name,title,html,showInTop):
        page=db.GqlQuery("SELECT * FROM Pages WHERE owner=:1 AND name=:2", owner, name).get()
        if page:
            raise
        page=Pages(owner=owner,name=name,title=title,html=db.Text(html),showInTop=showInTop)
        page.put()
    def delete_page(self,owner,name):
        page=db.GqlQuery("SELECT * FROM Pages WHERE owner=:1 AND name=:2", owner, name).get()
        if page:
            page.delete()
        else:
            raise

    def change(self,owner,name,oname,title,html,showInTop, useFrame):
        page=db.GqlQuery("SELECT * FROM Pages WHERE owner=:1 AND name=:2", owner, oname).get()
        if page:
            if name and oname!=name:
                page.name=name

            if title:
                page.title=title

            if html:
                page.html=db.Text(html)

            if showInTop is not None:
				page.showInTop = showInTop

            if useFrame is not None:
                page.useFrame = useFrame
                
            page.put()
        else:
            raise



