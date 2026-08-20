<?php

declare(strict_types=1);

require_once __DIR__ . '/../includes/functions.php';

$pageTitle = '';
$pageDescription = 'Friendly on-site and online IT support for Australian homes and businesses.';
$activeNav = '';

$formMessage = '';
$formError = false;
$posted = $_POST;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $result = processContactSubmission($posted, 'legacy-home');
    $formMessage = $result['message'];
    $formError = !$result['ok'];
}

function postedValue($posted, $key)
{
    return isset($posted[$key]) ? (string) $posted[$key] : '';
}

require __DIR__ . '/../includes/header.php';
?>

<section class="hero">
    <div class="hero-inner">
        <p class="eyebrow">No solution, no fee</p>
        <h1 class="hero-title">IT help that gets you back to life</h1>
        <p class="hero-copy">
            Friendly on-site and online support for homes and businesses —
            so you can stop stressing about tech and get on with your day.
        </p>
        <div class="hero-actions">
            <a class="btn btn-primary" href="/book">Book Orca IT</a>
            <a class="btn btn-secondary" href="tel:<?= ORCA_PHONE_TEL ?>">Call <?= h(ORCA_PHONE_DISPLAY) ?></a>
        </div>
    </div>
</section>

<section class="section section-white">
    <div class="container">
        <table class="promise-table" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
                <td>
                    <span class="promise-icon">1</span>
                    <h2 class="promise-title">We come to you</h2>
                    <p class="promise-copy">On-site help at your home or workplace — simple and convenient.</p>
                </td>
                <td>
                    <span class="promise-icon">2</span>
                    <h2 class="promise-title">Friendly support</h2>
                    <p class="promise-copy">Clear help for both home and business, without the jargon.</p>
                </td>
                <td>
                    <span class="promise-icon">3</span>
                    <h2 class="promise-title">No solution, no fee</h2>
                    <p class="promise-copy">We work to find a fix. If we can&apos;t, you don&apos;t pay.</p>
                </td>
            </tr>
        </table>
    </div>
</section>

<section class="section section-surface text-center" id="contact">
    <div class="container">
        <h2 class="section-title">Have a question?</h2>
        <p class="section-copy">Send us a message and our team will be in touch.</p>

        <?php if ($formMessage !== ''): ?>
            <p class="form-note <?= $formError ? 'form-note-error' : 'form-note-success' ?>">
                <?= h($formMessage) ?>
            </p>
        <?php endif; ?>

        <form class="contact-form" method="post" action="/#contact">
            <div class="hp-field">
                <label for="website">Website</label>
                <input type="text" id="website" name="website" tabindex="-1" autocomplete="off">
            </div>

            <div class="form-row">
                <label for="name">Name*</label>
                <input type="text" id="name" name="name" required maxlength="200" value="<?= h(postedValue($posted, 'name')) ?>">
            </div>
            <div class="form-row">
                <label for="email">Email*</label>
                <input type="email" id="email" name="email" required maxlength="200" value="<?= h(postedValue($posted, 'email')) ?>">
            </div>
            <div class="form-row">
                <label for="phone">Phone*</label>
                <input type="tel" id="phone" name="phone" required maxlength="30" value="<?= h(postedValue($posted, 'phone')) ?>">
            </div>
            <div class="form-row">
                <label for="suburb">Suburb*</label>
                <input type="text" id="suburb" name="suburb" required maxlength="200" value="<?= h(postedValue($posted, 'suburb')) ?>">
            </div>
            <div class="form-row">
                <label for="issue">How can we help?*</label>
                <textarea id="issue" name="issue" required maxlength="1000"><?= h(postedValue($posted, 'issue')) ?></textarea>
            </div>
            <button class="btn btn-primary" type="submit">Submit</button>
        </form>
    </div>
</section>

<section class="section section-navy text-center">
    <div class="container">
        <h2 class="section-title">Book Orca IT online</h2>
        <p class="section-copy">No fuss booking — pick a time that suits you and we&apos;ll take care of the rest.</p>
        <a class="btn btn-primary" href="/book">Book Online</a>
    </div>
</section>

<?php require __DIR__ . '/../includes/footer.php'; ?>
