<?php

declare(strict_types=1);

const ORCA_PHONE_DISPLAY = '0498 082 750';
const ORCA_PHONE_TEL = '0498082750';
const ORCA_EMAIL = 'info@orcait.com.au';
const ORCA_SITE_URL = 'https://orcait.com.au';

$crmInternalUrl = getenv('CRM_INTERNAL_URL') ?: 'http://crm:3001';
define('CRM_INTERNAL_URL', rtrim($crmInternalUrl, '/'));

$dataDirectory = __DIR__ . '/../data';
if (!is_dir($dataDirectory)) {
    mkdir($dataDirectory, 0755, true);
}
define('DATA_DIRECTORY', $dataDirectory);
