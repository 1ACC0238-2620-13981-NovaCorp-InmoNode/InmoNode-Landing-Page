'use strict';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Opens and closes the navigation panel on small screens. */
function initNavigation() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  if (!toggle || !nav) {
    return;
  }

  const setOpen = (isOpen) => {
    nav.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.querySelector('.visually-hidden').textContent =
        isOpen ? 'Cerrar menú' : 'Abrir menú';
  };

  toggle.addEventListener('click', () => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });
  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      setOpen(false);
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav.classList.contains('is-open')) {
      setOpen(false);
      toggle.focus();
    }
  });
}

/** Shows the phone screen that matches the selected step. */
function initSteps() {
  const steps = document.querySelectorAll('.step');

  steps.forEach((step) => {
    step.querySelector('.step-button').addEventListener('click', () => {
      steps.forEach((other) => {
        const isCurrent = other === step;
        const button = other.querySelector('.step-button');
        other.classList.toggle('is-active', isCurrent);
        button.setAttribute('aria-pressed', String(isCurrent));
        document.getElementById(button.getAttribute('aria-controls')).hidden =
            !isCurrent;
      });
    });
  });
}

/** Remembers the plan a visitor asked about before reaching the form. */
function initPlanLinks() {
  const planField = document.getElementById('demo-plan');
  if (!planField) {
    return;
  }

  document.querySelectorAll('[data-plan]').forEach((link) => {
    link.addEventListener('click', () => {
      planField.value = link.dataset.plan;
    });
  });
}

/**
 * Points catalog and registration links to the web application once its URL
 * is set in the data-app-url attribute of the body element.
 */
function initAppLinks() {
  const appUrl = document.body.dataset.appUrl;
  if (!appUrl) {
    return;
  }

  document.querySelectorAll('[data-app-path]').forEach((link) => {
    link.href = appUrl.replace(/\/$/, '') + link.dataset.appPath;
  });
}

/**
 * @param {!HTMLInputElement} field
 * @return {string} The error message, or an empty string when valid.
 */
function getFieldError(field) {
  const value = field.value.trim();
  if (field.type === 'email') {
    if (!value) {
      return 'Ingresa tu correo.';
    }
    return EMAIL_PATTERN.test(value) ?
        '' : 'Ingresa un correo válido, como nombre@empresa.com.';
  }
  return value.length >= 2 ? '' : 'Ingresa tu nombre.';
}

/**
 * @param {!HTMLInputElement} field
 * @return {boolean} Whether the field is valid.
 */
function validateField(field) {
  const message = getFieldError(field);
  field.setAttribute('aria-invalid', String(Boolean(message)));
  document.getElementById(`${field.id}-error`).textContent = message;
  return !message;
}

/** Validates the demo form inline and sends it to the configured endpoint. */
function initDemoForm() {
  const form = document.querySelector('.demo-form');
  if (!form) {
    return;
  }

  const fields = [...form.querySelectorAll('input[required]')];
  const status = form.querySelector('.form-status');
  const submitButton = form.querySelector('[type="submit"]');
  const showStatus = (message) => {
    status.textContent = message;
    status.hidden = false;
  };

  form.noValidate = true;
  fields.forEach((field) => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.getAttribute('aria-invalid') === 'true') {
        validateField(field);
      }
    });
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    status.hidden = true;

    const invalidFields = fields.filter((field) => !validateField(field));
    if (invalidFields.length > 0) {
      invalidFields[0].focus();
      return;
    }

    const name = form.querySelector('#demo-name').value.trim();
    const endpoint = form.getAttribute('action');
    if (!endpoint) {
      showStatus(`Gracias, ${name}. Este formulario está en modo ` +
          'demostración y todavía no envía tus datos.');
      return;
    }

    submitButton.disabled = true;
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {Accept: 'application/json'},
        body: new FormData(form),
      });
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      form.reset();
      showStatus(`¡Gracias, ${name}! Recibimos tu solicitud y te ` +
          'escribiremos para coordinar la demo.');
    } catch (error) {
      showStatus('No pudimos enviar tu solicitud. ' +
          'Inténtalo de nuevo en unos minutos.');
    } finally {
      submitButton.disabled = false;
    }
  });
}

initNavigation();
initSteps();
initPlanLinks();
initAppLinks();
initDemoForm();
