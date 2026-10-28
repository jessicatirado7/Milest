/*!
* Start Bootstrap - Creative v7.0.5 (https://startbootstrap.com/theme/creative)
* Copyright 2013-2021 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-creative/blob/master/LICENSE)
*/
//
// Scripts

window.addEventListener('DOMContentLoaded', () => {
    // Navbar shrink function
    const navbar = document.getElementById('mainNav');
    if (navbar) {
        const navbarShrink = () => navbar.classList.toggle('navbar-shrink', window.scrollY !== 0);
        navbarShrink();
        document.addEventListener('scroll', navbarShrink, { passive: true });
    }

    // Add persistent, associated errors while retaining native constraint
    // validation and the provider's normal HTML POST. Native validation remains
    // available if this optional enhancement does not load.
    const inquiryForm = document.getElementById('contactForm');
    if (inquiryForm) {
        const fields = Array.from(inquiryForm.querySelectorAll('input[required], textarea[required], select[required]'));
        const status = document.getElementById('contact-form-status');
        const updateStatus = function () {
            if (status) status.textContent = fields.some(field => field.getAttribute('aria-invalid') === 'true')
                ? 'Please review the error messages before sending your inquiry.' : '';
        };
        const clearError = function (field) {
            const error = document.getElementById(field.id + '-error');
            if (!error) return;
            error.hidden = true;
            error.textContent = '';
            field.removeAttribute('aria-invalid');
            const descriptions = (field.getAttribute('aria-describedby') || '').split(/\s+/).filter(id => id && id !== error.id);
            if (descriptions.length) field.setAttribute('aria-describedby', descriptions.join(' '));
            else field.removeAttribute('aria-describedby');
            updateStatus();
        };
        const showError = function (field) {
            const error = document.getElementById(field.id + '-error');
            if (!error) return;
            if (field.validity.valueMissing) {
                error.textContent = field.id === 'contact-name' ? 'Please enter your name.'
                    : field.id === 'contact-email' ? 'Please enter your email address.'
                    : 'Please enter a brief, non-confidential message.';
            } else if (field.validity.typeMismatch && field.type === 'email') {
                error.textContent = 'Please enter a valid email address, such as name@example.com.';
            } else error.textContent = field.validationMessage;
            error.hidden = false;
            field.setAttribute('aria-invalid', 'true');
            const descriptions = new Set((field.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean));
            descriptions.add(error.id);
            field.setAttribute('aria-describedby', Array.from(descriptions).join(' '));
            updateStatus();
        };
        inquiryForm.addEventListener('invalid', event => {
            if (fields.includes(event.target)) showError(event.target);
        }, true);
        fields.forEach(field => field.addEventListener('input', () => {
            if (field.getAttribute('aria-invalid') !== 'true') return;
            if (field.validity.valid) clearError(field);
            else showError(field);
        }));
        inquiryForm.addEventListener('reset', () => fields.forEach(clearError));
        inquiryForm.addEventListener('submit', () => fields.forEach(clearError));
    }


});
