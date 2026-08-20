<?php

declare(strict_types=1);

require_once __DIR__ . '/../includes/functions.php';

$pageTitle = 'Reserve Your Appointment | Book Orca IT';
$pageDescription = 'Reserve your Orca IT appointment online or call us to book a visit.';
$activeNav = 'book';

$formMessage = '';
$formError = false;
$posted = $_POST;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $post = $posted;
    $postcode = trim((string) (isset($post['postcode']) ? $post['postcode'] : ''));
    $service = trim((string) (isset($post['service']) ? $post['service'] : ''));
    $preferredTime = trim((string) (isset($post['preferredTime']) ? $post['preferredTime'] : ''));
    $notes = trim((string) (isset($post['notes']) ? $post['notes'] : ''));

    $post['supportFor'] = 'Booking form';
    $post['issue'] = 'Booking request'
        . ($postcode !== '' ? ' | Postcode: ' . $postcode : '')
        . ($service !== '' ? ' | Service: ' . $service : '')
        . ($preferredTime !== '' ? ' | Preferred time: ' . $preferredTime : '')
        . ($notes !== '' ? ' | Notes: ' . $notes : '');

    $result = processContactSubmission($post, 'booking-form');
    $formMessage = $result['message'];
    $formError = !$result['ok'];
}

function postedValue($posted, $key)
{
    return isset($posted[$key]) ? (string) $posted[$key] : '';
}

require __DIR__ . '/../includes/header.php';
?>

<section class="page-hero">
    <div class="container">
        <p class="eyebrow">Book online</p>
        <h1 class="section-title">Reserve your appointment now</h1>
        <p class="section-copy">
            Enter your details below and our team will confirm your booking.
            Prefer to talk? Call <a href="tel:<?= ORCA_PHONE_TEL ?>"><?= h(ORCA_PHONE_DISPLAY) ?></a>.
        </p>
    </div>
</section>

<section class="section section-surface">
    <div class="container">
        <table class="content-table" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
                <td>
                    <?php if ($formMessage !== ''): ?>
                        <p class="form-note <?= $formError ? 'form-note-error' : 'form-note-success' ?>">
                            <?= h($formMessage) ?>
                        </p>
                    <?php endif; ?>

                    <form class="contact-form" method="post" action="/book">
                        <div class="hp-field">
                            <label for="website">Website</label>
                            <input type="text" id="website" name="website" tabindex="-1" autocomplete="off">
                        </div>

                        <div class="form-row">
                            <label for="postcode">Your postcode</label>
                            <input type="text" id="postcode" name="postcode" maxlength="4" value="<?= h(postedValue($posted, 'postcode')) ?>">
                        </div>
                        <div class="form-row">
                            <label for="name">Name*</label>
                            <input type="text" id="name" name="name" required maxlength="200" value="<?= h(postedValue($posted, 'name')) ?>">
                        </div>
                        <div class="form-row">
                            <label for="phone">Phone*</label>
                            <input type="tel" id="phone" name="phone" required maxlength="30" value="<?= h(postedValue($posted, 'phone')) ?>">
                        </div>
                        <div class="form-row">
                            <label for="email">Email*</label>
                            <input type="email" id="email" name="email" required maxlength="200" value="<?= h(postedValue($posted, 'email')) ?>">
                        </div>
                        <div class="form-row">
                            <label for="suburb">Suburb*</label>
                            <input type="text" id="suburb" name="suburb" required maxlength="200" value="<?= h(postedValue($posted, 'suburb')) ?>">
                        </div>
                        <div class="form-row">
                            <label for="service">Service needed*</label>
                            <?php $selectedService = postedValue($posted, 'service'); ?>
                            <select id="service" name="service" required>
                                <option value="">Choose a service</option>
                                <?php foreach (array('Home IT support', 'Business IT support', 'Cyber security', 'Cloud / Microsoft 365', 'Network / Wi-Fi', 'Other') as $option): ?>
                                    <option value="<?= h($option) ?>"<?= $selectedService === $option ? ' selected="selected"' : '' ?>><?= h($option) ?></option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        <div class="form-row">
                            <label for="preferredTime">Preferred date / time</label>
                            <input type="text" id="preferredTime" name="preferredTime" maxlength="200" value="<?= h(postedValue($posted, 'preferredTime')) ?>">
                        </div>
                        <div class="form-row">
                            <label for="notes">Additional details</label>
                            <textarea id="notes" name="notes" maxlength="1000"><?= h(postedValue($posted, 'notes')) ?></textarea>
                        </div>
                        <button class="btn btn-primary" type="submit">Request booking</button>
                    </form>
                </td>
                <td>
                    <img class="content-image" src="/assets/orca-logo.png" alt="ORCA IT">
                    <p class="section-copy">This booking page works on older computers and browsers. We will call or email to confirm your appointment.</p>
                    <p class="section-copy"><strong>No solution, no fee</strong> — we work to find a fix, and if we can&apos;t help you don&apos;t pay.</p>
                </td>
            </tr>
        </table>
    </div>
</section>

<?php require __DIR__ . '/../includes/footer.php'; ?>
