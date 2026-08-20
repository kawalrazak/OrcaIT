<?php

declare(strict_types=1);

require_once __DIR__ . '/../includes/functions.php';

$slug = isset($_GET['slug']) ? preg_replace('/[^a-z0-9-]/', '', strtolower((string) $_GET['slug'])) : '';
$service = $slug !== '' ? findServicePage($slug) : null;

if ($service === null) {
    header('HTTP/1.0 404 Not Found');
    $pageTitle = 'Service not found';
    $pageDescription = 'That service page could not be found.';
    $activeNav = 'business-it';
    require __DIR__ . '/../includes/header.php';
    echo '<section class="page-hero"><div class="container"><h1 class="section-title">Service not found</h1><p class="section-copy">Please choose a service from Business IT.</p><p><a class="btn btn-primary" href="/business-it">Back to Business IT</a></p></div></section>';
    require __DIR__ . '/../includes/footer.php';
    exit;
}

$pageTitle = $service['title'];
$pageDescription = $service['summary'];
$activeNav = 'business-it';

require __DIR__ . '/../includes/header.php';
?>

<section class="page-hero">
    <div class="container">
        <p class="eyebrow"><?= h($service['eyebrow']) ?></p>
        <h1 class="section-title"><?= h($service['title']) ?></h1>
        <p class="section-copy"><?= h($service['hero']) ?></p>
        <p>
            <a class="btn btn-primary" href="/book">Book Orca IT</a>
            <a class="btn btn-secondary" href="/business-it">Back to Business IT</a>
        </p>
    </div>
</section>

<section class="section section-white">
    <div class="container">
        <table class="content-table" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
                <td>
                    <h2 class="section-title">What we can help with</h2>
                    <ul class="service-list">
                        <?php foreach ($service['solutions'] as $item): ?>
                            <li>
                                <h3><?= h($item['title']) ?></h3>
                                <p><?= h($item['copy']) ?></p>
                            </li>
                        <?php endforeach; ?>
                    </ul>
                </td>
                <td>
                    <h2 class="section-title">Benefits</h2>
                    <ul class="service-list">
                        <?php foreach ($service['benefits'] as $benefit): ?>
                            <li><p><?= h($benefit) ?></p></li>
                        <?php endforeach; ?>
                    </ul>
                    <p><a class="btn btn-primary" href="/#contact">Ask a question</a></p>
                </td>
            </tr>
        </table>
    </div>
</section>

<?php require __DIR__ . '/../includes/footer.php'; ?>
