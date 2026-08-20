<?php

declare(strict_types=1);

/** @var string $pageTitle */
/** @var string $pageDescription */
/** @var string $activeNav */

$pageTitle = isset($pageTitle) ? $pageTitle : '';
$pageDescription = isset($pageDescription) ? $pageDescription : 'Simple, secure and reliable managed IT support for Australian homes and businesses.';
$activeNav = isset($activeNav) ? $activeNav : '';

$navItems = array(
    'what-we-do' => array('label' => 'What We Do', 'href' => '/what-we-do'),
    'business-it' => array('label' => 'Business IT', 'href' => '/business-it'),
    'why-orca-it' => array('label' => 'Why Orca IT', 'href' => '/why-orca-it'),
    'about' => array('label' => 'About', 'href' => '/about'),
);
?>
<!DOCTYPE html>
<html lang="en-AU">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?= pageTitle($pageTitle) ?></title>
    <meta name="description" content="<?= h($pageDescription) ?>">
    <link rel="icon" href="/assets/favicon.png" type="image/png">
    <link rel="stylesheet" href="/assets/legacy.css">
</head>
<body>
    <div class="top-banner">
        Fast IT help for home &amp; business —
        <a href="/book">Book Orca IT today</a>
    </div>

    <header class="site-header">
        <div class="container">
            <table class="header-table" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                    <td class="header-logo">
                        <a href="/" aria-label="Orca IT home">
                            <img src="/assets/orca-logo.png" alt="ORCA IT" width="180" height="91">
                        </a>
                    </td>
                    <td class="header-nav">
                        <nav aria-label="Main navigation">
                            <?php foreach ($navItems as $key => $item): ?>
                                <a
                                    class="nav-link<?= $activeNav === $key ? ' is-active' : '' ?>"
                                    href="<?= h($item['href']) ?>"
                                ><?= h($item['label']) ?></a>
                            <?php endforeach; ?>
                        </nav>
                    </td>
                    <td class="header-cta">
                        <a class="phone-link" href="tel:<?= ORCA_PHONE_TEL ?>">Call <?= h(ORCA_PHONE_DISPLAY) ?></a>
                        <a class="btn btn-primary" href="/book">Book Online</a>
                    </td>
                </tr>
            </table>
        </div>
    </header>

    <main>
