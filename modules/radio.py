from dotenv import load_dotenv

import vlc
import pafy
import json
from time import sleep

load_dotenv()

Instance = vlc.Instance()
player = Instance.media_player_new()


def info(type, data):
    print(json.dumps([type] + data))


def play(args):
    player.play()
    info('ok', ['playing', True])


def pause(args):
    player.pause()
    info('ok', ['pause', True])


def volume(args):
    vol, *args = args

    player.audio_set_volume(vol)
    info('ok', ['volume', vol])


def fadeOut(args):
    duration, *args = args

    vol = player.audio_get_volume()

    for v in range(vol, 0, -1):
        player.audio_set_volume(v)
        sleep(duration / vol)

    stop()
    info('ok', ['faded out', True])


def fadeIn(args):
    duration, target, *args = args

    play()

    for v in range(0, target):
        player.audio_set_volume(v)
        sleep(duration / target)

    info('ok', ['faded in', True])


def close(args):
    stop()
    exit()


def change(args):
    url, *args = args

    audio = pafy.new(url)
    best = audio.getbestaudio()
    playurl = best.url
    Media = Instance.media_new(playurl)
    # Media.get_mrl()
    player.set_media(Media)
    info('ok', ['changed', url])


def stop(args=[]):
    player.stop()
    info('ok', ['stop', True])


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
