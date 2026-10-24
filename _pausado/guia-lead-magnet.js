  <script>
    /* ---- Envío directo a MailerLite (soporta ambas casillas en un solo submit) ---- */
    (function () {
      var EP = {
        casa: "https://assets.mailerlite.com/jsonp/2268802/forms/195354419716425011/subscribe",
        aula: "https://assets.mailerlite.com/jsonp/2268802/forms/195354452339721842/subscribe"
      };
      var form = document.getElementById('lmForm');
      if (!form) return;
      var btn = document.getElementById('lmBtn');
      var err = document.getElementById('lmError');
      var TXT_VALIDA = err.textContent;
      var TXT_FALLO = 'No pudimos inscribirte. Inténtalo de nuevo o escríbenos a tueducadoraamiga@gmail.com';

      // El endpoint responde access-control-allow-origin:* -> se puede LEER la
      // respuesta. Antes iba con sendBeacon + no-cors (disparar y olvidar): la
      // página decía "¡Listo!" aunque MailerLite no hubiera recibido nada.
      function post(action, name, email) {
        var body = new URLSearchParams();
        body.append('fields[name]', name);
        body.append('fields[email]', email);
        body.append('ml-submit', '1');
        body.append('anticsrf', 'true');
        return fetch(action, { method: 'POST', body: body })
          .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
          .then(function (d) { if (!d || d.success !== true) return Promise.reject(d); });
      }

      var enviando = false;
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (enviando) return;

        var email = (document.getElementById('lmEmail').value || '').trim();
        var name = (document.getElementById('lmName').value || '').trim();
        var casa = document.getElementById('lmCasa').checked;
        var aula = document.getElementById('lmAula').checked;
        var okEmail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
        if (!okEmail || (!casa && !aula)) {
          err.textContent = TXT_VALIDA;
          err.hidden = false;
          return;
        }
        err.hidden = true;

        enviando = true;
        var textoBtn = btn.textContent;
        btn.disabled = true;
        btn.textContent = 'Enviando…';

        var tareas = [];
        if (casa) tareas.push(post(EP.casa, name, email));
        if (aula) tareas.push(post(EP.aula, name, email));

        Promise.all(tareas).then(function () {
          // La guía se entrega AQUI, no por correo: el boton de descarga solo
          // aparece despues de que MailerLite confirmo. Asi el correo ya quedo
          // capturado y la entrega no depende de una automatizacion.
          form.hidden = true;
          document.getElementById('lmSuccess').hidden = false;
        }).catch(function () {
          enviando = false;
          btn.disabled = false;
          btn.textContent = textoBtn;
          err.textContent = TXT_FALLO;
          err.hidden = false;
        });
      });

      /* El botón dice lo que la persona va a recibir de verdad */
      function sincronizarBoton() {
        if (enviando) return;
        var soloCasa = document.getElementById('lmCasa').checked
                    && !document.getElementById('lmAula').checked;
        btn.textContent = soloCasa ? 'Quiero la carta' : 'Quiero la guía';
      }
      document.getElementById('lmCasa').addEventListener('change', sincronizarBoton);
      document.getElementById('lmAula').addEventListener('change', sincronizarBoton);
    })();
  </script>
