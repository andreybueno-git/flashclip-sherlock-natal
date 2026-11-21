"""Recorta as folhas de figurinhas (PNG com fundo transparente, 3 x 2 por folha) em figurinhas
soltas (img/fig-<nome>.webp) e grava as medidas em js/figurinhas.js.
uso: python3 -I ferramentas/figurinhas.py <pasta-com-folha-a.png...> img js/figurinhas.js"""
import sys, os, json
import numpy as np
from PIL import Image

FOLHAS = {
    'a': ['chapeu', 'cachimbo', 'lupa', 'violino', 'coruja', 'porta'],
    'b': ['big-ben', 'onibus', 'cabine', 'ponte', 'carruagem', 'lampiao'],
    'c': ['guarda-chuva', 'cha', 'correio', 'capacete', 'coroa', 'corvo'],
    'd': ['azevinho', 'pudim', 'guirlanda', 'bengala', 'presente', 'globo'],
    'e': ['pizza', 'carta', 'chave', 'relogio', 'carimbo', 'raio'],
    'f': ['consulta', 'vela', 'algemas', 'pegadas', 'caderno', 'lanterna'],
}
LADO = 440

def faixas(soma, n):
    """Divide um eixo em n faixas pelos maiores vãos vazios."""
    cheio = soma > 0
    vaos, i, N = [], 0, len(cheio)
    while i < N:
        if not cheio[i]:
            j = i
            while j < N and not cheio[j]: j += 1
            if i > 0 and j < N: vaos.append((j - i, (i + j) // 2))
            i = j
        else: i += 1
    cortes = sorted(c for _, c in sorted(vaos, reverse=True)[:n - 1])
    assert len(cortes) == n - 1, 'não achei os vãos entre as figurinhas'
    b = [0] + cortes + [N]
    return list(zip(b[:-1], b[1:]))

ent, sai, js = sys.argv[1], sys.argv[2], sys.argv[3]
medidas = {}
for letra, nomes in FOLHAS.items():
    im = Image.open(os.path.join(ent, 'folha-%s.png' % letra)).convert('RGBA')
    a = np.array(im)[:, :, 3] > 24
    linhas = faixas(a.sum(axis=1), 2)
    k = 0
    for (y0, y1) in linhas:
        for (x0, x1) in faixas(a[y0:y1].sum(axis=0), 3):
            bloco = a[y0:y1, x0:x1]
            ys, xs = np.where(bloco)
            caixa = (x0 + xs.min() - 6, y0 + ys.min() - 6, x0 + xs.max() + 7, y0 + ys.max() + 7)
            fig = im.crop(caixa)
            fig.thumbnail((LADO, LADO), Image.LANCZOS)
            nome = nomes[k]; k += 1
            fig.save(os.path.join(sai, 'fig-%s.webp' % nome), 'WEBP', quality=84, method=6, alpha_quality=90)
            medidas[nome] = list(fig.size)
open(js, 'w').write('/* Medidas das figurinhas (gerado por ferramentas/figurinhas.py). */\nwindow.FIGURINHAS = ' + json.dumps(medidas, separators=(',', ':')) + ';\n')
print(len(medidas), 'figurinhas')
