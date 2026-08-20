<?php

declare(strict_types=1);

require_once __DIR__ . '/../includes/functions.php';

$pageTitle = 'Why Orca IT';
$pageDescription = 'Powerful technology with refreshingly human support. Proactive, personal, practical IT for homes and businesses.';
$activeNav = 'why-orca-it';

require __DIR__ . '/../includes/header.php';
?>

<section class="page-hero">
    <div class="container">
        <p class="eyebrow">Why Orca IT</p>
        <h1 class="section-title">We take ownership of your technology.</h1>
        <p class="section-copy">
            No finger-pointing. No confusing technical talk. Just accountable,
            expert support built for the way you work.
        </p>
        <p>
            <a class="btn btn-primary" href="/book">Book Orca</a>
            <a class="btn btn-secondary" href="tel:<?= ORCA_PHONE_TEL ?>">Call <?= h(ORCA_PHONE_DISPLAY) ?></a>
        </p>
    </div>
</section>

<section class="section section-white">
    <div class="container">
        <table class="promise-table" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
                <td>
                    <h2 class="promise-title">Less downtime</h2>
                    <p class="promise-copy">Proactive management helps identify and resolve risks early.</p>
                </td>
                <td>
                    <h2 class="promise-title">Stronger security</h2>
                    <p class="promise-copy">Sensible protection and guidance for your entire team.</p>
                </td>
                <td>
                    <h2 class="promise-title">Better decisions</h2>
                    <p class="promise-copy">Clear advice helps you invest confidently in the right technology.</p>
                </td>
            </tr>
        </table>
    </div>
</section>

<section class="section section-surface">
    <div class="container">
        <table class="content-table" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
                <td>
                    <p class="eyebrow">Powerful technology</p>
                    <h2 class="section-title">Refreshingly human support.</h2>
                    <p class="section-copy">Behind every booking is a team that listens first, explains clearly, and stays accountable until the job is done.</p>
                    <ul class="service-list">
                        <li>
                            <h3>Proactive</h3>
                            <p>We solve issues before they slow you down.</p>
                        </li>
                        <li>
                            <h3>Personal</h3>
                            <p>Real people who understand your world.</p>
                        </li>
                        <li>
                            <h3>Practical</h3>
                            <p>The right solution, without the jargon.</p>
                        </li>
                        <li>
                            <h3>Prepared</h3>
                            <p>A clear roadmap for what is next.</p>
                        </li>
                    </ul>
                </td>
                <td>
                    <img class="content-image" src="/assets/orca-team.png" alt="The Orca IT team">
                    <div class="card">
                        <h3>Trusted support. Real feedback.</h3>
                        <p>&ldquo;Thank you for a job well done. Professional service delivered with care and patience.&rdquo; — Robert, Melbourne</p>
                    </div>
                    <div class="card">
                        <p>&ldquo;As older computer users, the technician solved our problems with good grace and clear explanations.&rdquo; — Rose, Glen Waverley</p>
                    </div>
                </td>
            </tr>
        </table>
    </div>
</section>

<section class="section section-navy text-center">
    <div class="container">
        <h2 class="section-title">Book support that takes ownership.</h2>
        <p class="section-copy">Speak with Orca IT or book online — we will help you get back up and running.</p>
        <a class="btn btn-primary" href="/book">Book Online</a>
        <a class="btn btn-secondary" href="tel:<?= ORCA_PHONE_TEL ?>">Call <?= h(ORCA_PHONE_DISPLAY) ?></a>
    </div>
</section>

<?php require __DIR__ . '/../includes/footer.php'; ?>
