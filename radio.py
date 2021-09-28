from dotenv import load_dotenv

import vlc
import pafy

from calls import *

load_dotenv()

print('Settings up...')

Instance = vlc.Instance()
player = Instance.media_player_new()

top = []


def top_show(args):
    print(top)


def top_get(args):
    global top
    top = getTop()


def play(args):
    player.play()


def pause(args):
    player.pause()


def volume(args=[50]):
    player.audio_set_volume(args[0])


def close(args):
    stop()
    exit()


def change(args):
    audio = pafy.new(args[0])
    best = audio.getbestaudio()
    playurl = best.url
    Media = Instance.media_new(playurl)
    # Media.get_mrl()
    player.set_media(Media)


def stop(args=[]):
    player.stop()


def what(comm):
    options = {
        "play": play,
        "pause": pause,
        "stop": stop,
        "change": change,
        "exit": close,
        "top.show": top_show,
        "top.get": top_get
    }

    args = comm.split(' ')

    if len(comm) > 0:
        print("-> ", comm)
        if args[0] in options:
            options[args[0]](args[1:])


while True:
    comm = input('# ')
    what(comm)
