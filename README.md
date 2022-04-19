# radio-rolnik Player

## Resources

Frontend - [Maathias/radio-rolnik](https://github.com/Maathias/radio-rolnik/)

API - [Maathias/radio-rolnik-api](https://github.com/Maathias/radio-rolnik-api/)

## Requirements

- shell
  <!-- - VLC -->
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

; logging level (0-2) 2 = most verbose
VERBOSE=0
```

## Usage

`./run <mode>` to run in specified mode.

`standalone` is the default.
- Fetches a list of track IDs to be played,
- converts them to youtube links,
- downloads and caches them,
- schedules timestamps at which they should be played,
- calls timeouts for every track

At the end of every sections, the audio automatically fades down. At the end of queue, process exits.

`web`, `lyrics`, `convert`, `cache`, `schedule`, `test`, `playlist` are also available, but not very functional.

Very much work in progress, very buggy and unstable. 