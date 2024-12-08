# TrackRelay-Server

Server for [TrackRelay](https://github.com/MatthiasBenaets/TrackRelay).
Used for:

- Posting live activity data of Garmin device.
- Visualizing live data as an overlay.
- Visualizing fit file activities as an overlay.

Overlays can then be used on OBS as a browser source.
Either:

- Load a `live` overlay and stream a video via RTMP to obs for live streaming with live data.
- Load a `rec` overlay and post data to the server using the CIQ Simulator using TrackRelay or any other compatible software.

## API

A payload can be posted to `$URL/api/live`.
The expected payload is `Content-Type: application/json`:

```json
{
	"type": "b696f2f3d48d55c34567e416018d7df98cf40840",
	"lat": 51.324,
	"lon": 5.89454,
	"alt": 26.5925,
	"time": 233144916,
	"dist": 51636.3,
	"spd": 9.19073,
	"cad": 170,
	"hr": 148,
	"pwr": 244,
	"avgp": 223,
	"asc": 230.179,
	"desc": 208.382,
	"cal": 1541,
	"grd": -1.0043
}
```

## Variables

Consult `.env.example`.\
Most default settings are recommended.\
Note that some device might not have some fields. For example some have a `speed` datafield, some have a `enhanced_speed` datafield.\
The code is not optimized for this!.\
Fields like `cadence` also can have a different multiplier. This can be tweaked using the environment variable.

## Disclaimer/Notice

- No support will be given, period!
- Do not use for any commercial purposes!
