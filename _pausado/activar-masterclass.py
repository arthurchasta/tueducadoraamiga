#!/usr/bin/env python3
"""Devuelve el bloque de la masterclass a la home y su boton al menu.
   Correr desde la raiz del repo:  python3 _pausado/activar-masterclass.py"""
import pathlib, re, sys

raiz = pathlib.Path(__file__).resolve().parent.parent
idx = raiz / "index.html"
s = idx.read_text(encoding="utf-8")

if 'id="masterclass"' in s:
    sys.exit("La masterclass YA esta en la pagina. No hago nada.")

bloque = (raiz / "_pausado" / "masterclass-31oct.html").read_text(encoding="utf-8").rstrip() + "\n\n"
js     = (raiz / "_pausado" / "masterclass-31oct.js").read_text(encoding="utf-8")

# el bloque va arriba de la seccion de la carta
anc = '    <section class="lmh lmh--carta" id="carta">'
assert s.count(anc) == 1, "no encontre la seccion de la carta"
s = s.replace(anc, bloque + anc, 1)

# el boton, primero del menu
boton = '''      <a class="menu-item menu-item--mc" href="#masterclass">
        <span class="menu-txt">
          <span class="menu-tit">Masterclass: Cómo y qué observar en tu aula</span>
          <span class="menu-sub">Sábado 31 de octubre, 11:00 Chile · con grabación</span>
        </span>
        <span class="menu-tag">Gratis</span>
      </a>

'''
anc2 = '      <a class="menu-item" href="#carta">'
assert s.count(anc2) == 1, "no encontre el boton de la carta"
s = s.replace(anc2, boton + anc2, 1)

# el JS, antes de cerrar body
s = s.replace("</body>", js + "\n</body>", 1)

# metas de la semana
s = re.sub(r'<meta name="description" content="[^"]*">',
  '<meta name="description" content="Masterclass gratuita: cómo y qué observar en tu aula. Sábado 31 de octubre, 11:00 de Chile. Con grabación.">', s, count=1)
s = re.sub(r'<meta property="og:description" content="[^"]*">',
  '<meta property="og:description" content="Masterclass gratuita el sábado 31 de octubre: cómo y qué observar en tu aula.">', s, count=1)

idx.write_text(s, encoding="utf-8")
print("Masterclass activada en index.html")
