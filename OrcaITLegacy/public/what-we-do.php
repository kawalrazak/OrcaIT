<?php

declare(strict_types=1);

require_once __DIR__ . '/../includes/functions.php';

$pageTitle = 'What We Do';
$pageDescription = 'Friendly, practical technology help for your home — available remotely or at your location.';
$activeNav = 'what-we-do';
$services = homeSupportServices();

require __DIR__ . '/../includes/header.php';
?>

<section class="page-hero">
    <div class="container">
        <p class="eyebrow">Home IT Support</p>
        <h1 class="section-title">Technology help for your home.</h1>
        <p class="section-copy">
            Friendly, practical support for computers, internet, Wi-Fi, security and more —
            at your home or remotely.
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
                            <li>
                                <h3><?= h($service['title']) ?></h3>
                                <p><?= h($service['copy']) ?></p>
                            </li>
                        <?php endforeach; ?>
                    </ul>
                </td>
                <td>
                    <img class="content-image" src="/assets/orca-what-we-do-team.png" alt="Orca IT home support team">
                    <p class="section-copy">
                        We come to you across Melbourne and surrounding areas, or help remotely when that is faster.
                    </p>
                    <a class="btn btn-primary" href="/book">Book home support</a>
                </td>
            </tr>
        </table>
    </div>
</section>

<?php require __DIR__ . '/../includes/footer.php'; ?>
