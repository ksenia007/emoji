#code to obtain twitter posts using the passed in search queue
# -*- coding: utf-8 -*- 
from secrets import *
import tweepy
import numpy as np
import time
import re
import json

import sys

import os

first_arg = sys.argv[1]

def checkIfImageExists(imageName):
    #uses EmojiOne library
    fullExtension='assets/emojiLibrary/'+imageName+'.png'
    if os.path.isfile(fullExtension):
        return True
    else:
        return False
    

def extractName(w):
    #assume the string passed in the form \U0001f3cb\ufe0f\u200d\u2640\ufe0f\U0001f642\U0001f44d
    #we would like to extract the full extension - throw out the middle 
    # (remove skin color option, use yellow due to limited number of source images/overall complexity w/ updates to new iOS)
    # keep gender
    # check if the image exists in our library
    # if so - add it
    if len(w)<10:
        return ""
    firstU=w.find('\\U')
    locEnd=firstU+10 #\U0001f3cb
    #get 1f3cb
    firstPart=w[5:10]
    skin=np.array(['1f3fb','1f3fc','1f3fd','1f3fe','1f3ff'])
    if firstPart in skin: #color circle emoji in the set 
        return ""
    w=w[locEnd:] #we have \ufe0f\u200d\u2640\ufe0f\U0001f642\U0001f44d

    if (len(w)<6):
        #check the presence of the file
        #print(firstPart)
        if checkIfImageExists(firstPart):
            return firstPart
        else:
            return ""
    #loop through to find the gender if we have it
    secondPart=''
    while len(w)>=6 and w[0]=='\\' and w[1]=='u':
        if w[2:6]=='2640':
            secondPart='2640'
            break
        elif w[2:6]=='2642':
            secondPart='2642'
            break
        w=w[6:]
    if len(secondPart)>1:
        #check the presence of the gender version
        #if none - check the presence of non gender
        if checkIfImageExists(firstPart+'-'+secondPart):
            return firstPart+'-'+secondPart
        print('at the end '+firstPart)
        if checkIfImageExists(firstPart):
            return firstPart
    if checkIfImageExists(firstPart):
        return firstPart
    return ""




def getTweetsBasedOnSearch(searchLine=""):
    collTweetsMaxsss=210

    #for search api, 500 characters max
    
    #log in twitter api
    auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
    auth.set_access_token(access_token, access_token_secret)
    api = tweepy.API(auth)

    # try:
    tweetsCollected=0
    tweetsList=np.array(['Search line: '+searchLine])
    nameTxt='emoji.txt'

    #change searchline to add specifics to the results:
    # no retweets
    searchLine+='-filter:retweets'+' filter:safe'
  
    last_id=-1
    while tweetsCollected<collTweetsMaxsss:
        try:
            #we want tweets in English
            searchRes = api.search(searchLine,tweet_mode='extended',lang='en',count=100, max_id=str(last_id-1))
            
            #print(searchRes)
            if not searchRes:
                #out of posts
                break
            else:
                for i in range(0,len(searchRes)):
                    #get full text of the tweet
                    textLocal=searchRes[i].full_text.encode('unicode-escape')

                    #print json.dumps(searchRes[i], indent=4)
                    urlRefer=searchRes[i].user.name
                    #remove the split to the next line (aka 'enter')
                    textLocal = textLocal.replace('\n',' ')
                    #split every word
                    textLocal=textLocal.split(' ')
                    #initialize a string to add new tweets
                    #for every word in tweet
                    for word in textLocal:  
                        #check if it is a word, not a mention and not via
                        if len(word)>1 and not '@' in word and word!='via':
                            #do not add links
                            if 'http' in word:
                                continue
                            #check if it is an emodji:
                            #if (word[0]=='\\' and word[1]=='U'):
                             #   print(word)

                            #deal with separate cases: each one is \U0001f602 is 10, with \+U counted
                            w=word
                            while (len(w)>10 and w.find('\\U')!=-1):
                                finalForm=extractName(w)
                                # print(w)
                                loc=w.find('\\U')
                                locEnd=loc+10

                                if len(finalForm)>1:
                                    tweetsList=np.append(tweetsList,finalForm.decode('unicode-escape').encode('utf8'))
                                    tweetsCollected+=1
                                    print(urlRefer)
                                w=w[locEnd:]

            #update last id for the following search
            last_id = searchRes[-1].id      
        #catch error - most expected is the 'out of rate limit'
        # so we wait 15 mins
        except tweepy.TweepError:
            #save txt just in case
            np.savetxt(nameTxt,tweetsList,delimiter=" ", fmt="%s")
            print('Error with the search, expect it is API rate limit. Wait 920 seconds')
            time.sleep(920)

    #save the resulting file    
    np.savetxt(nameTxt,tweetsList,delimiter=" ", fmt="%s")

if __name__ == "__main__":
    getTweetsBasedOnSearch(first_arg)
