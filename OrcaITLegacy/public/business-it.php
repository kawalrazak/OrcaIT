<?php

declare(strict_types=1);

require_once __DIR__ . '/../includes/functions.php';

$pageTitle = 'Business IT';
$pageDescription = 'Managed IT, cyber security, cloud solutions and technology advice for Australian businesses.';
$activeNav = 'business-it';
$services = servicePages();

require __DIR__ . '/../includes/header.php';
?>

<section class="page-hero">
    <div class="container">
        <p class="eyebrow">Business IT</p>
        <h1 class="section-title">Technology that works for your business.</h1>
        <p class="section-copy">
            Managed support, cyber security, cloud solutions and custom development —
            explained clearly and delivered properly.
        </p>
    </div>
</section>

<section class="section section-white">
    <div class="container">
        <table class="content-table" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
                <td>
                    <ul class="service-list">
                        <?php foreach ($services as $service): ?>
                            <li id="<?= h($service['slug']) ?>">
                                <h3><a href="/services/<?= h($service['slug']) ?>"><?= h($service['title']) ?></a></h3>
                                <p><?= h($service['summary']) ?></p>
                            </li>
                        <?php endforeach; ?>
                    </ul>
                </td>
                <td>
                    <img class="content-image" src="/assets/orca-business-it-team.png" alt="Orca IT business support team">
                    <p class="section-copy">Call us to discuss your business needs, or send an enquiry from our home page.</p>
                    <a class="btn btn-primary" href="/#contact">Contact us</a>
                    <p class="section-copy">Phone: <a href="tel:<?= ORCA_PHONE_TEL ?>"><?= h(ORCA_PHONE_DISPLAY) ?></a></p>
                </td>
            </tr>
        </table>
    </div>
</section>

<?php require __DIR__ . '/../includes/footer.php'; ?>
