  <script>
    /* ---- Masterclass 31 oct: dos formularios en un solo envio ---- */
    (function () {
      var EP = [
        "https://assets.mailerlite.com/jsonp/2268802/forms/202223250154981021/subscribe", // -> Zoom
        "https://assets.mailerlite.com/jsonp/2268802/forms/202217448452130686/subscribe"  // -> EN AULA (cartas)
      ];
      var form = document.getElementById('mcForm');
      if (!form) return;
      var btn = document.getElementById('mcBtn');
      var err = document.getElementById('mcError');
      var TXT = err.textContent;

      function post(url, name, email) {
        var body = new URLSearchParams();
        body.append('fields[name]', name);
        body.append('fields[email]', email);
        body.append('ml-submit', '1');
        body.append('anticsrf', 'true');
        return fetch(url, { method: 'POST', body: body })
          .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
          .then(function (d) { if (!d || d.success !== true) return Promise.reject(d); });
      }

      var enviando = false;
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (enviando) return;
        var name = (document.getElementById('mcName').value || '').trim();
        var email = (document.getElementById('mcEmail').value || '').trim();
        if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
          err.textContent = TXT; err.hidden = false; return;
        }
        err.hidden = true;
        enviando = true;
        var t = btn.textContent;
        btn.disabled = true; btn.textContent = 'Reservando…';
        // El primero es el que manda el Zoom: si ese falla, no decimos que esta listo.
        post(EP[0], name, email).then(function () {
          post(EP[1], name, email).catch(function () {});
          form.hidden = true;
          document.getElementById('mcSuccess').hidden = false;
        }).catch(function () {
          enviando = false;
          btn.disabled = false; btn.textContent = t;
          err.textContent = 'No pudimos reservar tu lugar. Inténtalo de nuevo o escríbenos a tueducadoraamiga@gmail.com';
          err.hidden = false;
        });
      });
    })();
  </script>

