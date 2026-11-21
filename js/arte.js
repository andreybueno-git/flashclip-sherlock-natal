/* Desenhos próprios da apresentação, em estilo de gravura de época: tinta preta sobre papel,
   sombras em hachura e um único vermelho de lacre. O detetive segue a figura dos livros
   (boné de caça, capa e cachimbo reto), sem copiar a aparência de filme ou série. */
(function () {
  'use strict';
  var T = '#1c1712', P = '#efe3c6', L = '#8a1c14';
  var H = 'url(#hach)', HX = 'url(#hachx)';

  /* Retrato em gravura (imagem gerada para este projeto) recortado no oval, por cima da
     silhueta desenhada, que fica de reserva se a imagem não carregar. */
  function gravado(nome) {
    return '<image href="img/retrato-' + nome + '.webp" x="-20" y="0" width="240" height="240" clip-path="url(#oval-retrato)" preserveAspectRatio="xMidYMid slice"/>' +
      '<ellipse cx="100" cy="120" rx="94" ry="114" fill="none" stroke="' + T + '" stroke-width="7"/><ellipse cx="100" cy="120" rx="85" ry="105" fill="none" stroke="' + T + '" stroke-width="2"/>';
  }

  var DEFS = [
    '<defs>',
    '<clipPath id="oval-retrato"><ellipse cx="100" cy="120" rx="86" ry="106"/></clipPath>',
    '<pattern id="hach" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(38)"><rect width="7" height="7" fill="' + P + '"/><line x1="0" y1="0" x2="0" y2="7" stroke="' + T + '" stroke-width="3"/></pattern>',
    '<pattern id="hachx" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(38)"><rect width="6" height="6" fill="' + P + '"/><path d="M0 0V6M0 0H6" stroke="' + T + '" stroke-width="3.4"/></pattern>',
    '<pattern id="ceu" width="8" height="6" patternUnits="userSpaceOnUse"><rect width="8" height="6" fill="#2a2219"/><line x1="0" y1="1" x2="8" y2="1" stroke="' + P + '" stroke-width="1" stroke-opacity=".3"/></pattern>',
    '<pattern id="longe" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(-38)"><rect width="5" height="5" fill="#2a2219"/><line x1="0" y1="0" x2="0" y2="5" stroke="' + P + '" stroke-width="1.3" stroke-opacity=".55"/></pattern>',
    '</defs>'
  ].join('');

  var SIMBOLOS = [
    /* Detetive de perfil, olhando para a esquerda: silhueta de tinta com traços claros */
    '<symbol id="detetive" viewBox="0 0 600 700">',
    '<path d="M150 700C150 560 205 440 288 404L352 404C440 436 520 560 528 700Z" fill="#0f0c09"/>',
    '<path d="M262 400C196 452 150 548 132 664L300 610L486 672C478 566 438 462 356 400Z" fill="#0f0c09" stroke="' + P + '" stroke-width="4" stroke-linejoin="round"/>',
    '<path d="M170 640C182 560 214 484 262 430M226 632C232 566 250 500 282 446M352 632C356 566 350 500 330 440M428 652C420 574 396 500 356 440" stroke="' + P + '" stroke-opacity=".55" stroke-width="2.5" fill="none"/>',
    '<path d="M300 610L296 408" stroke="' + P + '" stroke-width="3" fill="none"/>',
    '<circle cx="288" cy="470" r="7" fill="' + P + '"/><circle cx="289" cy="530" r="7" fill="' + P + '"/>',
    '<path d="M254 366L350 366L372 424L316 438L262 430L240 414Z" fill="' + L + '" stroke="' + P + '" stroke-width="3" stroke-linejoin="round"/>',
    '<path d="M262 430L250 520L286 512L300 436Z" fill="' + L + '" stroke="' + P + '" stroke-width="3" stroke-linejoin="round"/>',
    '<path d="M258 372L236 334L230 318L237 306L228 292L204 268L232 242L232 196L362 196L358 300L350 376Z" fill="#0f0c09"/>',
    '<path d="M224 214C222 124 384 112 376 222Z" fill="#0f0c09" stroke="' + P + '" stroke-width="3.5"/>',
    '<path d="M250 150C262 178 262 196 258 212M300 130C306 166 306 190 302 212M346 150C340 178 340 196 344 212" stroke="' + P + '" stroke-opacity=".6" stroke-width="2.5" fill="none"/>',
    '<path d="M236 204L168 232C160 242 172 250 190 245L244 224Z" fill="#0f0c09" stroke="' + P + '" stroke-width="3" stroke-linejoin="round"/>',
    '<path d="M362 204L422 240C430 250 416 256 402 250L352 226Z" fill="#0f0c09" stroke="' + P + '" stroke-width="3" stroke-linejoin="round"/>',
    '<path d="M300 128C282 108 268 122 284 134ZM300 128C318 108 332 122 316 134Z" fill="#0f0c09" stroke="' + P + '" stroke-width="3"/>',
    '<path d="M226 215L374 215" stroke="' + P + '" stroke-width="4"/>',
    '<g transform="translate(322 206)"><path d="M0 0C-16-18-34-14-40 2C-26 12-10 10 0 0Z" fill="' + P + '"/><path d="M0 0C14-20 34-18 42-4C28 10 10 10 0 0Z" fill="' + P + '"/><circle cx="-2" cy="4" r="7" fill="' + L + '"/><circle cx="10" cy="8" r="6" fill="' + L + '"/></g>',
    '<path d="M238 302L176 318" stroke="' + P + '" stroke-width="7" stroke-linecap="round"/>',
    '<path d="M150 296L182 296L178 338C170 346 158 346 152 338Z" fill="#0f0c09" stroke="' + P + '" stroke-width="3"/>',
    '<path d="M166 286C150 262 182 248 166 222C152 200 178 186 168 164" stroke="' + P + '" stroke-opacity=".7" stroke-width="4" fill="none" stroke-linecap="round" stroke-dasharray="3 9"/>',
    '</symbol>',

    /* Lupa */
    '<symbol id="lupa" viewBox="0 0 200 200">',
    '<path d="M118 118L176 176" stroke="' + T + '" stroke-width="22" stroke-linecap="round"/>',
    '<path d="M124 124L170 170" stroke="' + P + '" stroke-width="5" stroke-linecap="round" stroke-dasharray="2 9"/>',
    '<circle cx="78" cy="78" r="58" fill="' + P + '" fill-opacity=".55"/>',
    '<circle cx="78" cy="78" r="58" fill="none" stroke="' + T + '" stroke-width="12"/>',
    '<circle cx="78" cy="78" r="46" fill="none" stroke="' + T + '" stroke-width="2"/>',
    '<path d="M44 66C50 46 68 36 88 38" stroke="' + T + '" stroke-width="4" fill="none" stroke-linecap="round"/>',
    '</symbol>',

    /* Azevinho */
    '<symbol id="azevinho" viewBox="0 0 200 140">',
    '<path d="M100 84C84 66 78 60 60 62C56 48 46 46 34 50C30 38 18 36 8 44C16 54 14 64 22 70C16 82 24 92 36 92C40 104 56 106 66 98C78 102 92 96 100 84Z" fill="' + H + '" stroke="' + T + '" stroke-width="4" stroke-linejoin="round"/>',
    '<path d="M100 84C116 66 122 60 140 62C144 48 154 46 166 50C170 38 182 36 192 44C184 54 186 64 178 70C184 82 176 92 164 92C160 104 144 106 134 98C122 102 108 96 100 84Z" fill="' + HX + '" stroke="' + T + '" stroke-width="4" stroke-linejoin="round"/>',
    '<path d="M100 84L30 62M100 84L170 62" stroke="' + T + '" stroke-width="3" fill="none"/>',
    '<circle cx="92" cy="92" r="13" fill="' + L + '" stroke="' + T + '" stroke-width="3"/><circle cx="112" cy="94" r="12" fill="' + L + '" stroke="' + T + '" stroke-width="3"/><circle cx="101" cy="108" r="12" fill="' + L + '" stroke="' + T + '" stroke-width="3"/>',
    '</symbol>',

    /* Pegada */
    '<symbol id="pegada" viewBox="0 0 60 110">',
    '<path d="M30 4C46 4 54 22 50 44C47 60 40 66 30 66C20 66 13 60 10 44C6 22 14 4 30 4Z"/><path d="M30 74C40 74 46 80 45 92C44 102 38 106 30 106C22 106 16 102 15 92C14 80 20 74 30 74Z"/>',
    '</symbol>',

    /* Fatia de pizza */
    '<symbol id="pizza" viewBox="0 0 200 200">',
    '<path d="M100 186L28 44C74 20 126 20 172 44Z" fill="' + P + '" stroke="' + T + '" stroke-width="6" stroke-linejoin="round"/>',
    '<path d="M28 44C74 20 126 20 172 44L164 60C122 40 78 40 36 60Z" fill="' + HX + '" stroke="' + T + '" stroke-width="5" stroke-linejoin="round"/>',
    '<circle cx="84" cy="84" r="13" fill="' + L + '" stroke="' + T + '" stroke-width="3"/><circle cx="122" cy="76" r="11" fill="' + L + '" stroke="' + T + '" stroke-width="3"/><circle cx="104" cy="126" r="12" fill="' + L + '" stroke="' + T + '" stroke-width="3"/>',
    '<path d="M66 70L72 64M112 104L120 100M92 152L100 148M134 98L140 106" stroke="' + T + '" stroke-width="3" stroke-linecap="round"/>',
    '</symbol>',

    /* Prato */
    '<symbol id="prato" viewBox="0 0 240 240">',
    '<circle cx="120" cy="120" r="112" fill="' + P + '" stroke="' + T + '" stroke-width="6"/><circle cx="120" cy="120" r="100" fill="none" stroke="' + T + '" stroke-width="2"/><circle cx="120" cy="120" r="76" fill="none" stroke="' + T + '" stroke-width="3" stroke-dasharray="3 7"/>',
    '</symbol>',

    /* Retratos dos suspeitos: silhuetas recortadas em moldura oval, como se fazia na época */
    '<symbol id="retrato-ana" viewBox="0 0 200 240">',
    '<ellipse cx="100" cy="120" rx="94" ry="114" fill="' + P + '" stroke="' + T + '" stroke-width="7"/><ellipse cx="100" cy="120" rx="82" ry="102" fill="none" stroke="' + T + '" stroke-width="2"/>',
    '<path d="M40 208C44 172 68 160 100 160C132 160 156 172 160 208C140 224 60 224 40 208Z" fill="' + T + '"/>',
    '<rect x="88" y="138" width="24" height="30" fill="' + T + '"/>',
    '<circle cx="100" cy="108" r="38" fill="' + T + '"/><circle cx="100" cy="58" r="20" fill="' + T + '"/>',
    '<path d="M84 166L100 180L116 166" stroke="' + P + '" stroke-width="5" fill="none"/>',
    gravado('ana'),
    '</symbol>',
    '<symbol id="retrato-leo" viewBox="0 0 200 240">',
    '<ellipse cx="100" cy="120" rx="94" ry="114" fill="' + P + '" stroke="' + T + '" stroke-width="7"/><ellipse cx="100" cy="120" rx="82" ry="102" fill="none" stroke="' + T + '" stroke-width="2"/>',
    '<path d="M36 210C40 170 64 158 100 158C136 158 160 170 164 210C140 226 60 226 36 210Z" fill="' + T + '"/>',
    '<rect x="86" y="136" width="28" height="30" fill="' + T + '"/>',
    '<circle cx="100" cy="104" r="40" fill="' + T + '"/>',
    '<path d="M58 100C54 60 84 50 108 54C136 56 148 78 142 104Z" fill="' + T + '"/>',
    '<path d="M100 172L78 160L78 184ZM100 172L122 160L122 184Z" fill="' + L + '" stroke="' + P + '" stroke-width="3"/><circle cx="100" cy="172" r="6" fill="' + L + '" stroke="' + P + '" stroke-width="2"/>',
    gravado('leo'),
    '</symbol>',
    '<symbol id="retrato-bia" viewBox="0 0 200 240">',
    '<ellipse cx="100" cy="120" rx="94" ry="114" fill="' + P + '" stroke="' + T + '" stroke-width="7"/><ellipse cx="100" cy="120" rx="82" ry="102" fill="none" stroke="' + T + '" stroke-width="2"/>',
    '<path d="M52 110C48 60 76 44 100 44C124 44 152 60 148 110L156 182L44 182Z" fill="' + T + '"/>',
    '<path d="M40 208C44 174 68 162 100 162C132 162 156 174 160 208C140 224 60 224 40 208Z" fill="' + T + '"/>',
    '<path d="M132 62L152 48L154 72ZM132 62L116 44L112 68Z" fill="' + L + '" stroke="' + P + '" stroke-width="3"/>',
    '<path d="M80 172C92 182 108 182 120 172" stroke="' + P + '" stroke-width="4" fill="none"/>',
    gravado('bia'),
    '</symbol>',

    /* Lampião a gás (corpo); a chama é um elemento à parte */
    '<symbol id="lampiao" viewBox="0 0 200 520">',
    '<rect x="92" y="190" width="16" height="300" fill="' + T + '"/><rect x="70" y="486" width="60" height="22" fill="' + T + '"/>',
    '<rect x="80" y="330" width="40" height="10" fill="' + T + '"/>',
    '<path d="M62 190L138 190L126 96L74 96Z" fill="' + P + '" fill-opacity=".5" stroke="' + T + '" stroke-width="8" stroke-linejoin="round"/>',
    '<path d="M60 96L140 96L112 56L88 56Z" fill="' + T + '"/><rect x="94" y="36" width="12" height="22" fill="' + T + '"/><circle cx="100" cy="32" r="9" fill="' + T + '"/>',
    '</symbol>',

    /* Lacre de cera */
    '<symbol id="lacre" viewBox="0 0 200 200">',
    '<path d="M100 8C120 6 126 22 144 24C162 26 176 36 174 56C172 74 192 84 190 104C188 124 170 128 170 148C170 168 152 176 136 174C120 172 114 192 96 190C78 188 76 172 58 172C40 172 26 160 28 142C30 124 10 116 12 96C14 76 32 72 32 54C32 34 48 24 64 26C80 28 82 10 100 8Z" fill="' + L + '" stroke="#5e110c" stroke-width="3"/>',
    '<circle cx="100" cy="100" r="60" fill="none" stroke="#5e110c" stroke-width="4"/>',
    '<circle cx="100" cy="100" r="67" fill="none" stroke="#c9584c" stroke-width="2"/>',
    '</symbol>',

    /* Caixa com tampa */
    '<symbol id="caixa" viewBox="0 0 400 300">',
    '<path d="M30 110L370 110L350 280L50 280Z" fill="' + H + '" stroke="' + T + '" stroke-width="6" stroke-linejoin="round"/>',
    '<path d="M14 70L386 70L370 112L30 112Z" fill="' + P + '" stroke="' + T + '" stroke-width="6" stroke-linejoin="round"/>',
    '<path d="M40 92L360 92" stroke="' + T + '" stroke-width="2" stroke-dasharray="4 8"/>',
    '</symbol>',

    /* Livro */
    '<symbol id="livro" viewBox="0 0 200 240">',
    '<rect x="26" y="20" width="150" height="200" fill="' + H + '" stroke="' + T + '" stroke-width="6"/><rect x="26" y="20" width="26" height="200" fill="' + T + '"/>',
    '<rect x="70" y="56" width="84" height="46" fill="' + P + '" stroke="' + T + '" stroke-width="3"/>',
    '<path d="M70 190H156M70 204H140" stroke="' + T + '" stroke-width="3"/>',
    '</symbol>',

    /* Ponte */
    '<symbol id="ponte" viewBox="0 0 900 220">',
    '<path d="M20 170L880 170" stroke="currentColor" stroke-width="12" stroke-linecap="round"/>',
    '<path d="M60 170C180 60 320 60 440 170M460 170C580 60 720 60 840 170" fill="none" stroke="currentColor" stroke-width="8"/>',
    '<rect x="426" y="40" width="48" height="140" fill="currentColor"/><path d="M420 40L450 8L480 40Z" fill="currentColor"/>',
    '<path d="M120 170L120 118M180 170L180 92M250 170L250 86M320 170L320 98M380 170L380 124M520 170L520 124M580 170L580 98M650 170L650 86M720 170L720 92M780 170L780 118" stroke="currentColor" stroke-width="4"/>',
    '</symbol>',

    /* Floreio tipográfico */
    '<symbol id="floreio" viewBox="0 0 400 40">',
    '<path d="M0 20H150M250 20H400" stroke="currentColor" stroke-width="3"/><path d="M0 28H140M260 28H400" stroke="currentColor" stroke-width="1"/>',
    '<path d="M200 4L214 20L200 36L186 20Z" fill="currentColor"/><circle cx="166" cy="20" r="5" fill="currentColor"/><circle cx="234" cy="20" r="5" fill="currentColor"/>',
    '</symbol>'
  ].join('');

  /* Gerador pseudoaleatório fixo, para o desenho sair sempre igual */
  function semente(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function n0(v) { return v.toFixed(0); }

  function casas(r, W, base, altMin, altMax, cor, neve, janelas) {
    var x = -20, out = '';
    while (x < W + 20) {
      var w = 64 + r() * 100, h = altMin + r() * (altMax - altMin), y = base - h, tel = r() < .55;
      var topo = tel ? 'L' + n0(x + w / 2) + ' ' + n0(y - 30) : '';
      out += '<path d="M' + n0(x) + ' ' + base + 'L' + n0(x) + ' ' + n0(y) + topo + 'L' + n0(x + w) + ' ' + n0(y) + 'L' + n0(x + w) + ' ' + base + 'Z" fill="' + cor + '"/>';
      if (neve) out += '<path d="M' + n0(x - 2) + ' ' + n0(y) + topo + 'L' + n0(x + w + 2) + ' ' + n0(y) + '" stroke="' + P + '" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>';
      if (r() < .7) {
        var cx = x + 10 + r() * (w - 36), ch = 22 + r() * 28, cy = y - ch + (tel ? -8 : 0);
        out += '<rect x="' + n0(cx) + '" y="' + n0(cy) + '" width="16" height="' + n0(ch + 12) + '" fill="' + cor + '"/>';
        if (neve) out += '<rect x="' + n0(cx - 3) + '" y="' + n0(cy - 5) + '" width="22" height="6" fill="' + P + '"/>';
      }
      if (janelas) {
        for (var jy = y + 20; jy < base - 24; jy += 40) {
          for (var jx = x + 12; jx < x + w - 20; jx += 30) {
            if (r() < .36) out += '<rect x="' + n0(jx) + '" y="' + n0(jy) + '" width="12" height="20" fill="' + P + '"/>';
          }
        }
      }
      x += w + 2;
    }
    return out;
  }

  /* Gravura: noite de neve sobre os telhados de Londres. op: {w, h, lua:[x,y,r], detetive:[x,y,escala], semente} */
  function gravura(op) {
    var W = op.w, Hh = op.h, r = semente(op.semente || 1887), s = '';
    var lua = op.lua || [W * .72, Hh * .3, Math.min(W, Hh) * .16];
    var alt = Math.min(Hh * .34, 230);
    s += '<rect width="' + W + '" height="' + Hh + '" fill="url(#ceu)"/>';
    s += '<circle cx="' + lua[0] + '" cy="' + lua[1] + '" r="' + lua[2] + '" fill="' + P + '"/>';
    s += '<path d="M' + n0(lua[0] - lua[2] * 1.5) + ' ' + n0(lua[1] + lua[2] * .5) + 'H' + n0(lua[0] + lua[2] * .5) + 'M' + n0(lua[0] - lua[2] * .9) + ' ' + n0(lua[1] + lua[2] * .64) + 'H' + n0(lua[0] + lua[2] * 1.4) + 'M' + n0(lua[0] - lua[2] * 1.2) + ' ' + n0(lua[1] + lua[2] * .78) + 'H' + n0(lua[0] + lua[2] * .9) + '" stroke="#2a2219" stroke-width="5" stroke-linecap="round"/>';
    s += casas(r, W, Hh, alt * .9, alt * 1.45, 'url(#longe)', false, false);
    /* torre do relógio */
    var tx = W * (op.torre == null ? .2 : op.torre), th = alt * 1.9, ty = Hh - th;
    s += '<g fill="#0f0c09"><rect x="' + n0(tx) + '" y="' + n0(ty) + '" width="60" height="' + n0(th) + '"/><path d="M' + n0(tx - 6) + ' ' + n0(ty + 2) + 'H' + n0(tx + 66) + 'L' + n0(tx + 56) + ' ' + n0(ty - 22) + 'H' + n0(tx + 4) + 'Z"/><path d="M' + n0(tx + 6) + ' ' + n0(ty - 22) + 'L' + n0(tx + 30) + ' ' + n0(ty - 96) + 'L' + n0(tx + 54) + ' ' + n0(ty - 22) + 'Z"/></g>';
    s += '<circle cx="' + n0(tx + 30) + '" cy="' + n0(ty + 34) + '" r="21" fill="' + P + '"/><path d="M' + n0(tx + 30) + ' ' + n0(ty + 34) + 'V' + n0(ty + 20) + 'M' + n0(tx + 30) + ' ' + n0(ty + 34) + 'L' + n0(tx + 40) + ' ' + n0(ty + 39) + '" stroke="#0f0c09" stroke-width="3.5" stroke-linecap="round"/>';
    s += '<path d="M' + n0(tx + 6) + ' ' + n0(ty - 22) + 'L' + n0(tx + 30) + ' ' + n0(ty - 96) + 'L' + n0(tx + 54) + ' ' + n0(ty - 22) + '" stroke="' + P + '" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
    s += casas(r, W, Hh, alt * .34, alt * .8, '#0f0c09', true, true);
    if (op.detetive) {
      var d = op.detetive, dw = 600 * d[2], dh = 700 * d[2];
      s += '<svg class="gravura__figura" x="' + n0(d[0]) + '" y="' + n0(d[1]) + '" width="' + n0(dw) + '" height="' + n0(dh) + '" viewBox="0 0 600 700"><use href="#detetive"/></svg>';
    }
    /* neve: duas camadas que caem em laço */
    function flocos(nf, raio) {
      var o = '';
      for (var i = 0; i < nf; i++) {
        var fx = r() * W, fy = r() * Hh, fr = raio * (.6 + r() * .8);
        o += '<circle cx="' + n0(fx) + '" cy="' + n0(fy) + '" r="' + fr.toFixed(1) + '"/><circle cx="' + n0(fx) + '" cy="' + n0(fy - Hh) + '" r="' + fr.toFixed(1) + '"/>';
      }
      return o;
    }
    var nf = Math.round(W * Hh / 9000);
    s += '<g class="neve neve--a" fill="' + P + '" style="--h:' + Hh + 'px">' + flocos(nf, 2.6) + '</g>';
    s += '<g class="neve neve--b" fill="' + P + '" fill-opacity=".75" style="--h:' + Hh + 'px">' + flocos(nf, 1.7) + '</g>';
    return '<figure class="gravura ' + (op.classe || '') + '" aria-hidden="true"><svg viewBox="0 0 ' + W + ' ' + Hh + '" preserveAspectRatio="xMidYMax slice">' + s + '</svg></figure>';
  }

  /* Guirlanda (coroa de Natal) */
  function guirlanda() {
    var s = '', r = semente(25), n = 26;
    for (var i = 0; i < n; i++) {
      var a = (i / n) * 360;
      s += '<g transform="rotate(' + a.toFixed(1) + ' 100 100)"><path d="M100 12C116 22 118 42 100 54C82 42 84 22 100 12Z" fill="' + (i % 2 ? H : HX) + '" stroke="' + T + '" stroke-width="2.5"/></g>';
    }
    for (var j = 0; j < 9; j++) {
      var b = (j / 9) * Math.PI * 2 + r() * .3;
      s += '<circle cx="' + (100 + Math.cos(b) * 68).toFixed(1) + '" cy="' + (100 + Math.sin(b) * 68).toFixed(1) + '" r="6.5" fill="' + L + '" stroke="' + T + '" stroke-width="2"/>';
    }
    s += '<path d="M100 162L78 198L100 186L122 198Z" fill="' + L + '" stroke="' + T + '" stroke-width="2.5"/><path d="M100 164C80 148 68 164 84 176ZM100 164C120 148 132 164 116 176Z" fill="' + L + '" stroke="' + T + '" stroke-width="2.5"/>';
    return s;
  }

  var sprite = document.createElement('div');
  sprite.setAttribute('aria-hidden', 'true');
  sprite.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
  sprite.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg">' + DEFS + SIMBOLOS + '<symbol id="guirlanda" viewBox="0 0 200 200">' + guirlanda() + '</symbol></svg>';
  document.body.insertBefore(sprite, document.body.firstChild);

  window.ARTE = {
    gravura: gravura,
    usar: function (nome, classe) {
      return '<svg class="i ' + (classe || '') + '" aria-hidden="true"><use href="#' + nome + '"/></svg>';
    }
  };
})();
