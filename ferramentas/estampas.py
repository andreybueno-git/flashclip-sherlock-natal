"""Transforma as gravuras geradas (preto sobre branco) em tinta com transparência.

uso: python3 ferramentas/estampas.py <pasta-com-os-PNG> img js/estampas.js
Cada PNG vira img/est-<nome>.webp: a cor é a tinta do tema e o alfa vem do escuro do traço,
de modo que o branco some e a gravura parece impressa no papel do slide.
"""
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image

TINTA = (28, 23, 18)
MAIOR_LADO = 780


def processar(origem: Path, destino: Path):
    im = Image.open(origem).convert('L')
    a = np.asarray(im).astype(np.float32)
    # níveis: o papel (claro) vira transparente e o traço fica cheio
    branco = np.percentile(a, 99.5)
    branco = min(branco, 250.0) - 14.0
    preto = 38.0
    alfa = np.clip((branco - a) / (branco - preto), 0.0, 1.0)
    alfa = np.power(alfa, 0.9)
    # recorta no desenho, com uma folga
    forte = alfa > 0.12
    linhas = np.where(forte.any(axis=1))[0]
    colunas = np.where(forte.any(axis=0))[0]
    folga = 18
    y0, y1 = max(linhas[0] - folga, 0), min(linhas[-1] + folga, a.shape[0] - 1)
    x0, x1 = max(colunas[0] - folga, 0), min(colunas[-1] + folga, a.shape[1] - 1)
    alfa = alfa[y0:y1 + 1, x0:x1 + 1]
    h, w = alfa.shape
    rgba = np.zeros((h, w, 4), dtype=np.uint8)
    rgba[..., 0], rgba[..., 1], rgba[..., 2] = TINTA
    rgba[..., 3] = np.round(alfa * 255).astype(np.uint8)
    out = Image.fromarray(rgba, 'RGBA')
    escala = MAIOR_LADO / max(w, h)
    if escala < 1:
        out = out.resize((round(w * escala), round(h * escala)), Image.LANCZOS)
    out.save(destino, 'WEBP', quality=55, method=6, alpha_quality=55)
    return out.size


def main():
    baixadas, img, saida_js = Path(sys.argv[1]), Path(sys.argv[2]), Path(sys.argv[3])
    medidas = {}
    for existente in sorted(img.glob('est-*.webp')):
        with Image.open(existente) as e:
            medidas[existente.stem[4:]] = list(e.size)
    for png in sorted(baixadas.glob('*.png')):
        nome = png.stem
        medidas[nome] = list(processar(png, img / f'est-{nome}.webp'))
        print(nome, medidas[nome], (img / f'est-{nome}.webp').stat().st_size // 1024, 'KB')
    corpo = json.dumps(dict(sorted(medidas.items())), separators=(',', ':'))
    saida_js.write_text(
        '/* Medidas das estampas (gravuras de img/est-*.webp), para reservar o espaço antes de a\n'
        '   imagem carregar. Gerado junto com as imagens; não editar à mão. */\n'
        'window.ESTAMPAS = ' + corpo + ';\n', encoding='utf-8')


if __name__ == '__main__':
    main()
