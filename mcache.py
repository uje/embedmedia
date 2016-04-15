# -*- coding: utf-8 -*--
# Name:        模块1
# Purpose:
#
# Author:      Jame
#
# Created:     27/04/2012
# Copyright:   (c) Jame 2012
# Licence:     <your licence>
#-------------------------------------------------------------------------------

from google.appengine.api import memcache
import model,json
import logging

CACHE_TIME=3600*24*10
def getDomain(owner):
    key=owner+ "_domain"
    data=memcache.get(key)
    if data is None:
        logging.warn("read db by key:"+key)
        data=model.Domains().find(owner)
        if data is not None and data!="" and data!={}:
            memcache.set(key=key,value=data,time=CACHE_TIME)
    return data

def getOwner(domain):
    key=domain+ "_owner"
    data=memcache.get(key)
    if data is None:
        logging.warn("read db by key:"+key)
        data=model.Domains().getOwner(domain)
        if data is not None and data!="" and data!={}:
            memcache.set(key=key,value=data,time=CACHE_TIME)

    return data
def clearOwnerCache(domain):
    key=domain+ "_owner"
    memcache.delete(key)

def clear_links_cache(owner):
    key=owner+ "_links"
    memcache.delete(key)

def clear_tags_cache(owner):
    key=owner+ "_tags"
    memcache.delete(key)

def getTags(owner):
    key=owner+ "_tags"
    data=memcache.get(key)
    if data is None:
        logging.warn("read db in gettags by key:"+key)
        data=model.Tags().find(owner)
        if data is not None and data!=""  and data!={}:
            memcache.set(key=key,value=data,time=CACHE_TIME)

    return data

def find_links(owner):
    key=owner+ "_links"
    data=memcache.get(key)
    if data is None:
        logging.warn("read db in find_links by key:"+key)
        data=model.Anthors().find(owner)
        if data is not None and data!=""  and data!={}:
            memcache.set(key=key,value=data,time=CACHE_TIME)
    return data

def find_links_by_tag(owner,tag):
    key=owner + "_links_"+ tag
    data=memcache.get(key)
    if data is None:
        all_data=find_links(owner)
        data=list()
        for item in all_data:
            if item.tag==tag:
                data.append({
                    "url": item.url,
                    "title": item.title,
                    "tag": item.tag
                })

        memcache.set(key=key,value=data,time=CACHE_TIME)

    return data

def fink_links_by_tag(owner,tag):
    key=owner+ "_links_tag"
    data=memcache.get(key)
    if data is None:
        logging.warn("read db in fink_links_by_tag by key:"+key)
        data=model.Anthors().find_links(owner,tag)
        if data is not None and data!=""  and data!={}:
            memcache.set(key=key,value=data,time=CACHE_TIME)
    return data

def get_oauth_by_owner(owner):
    key="oauth_"+owner
    data=memcache.get(key)
    if data is None:
        logging.warn("read db in get_oauth_by_owner by key:"+key)
        data=model.OAuth().get_oauth_by_owner(owner)
        if data is not None and data!=""  and data!={}:
            memcache.set(key=key,value=data,time=CACHE_TIME)
            memcache.set(key="oauth_"+data.token,value=data,time=CACHE_TIME)
    return data

def get_oauth_by_token(token):
    key="oauth_"+token
    data=memcache.get(key)
    if data is None:
        logging.warn("read db by key:"+key)
        data=model.OAuth().get_oauth_by_token(token)
        if data is not None and data!=""  and data!={}:
            memcache.set(key=key,value=data,time=CACHE_TIME)
            memcache.set(key="oauth_"+data.owner,value=data,time=CACHE_TIME)
    return data

def del_oauth_cache(key):
    try:
        memcache.delete("oauth_" + key)
    except:
        pass

def get_cache_page(owner,name):
##    key="page_"+owner+"_"+name
##    data=memcache.get(key)
##    if data is None:
##        data=model.Pages().get_page(owner,name)
##        memcache.set(key=key,value=data,time=CACHE_TIME)
    pages=get_cache_pages(owner)
    for page in pages:
        if page.name==name:
            return page
    return None
def get_cache_pages(owner):
    key="pages_"+owner
    data=memcache.get(key)
    if data is None:
        logging.warn("read db by key:"+key)
        data=model.Pages().get_pages(owner)
        memcache.set(key=key,value=data,time=CACHE_TIME)
    return data

def clear_pages_cache(owner):
    memcache.delete("pages_"+owner)

def clear():
    memcache.flush_all()