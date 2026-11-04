import os, sys
flags = sys.argv[1] if len(sys.argv) > 1 else 'web'
out = sys.argv[2] if len(sys.argv) > 2 else os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'web-preview.html')
d=os.path.dirname(os.path.abspath(__file__))
t=open(d+'/template.html').read()
t=t.replace('/*FLAGS*/', 'const ADS = false, DEV = %s;' % ('true' if flags == 'web' else 'false'))
t=t.replace('/*ECON*/',open(d+'/i18n.js').read()+'\n'+open(d+'/econ.js').read()+'\n'+open(d+'/scene.js').read()+'\n'+open(d+'/sfx.js').read()+'\n'+open(d+'/live.js').read()).replace('/*GAME*/',open(d+'/game.js').read())
open(out,'w').write(t)
print('built', len(t))
