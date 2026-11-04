# Builds the Android web bundle (www/index.html) from the game sources:
# no ads, no test speed-up, fonts served from www/fonts instead of Google Fonts.
# Usage: python3 game/build_app.py
import os, re, subprocess, sys
here = os.path.dirname(os.path.abspath(__file__))
app = os.path.dirname(here)
tmp = os.path.join(app, '.game.html')
subprocess.run([sys.executable, os.path.join(here, 'build.py'), 'android', tmp], check=True)
body = open(tmp).read(); os.remove(tmp)
faces = open(os.path.join(here, 'fonts.css')).read()
body = re.sub(r'<link rel="preconnect"[^>]*>\n?', '', body)
body = re.sub(r'<link href="https://fonts.googleapis.com[^>]*>\n?', '<style>' + faces + '</style>\n', body)
body = body.replace('<meta name="claude:viewport-fit-sides" content="cover">\n', '')
head = ('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">\n'
        '<style>:root{color-scheme:light;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}'
        'body{margin:0;font:14px/1.4 system-ui,sans-serif}img{max-width:100%}[hidden]{display:none!important}'
        '*{-webkit-touch-callout:none}</style>\n')
marker = '</style>\n\n<div class="app">'
i = body.index(marker) + len('</style>')
out = head + body[:i] + '\n</head>\n<body>\n' + body[i:].lstrip() + '\n</body>\n</html>\n'
open(os.path.join(app, 'www', 'index.html'), 'w').write(out)
print('www/index.html written,', len(out), 'bytes')
