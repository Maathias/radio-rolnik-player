from dotenv import load_dotenv

import vlc
import pafy
import requests
import json
from time import sleep

load_dotenv()

Instance = vlc.Instance()
player = Instance.media_player_new()


def info(type, data):
    print(json.dumps([type] + data))


def play(args):
    player.play()
    info('play', ['done'])


def pause(args):
    player.pause()
    info('pause', ['done'])


def volume(args):
    vol, *args = args

    result = player.audio_set_volume(vol)
    info('volume', ['set', vol, result])


def fadeOut(args):
    duration, *args = args

    vol = player.audio_get_volume()

    for v in range(vol, 0, -1):
        player.audio_set_volume(v)
        sleep(duration / vol)

    pause([])
    info('fadeOut', ['done'])


def fadeIn(args):
    duration, target, *args = args

    play()

    for v in range(0, target):
        player.audio_set_volume(v)
        sleep(duration / target)

    info('fadeIn', ['done'])


def close(args):
    stop()
    exit()


def change(args):
    target, *args = args

    def get(url):
        info('change', ['get', url])
        audio = pafy.new(url)
        best = audio.getbestaudio(preftype="webm")
        return best.url

    def check(url):
        info('change', ['check', url])
        try:
            r = requests.head(url)
            info('change', ['check', r.status_code])
            return r.status_code
        except requests.ConnectionError:
            info('change', ['check', 'failed'])
            return 600

    playurl = get(target)
    tries = 0

    while check(playurl) >= 400 and tries < 10:
        playurl = get(target)
        tries += 1

    if tries == 10:
        return info('change', ['failed'])

    Media = Instance.media_new(playurl)
    # Media.get_mrl()
    player.set_media(Media)
    info('change', ['done', target])


def stop(args=[]):
    player.stop()
    info('stop', ['done'])


def what(comm):
    options = {
        "play": play,
        "pause": pause,
        "stop": stop,
        "change": change,
        "volume": volume,
        "fade.out": fadeOut,
        "fade.in": fadeIn,
        "exit": close
    }

    type, *data = json.loads(comm)

    if type == 'command':
        comm, *args = data

        if comm in options:
            options[comm](args)
        else:
            info('err', ['comm not found'])


while True:
    comm = input(json.dumps(('waiting', True)))
    what(comm)
