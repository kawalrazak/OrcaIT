<?php

declare(strict_types=1);

require_once __DIR__ . '/../includes/functions.php';

$pageTitle = 'About';
$pageDescription = 'Orca IT makes technology feel simple — with clear plans, accountable support and a team that listens first.';
$activeNav = 'about';

require __DIR__ . '/../includes/header.php';
?>

<section class="page-hero">
    <div class="container">
        <p class="eyebrow">About Orca IT</p>
        <h1 class="section-title">IT should feel this simple.</h1>
        <p class="section-copy">
            We help Australian homes and businesses with technology that works —
            explained clearly and supported properly.
        </p>
    </div>
</section>

<section class="section section-surface">
    <div class="container">
        <table class="content-table" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
                <td>
                    <p class="eyebrow">Our story</p>
                    <h2 class="section-title">A local team focused on clear, reliable support.</h2>
                    <p class="section-copy">
                        Orca IT exists to make technology less stressful. Whether you need a home
                        computer fixed or a full business IT partner, you get real people, honest
                        advice and solutions that fit how you actually work.
                    </p>
                    <p class="section-copy">
                        Phone: <a href="tel:<?= ORCA_PHONE_TEL ?>"><?= h(ORCA_PHONE_DISPLAY) ?></a><br>
                        Email: <a href="mailto:<?= h(ORCA_EMAIL) ?>"><?= h(ORCA_EMAIL) ?></a>
                    </p>
                    <a class="btn btn-primary" href="/book">Book a visit</a>
                </td>
                <td>
                    <img class="content-image" src="/assets/orca-about-team.png" alt="The Orca IT team">
                </td>
            </tr>
        </table>
    </div>
</section>

<?php require __DIR__ . '/../includes/footer.php'; ?>
