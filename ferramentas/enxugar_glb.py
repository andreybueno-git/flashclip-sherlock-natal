"""Enxuga um GLB do Tripo para embutir na página: texturas menores em JPEG e índices de 16 bits.
uso: python3 -I enxugar_glb.py entrada.glb saida.glb [lado_da_textura]"""
import struct, json, sys, io
from PIL import Image

ent, sai = sys.argv[1], sys.argv[2]
lado = int(sys.argv[3]) if len(sys.argv) > 3 else 1024
d = open(ent, 'rb').read()
assert d[:4] == b'glTF'
n = struct.unpack('<I', d[12:16])[0]
j = json.loads(d[20:20 + n])
p = 20 + n
m = struct.unpack('<I', d[p:p + 4])[0]
assert d[p + 4:p + 8] == b'BIN\x00'
bin_ = d[p + 8:p + 8 + m]

def fatia(i):
    bv = j['bufferViews'][i]
    o = bv.get('byteOffset', 0)
    return bin_[o:o + bv['byteLength']]

novos = [fatia(i) for i in range(len(j['bufferViews']))]

# texturas
normais = {mt['normalTexture']['index'] for mt in j.get('materials', []) if 'normalTexture' in mt}
img_normal = {j['textures'][t]['source'] for t in normais}
for i, im in enumerate(j.get('images', [])):
    bv = im['bufferView']
    pil = Image.open(io.BytesIO(novos[bv])).convert('RGB')
    if max(pil.size) > lado:
        pil = pil.resize((lado, lado), Image.LANCZOS)
    b = io.BytesIO()
    pil.save(b, 'JPEG', quality=90 if i in img_normal else 82, optimize=True, subsampling=0 if i in img_normal else 2)
    novos[bv] = b.getvalue()
    im['mimeType'] = 'image/jpeg'

# índices de 32 para 16 bits, quando cabem
for me in j['meshes']:
    for pr in me['primitives']:
        a = j['accessors'][pr['indices']]
        nv = j['accessors'][pr['attributes']['POSITION']]['count']
        if a['componentType'] == 5125 and nv < 65536:
            bv = a['bufferView']
            o = a.get('byteOffset', 0)
            vals = struct.unpack('<%dI' % a['count'], novos[bv][o:o + 4 * a['count']])
            assert o == 0 and len(novos[bv]) == 4 * a['count']
            novos[bv] = struct.pack('<%dH' % a['count'], *vals)
            a['componentType'] = 5123

# remonta o buffer
buf = bytearray()
for i, bv in enumerate(j['bufferViews']):
    while len(buf) % 4: buf.append(0)
    bv['byteOffset'] = len(buf)
    bv['byteLength'] = len(novos[i])
    buf += novos[i]
while len(buf) % 4: buf.append(0)
j['buffers'] = [{'byteLength': len(buf)}]
js = json.dumps(j, separators=(',', ':')).encode()
while len(js) % 4: js += b' '
total = 12 + 8 + len(js) + 8 + len(buf)
open(sai, 'wb').write(b'glTF' + struct.pack('<II', 2, total) + struct.pack('<I', len(js)) + b'JSON' + js + struct.pack('<I', len(buf)) + b'BIN\x00' + bytes(buf))
print(len(d), '->', total)
