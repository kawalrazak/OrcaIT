<?php

declare(strict_types=1);

require_once __DIR__ . '/../includes/functions.php';

$pageTitle = 'Industries';
$pageDescription = 'Managed IT services tailored for banking, healthcare, education, manufacturing and professional services.';
$activeNav = 'business-it';
$industries = industriesWeServe();

require __DIR__ . '/../includes/header.php';
?>

<section class="page-hero">
    <div class="container">
        <p class="eyebrow">Industries we serve</p>
        <h1 class="section-title">Managed IT services for your industry.</h1>
        <p class="section-copy">Vertical expertise to streamline workflow, stay compliant and keep your teams productive.</p>
    </div>
</section>

<section class="section section-surface">
    <div class="container">
        <ul class="service-list">
            <?php foreach ($industries as $industry): ?>
                <li>
                    <h3><?= h($industry['label']) ?></h3>
                    <p><?= h($industry['copy']) ?></p>
                </li>
            <?php endforeach; ?>
        </ul>
        <p class="text-center" style="margin-top: 32px;">
            <a class="btn btn-primary" href="/book">Talk to us</a>
        </p>
    </div>
</section>

<?php require __DIR__ . '/../includes/footer.php'; ?>
