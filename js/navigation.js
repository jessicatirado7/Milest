// Shared navigation/footer behavior. Bootstrap's data API owns opening/closing.
window.addEventListener('DOMContentLoaded', () => {
    const year = document.getElementById('copyright-year');
    if (year) year.textContent = new Date().getFullYear();

    const menu = document.getElementById('navbarResponsive');
    if (menu) menu.addEventListener('click', event => {
        if (!(event.target instanceof Element)) return;
        const link = event.target.closest('a:not(.dropdown-toggle)');
        if (!link || !menu.contains(link) || !menu.classList.contains('show')) return;
        if (window.bootstrap && window.bootstrap.Collapse) {
            window.bootstrap.Collapse.getOrCreateInstance(menu, { toggle: false }).hide();
        }
    });

    // Coordinate same-page glides with focus and the mobile menu. Keeping
    // document focus scrolling immediate avoids two competing animations.
    if (document.documentElement.classList.contains('mm-home-page')) {
        const focusFragment = element => {
            element.classList.add('mm-fragment-target');
            element.addEventListener('blur', () => element.classList.remove('mm-fragment-target'), {once: true});
            element.focus({preventScroll: true});
        };
        // Tall payment photos use cover crops. Select for the full scaled
        // source footprint, including height, rather than just the narrow box.
        const paymentPhotos = document.querySelectorAll('.mm-payment-block__media img');
        const sizePhoto = image => {
            const width = Number(image.getAttribute('width'));
            const height = Number(image.getAttribute('height'));
            const box = image.getBoundingClientRect();
            if (!width || !height || !box.width || !box.height) return;
            const size = Math.ceil(Math.max(box.width, box.height * width / height)) + 'px';
            if (image.sizes === size) return;
            image.sizes = size;
            image.parentElement.querySelectorAll('source[srcset]').forEach(source => { source.sizes = size; });
        };
        if ('ResizeObserver' in window) {
            const observer = new ResizeObserver(entries => entries.forEach(entry => sizePhoto(entry.target)));
            paymentPhotos.forEach(image => { sizePhoto(image); observer.observe(image); });
        } else {
            paymentPhotos.forEach(sizePhoto);
            window.addEventListener('resize', () => paymentPhotos.forEach(sizePhoto), {passive: true});
        }
        document.fonts.ready.then(() => paymentPhotos.forEach(sizePhoto));

        let navigation = 0;
        let pointerActivation = null;
        document.addEventListener('pointerdown', event => {
            ++navigation;
            pointerActivation = event.isTrusted && event.pointerType && event.target instanceof Element
                ? {link: event.target.closest('a[href]'), time: performance.now()} : null;
        }, true);
        // Do not move focus later if the visitor has already continued elsewhere.
        document.addEventListener('keydown', () => { ++navigation; pointerActivation = null; }, true);
        document.addEventListener('wheel', () => { ++navigation; }, {passive: true});
        document.addEventListener('click', event => {
            const pointer = pointerActivation;
            pointerActivation = null;
            if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || !(event.target instanceof Element)) return;
            const link = event.target.closest('a[href]');
            if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self') || link.classList.contains('mm-skip-link') || link.hasAttribute('data-mm-team-request')) return;
            const url = new URL(link.href, location.href);
            const pagePath = value => value.replace(/\/index\.html$/, '/');
            if (url.origin !== location.origin || pagePath(url.pathname) !== pagePath(location.pathname) || url.search !== location.search || !url.hash) return;
            let target;
            try { target = document.getElementById(decodeURIComponent(url.hash.slice(1))); } catch { return; }
            if (!target) return;
            event.preventDefault();
            const current = ++navigation;
            const animate = pointer?.link === link && performance.now() - pointer.time < 1500
                && !matchMedia('(prefers-reduced-motion: reduce)').matches;
            const glide = () => {
                if (current !== navigation) return;
                // Abort an earlier glide before starting the latest destination.
                window.scrollTo({left: scrollX, top: scrollY, behavior: 'auto'});
                // A named heading gives screen readers a clear reading position.
                const focusTarget = target.matches('.mm-service-card') ? target : target.matches('section, article, div')
                    ? target.querySelector('h1, h2, h3, h4') || target : target;
                const focusDestination = () => {
                    if (current !== navigation) return;
                    const focus = () => {
                        if (current !== navigation) return;
                        if (!focusTarget.hasAttribute('tabindex') && !focusTarget.matches('a[href], button, input, select, textarea, summary, [contenteditable="true"]')) {
                            focusTarget.setAttribute('tabindex', '-1');
                            focusTarget.addEventListener('blur', () => focusTarget.removeAttribute('tabindex'), {once: true});
                        }
                        focusFragment(focusTarget);
                    };
                    if (document.activeElement === focusTarget) {
                        focusTarget.blur();
                        requestAnimationFrame(() => requestAnimationFrame(focus));
                    } else focus();
                };
                if (location.hash !== url.hash) history.pushState(null, '', url.hash);
                // Align the focused heading itself, including in short zoomed
                // viewports where the section's padding could leave it offscreen.
                const headerHeight = document.getElementById('mainNav')?.getBoundingClientRect().height || 0;
                window.scrollTo({left: scrollX, top: Math.max(0, scrollY + focusTarget.getBoundingClientRect().top - headerHeight - 16), behavior: animate ? 'smooth' : 'auto'});
                if (!animate) { focusDestination(); return; }
                let lastY = scrollY, stableFrames = 0;
                const started = performance.now();
                const finish = () => {
                    if (current !== navigation) return;
                    stableFrames = Math.abs(scrollY - lastY) < .5 ? stableFrames + 1 : 0;
                    lastY = scrollY;
                    if ((stableFrames >= 8 && performance.now() - started > 160) || performance.now() - started > 4000) focusDestination();
                    else requestAnimationFrame(finish);
                };
                requestAnimationFrame(finish);
            };
            if (menu && menu.contains(link) && (menu.classList.contains('show') || menu.classList.contains('collapsing')) && window.bootstrap?.Collapse) {
                menu.addEventListener('hidden.bs.collapse', glide, {once: true});
                window.bootstrap.Collapse.getOrCreateInstance(menu, {toggle: false}).hide();
            } else glide();
        });
        // Incoming section links should land at a named reading heading,
        // including from interior pages and at high zoom. Respect any visitor
        // interaction while the page loads rather than moving focus later.
        const arrivalHash = location.hash;
        if (['#services', '#portfolio', '#payment-info', '#team-therapist', '#contact', '#request-appointment'].includes(arrivalHash)) {
            const arrive = () => {
                if (navigation !== 0 || location.hash !== arrivalHash) return;
                const destination = document.getElementById(arrivalHash.slice(1));
                const heading = destination?.querySelector('h1, h2, h3, h4');
                if (!heading) return;
                const headerHeight = document.getElementById('mainNav')?.getBoundingClientRect().height || 0;
                window.scrollTo({top: Math.max(0, scrollY + heading.getBoundingClientRect().top - headerHeight - 16), behavior: 'auto'});
                if (!heading.hasAttribute('tabindex')) {
                    heading.setAttribute('tabindex', '-1');
                    heading.addEventListener('blur', () => heading.removeAttribute('tabindex'), {once: true});
                }
                focusFragment(heading);
            };
            const ready = () => document.fonts.ready.then(() => requestAnimationFrame(() => requestAnimationFrame(arrive)));
            if (document.readyState === 'complete') ready();
            else window.addEventListener('load', ready, {once: true});
        }
    }

    // In Bootstrap 5.1.3, Escape from a menu item hides the menu but can leave
    // focus on body. Restore its owning button after the vendor handler finishes.
    document.addEventListener('keydown', event => {
        if (event.key !== 'Escape' || !(event.target instanceof Element)) return;
        const dropdownMenu = event.target.closest('.dropdown-menu');
        if (!dropdownMenu) return;
        const container = dropdownMenu.closest('.dropdown');
        const toggle = container && container.querySelector('[data-bs-toggle="dropdown"]');
        if (toggle) queueMicrotask(() => toggle.focus());
    }, true);
});
