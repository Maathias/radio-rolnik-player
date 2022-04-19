# radio-rolnik Player

## Resources

Website - https://github.com/Maathias/radio-rolnik/

API - https://github.com/Maathias/radio-rolnik-api/

## Requirements

- shell
  - VLC
  - python3
- python
  - python-dotenv
  - python-vlc
  - pafy
  - youtube_dl

## .env

```ini
; api variables
DOMAIN=radio.rolniknysa.pl
SECRET=<server api secret>

; playback volume (0-100)
VOLUME_DEFAULT=100

; playback delay (s)
OFFSET=60

; logging level (0-2)
; 2 = highest
VERBOSE=0
```
