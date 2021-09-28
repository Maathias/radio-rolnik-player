from dotenv import load_dotenv

import requests
import json
import os

load_dotenv()

url = os.environ['domain']
secret = os.environ['secret']

headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + secret
}


def updateStatus(tid, progress=None, duration=None, paused=None):
    payload = json.dumps({
        "tid": tid,
        "progress": progress,
        "paused": paused,
        "duration": duration
    })

    response = requests.request(
        "PUT", url + "/player/set/status", headers=headers, data=payload)
    return response.json()


def updateNext(tid):
    payload = json.dumps({
        "tid": tid
    })

    response = requests.request(
        "PUT", url + "/player/set/next", headers=headers, data=payload)
    return response.json()


def getTop():
    response = requests.request(
        "GET", url + "/player/get/top", headers=headers)
    return response.json()
