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
        <p class="section-copy" style="color:#fff;">
            Friendly on-site and online support for homes and businesses —
            so you can stop stressing about tech and get on with your day.
        </p>
        <p>
            <a class="btn btn-primary" href="/book">Book Orca IT</a>
            &nbsp;
            <a class="btn btn-secondary" href="tel:<?= ORCA_PHONE_TEL ?>">Call <?= h(ORCA_PHONE_DISPLAY) ?></a>
        </p>
    </div>
</section>

<section class="section section-white">
    <div class="container">
        <table width="100%" cellpadding="12" cellspacing="0" border="0">
            <tr>
                <td width="33%" align="center" valign="top">
                    <p style="font-size:24px;font-weight:bold;color:#f42c1c;">1</p>
                    <h2 class="section-title" style="font-size:16px;">We come to you</h2>
                    <p class="section-copy">On-site help at your home or workplace — simple and convenient.</p>
                </td>
                <td width="33%" align="center" valign="top">
                    <p style="font-size:24px;font-weight:bold;color:#f42c1c;">2</p>
                    <h2 class="section-title" style="font-size:16px;">Friendly support</h2>
                    <p class="section-copy">Clear help for both home and business, without the jargon.</p>
                </td>
                <td width="33%" align="center" valign="top">
                    <p style="font-size:24px;font-weight:bold;color:#f42c1c;">3</p>
                    <h2 class="section-title" style="font-size:16px;">No solution, no fee</h2>
                    <p class="section-copy">We work to find a fix. If we can&apos;t, you don&apos;t pay.</p>
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

        <form method="post" action="/#contact">
            <div class="hp-field">
                <label for="website">Website</label>
                <input type="text" id="website" name="website" tabindex="-1" autocomplete="off">
            </div>

            <table class="form-table" cellpadding="0" cellspacing="0" border="0">
                <tr>
                    <td>
                        <label for="name">Name *</label>
                        <input type="text" id="name" name="name" required maxlength="200" value="<?= h(postedValue($posted, 'name')) ?>">
                    </td>
                </tr>
                <tr>
                    <td>
                        <label for="email">Email *</label>
                        <input type="text" id="email" name="email" required maxlength="200" value="<?= h(postedValue($posted, 'email')) ?>">
                    </td>
                </tr>
                <tr>
                    <td>
                        <label for="phone">Phone *</label>
                        <input type="text" id="phone" name="phone" required maxlength="30" value="<?= h(postedValue($posted, 'phone')) ?>">
                    </td>
                </tr>
                <tr>
                    <td>
                        <label for="suburb">Suburb *</label>
                        <input type="text" id="suburb" name="suburb" required maxlength="200" value="<?= h(postedValue($posted, 'suburb')) ?>">
                    </td>
                </tr>
                <tr>
                    <td>
                        <label for="issue">How can we help? *</label>
                        <textarea id="issue" name="issue" required maxlength="1000"><?= h(postedValue($posted, 'issue')) ?></textarea>
                    </td>
                </tr>
                <tr>
                    <td>
                        <button class="btn btn-primary" type="submit">Submit</button>
                    </td>
                </tr>
            </table>
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
