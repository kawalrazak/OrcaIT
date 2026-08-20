<?php

declare(strict_types=1);

$services = servicePages();
?>
    </main>

    <footer class="site-footer">
        <div class="container footer-grid">
            <table class="footer-table" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                    <td>
                        <img src="/assets/orca-logo.png" alt="ORCA IT" width="180" height="91">
                        <p>Simple, secure and reliable technology for Australian homes and businesses.</p>
                    </td>
                    <td>
                        <p class="footer-heading">Services</p>
                        <ul class="footer-links">
                            <?php foreach (array_slice($services, 0, 5) as $service): ?>
                                <li><a href="/services/<?= h($service['slug']) ?>"><?= h($service['title']) ?></a></li>
                            <?php endforeach; ?>
                        </ul>
                    </td>
                    <td>
                        <p class="footer-heading">Company</p>
                        <ul class="footer-links">
                            <li><a href="/what-we-do">What We Do</a></li>
                            <li><a href="/business-it">Business IT</a></li>
                            <li><a href="/why-orca-it">Why Orca IT</a></li>
                            <li><a href="/about">About</a></li>
                            <li><a href="/industries">Industries</a></li>
                            <li><a href="/book">Book Online</a></li>
                        </ul>
                        <p class="footer-heading footer-heading-spaced">Let&apos;s talk</p>
                        <p><a href="mailto:<?= h(ORCA_EMAIL) ?>"><?= h(ORCA_EMAIL) ?></a></p>
                        <p><a href="tel:<?= ORCA_PHONE_TEL ?>"><?= h(ORCA_PHONE_DISPLAY) ?></a></p>
                    </td>
                </tr>
            </table>
        </div>

        <div class="footer-bottom">
            <div class="container">
                &copy; <?= date('Y') ?> Orca IT. All rights reserved.
            </div>
        </div>
    </footer>
</body>
</html>
