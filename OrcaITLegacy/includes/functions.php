<?php

declare(strict_types=1);

require_once __DIR__ . '/config.php';

function h(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
}

function pageTitle(string $title): string
{
    if ($title === '') {
        return 'Orca IT | Managed IT Support for Australian Businesses';
    }

    return h($title) . ' | Orca IT';
}

function csvCell(string $value): string
{
    if ($value !== '' && preg_match('/^[=+\-@]/', $value)) {
        $value = "'" . $value;
    }

    return '"' . str_replace('"', '""', $value) . '"';
}

function forwardLeadToCrm(array $payload): bool
{
    $json = json_encode($payload);
    if ($json === false) {
        return false;
    }

    $context = stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => "Content-Type: application/json\r\n",
            'content' => $json,
            'timeout' => 10,
            'ignore_errors' => true,
        ],
    ]);

    $response = @file_get_contents(CRM_INTERNAL_URL . '/api/leads', false, $context);
    if ($response === false) {
        error_log('[crm-forward] request failed');
        return false;
    }

    $statusLine = isset($http_response_header[0]) ? $http_response_header[0] : '';
    if (!preg_match('/\s200\s|\s201\s/', $statusLine)) {
        error_log('[crm-forward] ' . $statusLine . ': ' . $response);
        return false;
    }

    return true;
}

function saveLeadCsv(array $lead, string $filename, array $headerLabels): void
{
    $path = DATA_DIRECTORY . '/' . $filename;
    $needsHeader = !is_file($path) || filesize($path) === 0;

    $row = array_merge([date('c')], $lead);
    $cells = array();
    foreach ($row as $value) {
        $cells[] = csvCell((string) $value);
    }

    $line = '';
    if ($needsHeader) {
        $headerCells = array();
        foreach ($headerLabels as $label) {
            $headerCells[] = csvCell((string) $label);
        }
        $line .= implode(',', $headerCells) . "\n";
    }
    $line .= implode(',', $cells) . "\n";

    file_put_contents($path, $line, FILE_APPEND | LOCK_EX);
}

function processContactSubmission(array $post, string $source = 'legacy-contact'): array
{
    if (trim((string) (isset($post['website']) ? $post['website'] : '')) !== '') {
        return array('ok' => true, 'message' => 'Thanks — our team will be in touch shortly.');
    }

    $fields = array(
        'supportFor' => trim((string) (isset($post['supportFor']) ? $post['supportFor'] : 'Home or Business')),
        'existingCustomer' => trim((string) (isset($post['existingCustomer']) ? $post['existingCustomer'] : 'Not sure')),
        'name' => trim((string) (isset($post['name']) ? $post['name'] : '')),
        'phone' => trim((string) (isset($post['phone']) ? $post['phone'] : '')),
        'email' => trim((string) (isset($post['email']) ? $post['email'] : '')),
        'suburb' => trim((string) (isset($post['suburb']) ? $post['suburb'] : '')),
        'issue' => trim((string) (isset($post['issue']) ? $post['issue'] : '')),
        'preferredContactTime' => trim((string) (isset($post['preferredContactTime']) ? $post['preferredContactTime'] : 'ASAP')),
    );

    foreach ($fields as $value) {
        if ($value === '' || strlen($value) > 1000) {
            return array('ok' => false, 'message' => 'Please complete all required fields.');
        }
    }

    if (!preg_match('/^[+()\d\s-]{8,20}$/', $fields['phone'])) {
        return array('ok' => false, 'message' => 'Please provide a valid phone number.');
    }

    saveLeadCsv(
        array(
            $fields['supportFor'],
            $fields['existingCustomer'],
            $fields['name'],
            $fields['phone'],
            $fields['email'],
            $fields['suburb'],
            $fields['issue'],
            $fields['preferredContactTime'],
        ),
        'chatbot-responses.csv',
        array(
            'Submitted At',
            'Support For',
            'Existing Customer',
            'Name',
            'Phone',
            'Email',
            'Suburb',
            'Support Needed',
            'Preferred Contact Time',
        )
    );

    forwardLeadToCrm(array_merge(array('source' => $source), $fields));
    notifyStaffByEmail($fields, $source);

    return array('ok' => true, 'message' => 'Thanks — our team will be in touch shortly.');
}

function notifyStaffByEmail(array $fields, string $source): void
{
    $to = EMAIL_NOTIFY_TO;
    $subject = 'New website enquiry — ' . $fields['name'];
    $body = implode("\n", array(
        'A new enquiry was submitted on the Orca IT website (classic/PHP view).',
        '',
        'Source: ' . $source,
        'Name: ' . $fields['name'],
        'Email: ' . $fields['email'],
        'Phone: ' . $fields['phone'],
        'Suburb: ' . $fields['suburb'],
        'Support for: ' . $fields['supportFor'],
        'Existing customer: ' . $fields['existingCustomer'],
        'Preferred contact time: ' . $fields['preferredContactTime'],
        '',
        'Message: ' . $fields['issue'],
        '',
        'Also saved in CRM → Manage Leads.',
    ));

    $headers = implode("\r\n", array(
        'From: Orca IT <' . ORCA_EMAIL . '>',
        'Reply-To: ' . $fields['email'],
        'Content-Type: text/plain; charset=UTF-8',
        'X-Mailer: OrcaIT-Legacy',
    ));

    $sent = @mail($to, $subject, $body, $headers);
    if (!$sent) {
        error_log('[staff-email] mail() failed for ' . $fields['email']);
    }
}

function homeSupportServices(): array
{
    return array(
        array('title' => 'Desktop PC Repairs', 'copy' => 'Diagnosis, repairs, upgrades and performance fixes for desktop computers.'),
        array('title' => 'Internet & Networking', 'copy' => 'Reliable Wi-Fi, router and home network setup with help resolving connection problems.'),
        array('title' => 'Virus Removal', 'copy' => 'Malware cleanup, security checks and practical protection for your computer and data.'),
        array('title' => 'Email Troubleshooting', 'copy' => 'Help with email setup, password issues, syncing, sending, receiving and account access.'),
        array('title' => 'Printer Setup', 'copy' => 'Printer and scanner installation, Wi-Fi connection and troubleshooting for common faults.'),
        array('title' => 'Mac Repairs', 'copy' => 'Support and troubleshooting for Mac computers, software, updates and connected devices.'),
        array('title' => 'Data Recovery', 'copy' => 'Assessment and recovery support for important files from computers and storage devices.'),
        array('title' => 'Smart TV Setup', 'copy' => 'Smart TV connection, streaming app setup and help linking your home devices.'),
        array('title' => 'Remote & Phone Support', 'copy' => 'Convenient technical help by phone or secure remote connection when an on-site visit is not needed.'),
        array('title' => 'Broadband', 'copy' => 'Broadband setup and troubleshooting to improve connection stability, coverage and speed.'),
    );
}

function industriesWeServe(): array
{
    return array(
        array('label' => 'Banking & finance', 'copy' => 'Secure, reliable support for offices that need uptime, compliance and careful handling of customer data.'),
        array('label' => 'Healthcare', 'copy' => 'Practical IT for clinics and practices — devices, networks and software kept working so staff can focus on patients.'),
        array('label' => 'Education', 'copy' => 'Support for schools and campuses: devices, Wi-Fi, accounts and classroom technology.'),
        array('label' => 'Manufacturing', 'copy' => 'Keep production systems, office PCs and networks stable with clear, accountable support.'),
        array('label' => 'Professional services', 'copy' => 'Help for accountants, lawyers and consultants who need email, files and security to just work.'),
        array('label' => 'Retail & hospitality', 'copy' => 'POS, Wi-Fi, printers and back-office systems supported so you can serve customers.'),
    );
}

function servicePages(): array
{
    return array(
        array(
            'slug' => 'software-development',
            'title' => 'Software Development',
            'eyebrow' => 'Custom platforms',
            'summary' => 'Purpose-built software that removes manual work, connects your systems and gives your team a smoother way to operate.',
            'hero' => 'We design and build practical business applications, portals and workflow tools around the way your organisation actually works.',
            'solutions' => array(
                array('title' => 'Business applications', 'copy' => 'Custom tools for operations, staff workflows, reporting and customer-facing processes.'),
                array('title' => 'Web portals', 'copy' => 'Secure client, staff or partner portals that centralise information and reduce admin.'),
                array('title' => 'System integrations', 'copy' => 'Connect CRMs, accounting tools, cloud apps and databases so your data moves cleanly.'),
                array('title' => 'Modernisation', 'copy' => 'Refresh ageing tools with faster, more secure and easier-to-maintain digital systems.'),
            ),
            'benefits' => array(
                'Less double handling and manual data entry.',
                'A platform designed around your real process.',
                'Clearer reporting and better visibility.',
                'A maintainable foundation for future growth.',
            ),
        ),
        array(
            'slug' => 'crm-development',
            'title' => 'CRM Development',
            'eyebrow' => 'Customer systems',
            'summary' => 'CRM setup, customisation and automation that helps you manage leads, customers and follow-up with confidence.',
            'hero' => 'We help turn scattered customer information into a clear sales and service system your team will actually use.',
            'solutions' => array(
                array('title' => 'CRM implementation', 'copy' => 'Set up the right pipeline, customer fields, permissions and team workflows.'),
                array('title' => 'Automation', 'copy' => 'Automate reminders, lead assignment, emails and follow-up steps to reduce missed opportunities.'),
                array('title' => 'Reporting dashboards', 'copy' => 'See enquiries, activity, conversion and service performance in one place.'),
                array('title' => 'Data cleanup', 'copy' => 'Organise existing records and improve data quality before your team depends on it.'),
            ),
            'benefits' => array(
                'A single source of truth for customer relationships.',
                'Faster response to new enquiries.',
                'Better accountability across sales and support.',
                'Automated follow-up that keeps work moving.',
            ),
        ),
        array(
            'slug' => 'managed-it',
            'title' => 'Managed IT for Businesses',
            'eyebrow' => 'Reliable support',
            'summary' => 'Ongoing IT management, monitoring and support that keeps devices, users, networks and servers working smoothly.',
            'hero' => 'Orca IT becomes your dependable technology partner, handling daily support and proactive maintenance so your team can stay productive.',
            'solutions' => array(
                array('title' => 'Service desk', 'copy' => 'Friendly remote and on-site support for everyday technical issues and user requests.'),
                array('title' => 'Network support', 'copy' => 'Wi-Fi, routers, firewalls and connectivity kept stable, secure and ready.'),
                array('title' => 'Endpoint management', 'copy' => 'Workstations, laptops and servers monitored, patched and maintained as one environment.'),
                array('title' => 'Security baseline', 'copy' => 'Practical protection, updates and user guidance to reduce common business risks.'),
            ),
            'benefits' => array(
                'Predictable IT support without hiring a full internal team.',
                'Clear ownership when something goes wrong.',
                'Proactive maintenance instead of constant firefighting.',
                'A practical roadmap for upgrades and improvements.',
            ),
        ),
        array(
            'slug' => 'it-consultancy',
            'title' => 'IT Consultancy',
            'eyebrow' => 'Better decisions',
            'summary' => 'Straightforward technology advice, audits and roadmaps that help you spend wisely and improve performance.',
            'hero' => 'We translate technology decisions into clear business choices, helping you improve security, reliability and long-term value.',
            'solutions' => array(
                array('title' => 'Technology audit', 'copy' => 'Review your systems, risks, vendors and costs to identify what needs attention.'),
                array('title' => 'Migration planning', 'copy' => 'Plan moves to better platforms, cloud systems or new infrastructure with less disruption.'),
                array('title' => 'Network design', 'copy' => 'Create a reliable network plan that supports security, growth and daily performance.'),
                array('title' => 'Vendor guidance', 'copy' => 'Get help comparing options, avoiding overbuying and selecting tools that fit.'),
            ),
            'benefits' => array(
                'Clear priorities before spending money.',
                'Less risk during upgrades and migrations.',
                'Better alignment between IT and business goals.',
                'Independent guidance without confusing jargon.',
            ),
        ),
        array(
            'slug' => 'cloud-computing',
            'title' => 'Cloud Computing',
            'eyebrow' => 'Modern workplace',
            'summary' => 'Cloud migration, Microsoft 365, Azure, backup and collaboration tools that make work more flexible and resilient.',
            'hero' => 'We help businesses move from scattered, device-based systems to secure cloud platforms that staff can use from anywhere.',
            'solutions' => array(
                array('title' => 'Microsoft 365', 'copy' => 'Licensing, configuration and support for email, Teams, SharePoint and collaboration.'),
                array('title' => 'Azure services', 'copy' => 'Cloud infrastructure and compute options for business workloads and growth.'),
                array('title' => 'Cloud backup', 'copy' => 'Backup strategies that protect key business data from accidental loss and disruption.'),
                array('title' => 'Domain management', 'copy' => 'Domain setup, DNS and cloud identity support for a reliable online foundation.'),
            ),
            'benefits' => array(
                'Flexible work from office, home or on the road.',
                'Reduced dependence on ageing local hardware.',
                'Stronger continuity with cloud backup options.',
                'Simpler collaboration across your team.',
            ),
        ),
        array(
            'slug' => 'product-promise',
            'title' => 'Product Promise',
            'eyebrow' => 'Hardware supply',
            'summary' => 'Quality hardware supply, setup and warranty support for desktops, laptops, printers, routers, servers and gaming consoles.',
            'hero' => 'We help you choose the right products, configure them correctly and support them after purchase.',
            'solutions' => array(
                array('title' => 'Business devices', 'copy' => 'Desktops and laptops selected for reliability, performance and staff needs.'),
                array('title' => 'Network hardware', 'copy' => 'Routers, Wi-Fi equipment and related devices for stable connectivity.'),
                array('title' => 'Servers and storage', 'copy' => 'On-premise or hybrid hardware options sized for your workload.'),
                array('title' => 'Printers and peripherals', 'copy' => 'Devices supplied, installed and configured so your team can use them quickly.'),
            ),
            'benefits' => array(
                'Avoid buying devices that do not fit your needs.',
                'Professional setup before staff start using equipment.',
                'Support when something needs attention.',
                'Better consistency across your business devices.',
            ),
        ),
        array(
            'slug' => 'website-development',
            'title' => 'Website Development',
            'eyebrow' => 'Digital presence',
            'summary' => 'Modern websites and web applications that are fast, secure, easy to update and designed to convert visitors.',
            'hero' => 'We build polished websites that look professional, explain your value clearly and support your business goals.',
            'solutions' => array(
                array('title' => 'Business websites', 'copy' => 'Responsive marketing sites that clearly present your services and encourage enquiries.'),
                array('title' => 'Custom web apps', 'copy' => 'Tailored portals and web tools for staff, customers or operations.'),
                array('title' => 'UX and content structure', 'copy' => 'Clear page hierarchy and messaging that helps visitors find what they need.'),
                array('title' => 'Performance and security', 'copy' => 'Modern foundations, safe deployment and speed-focused build practices.'),
            ),
            'benefits' => array(
                'A professional first impression.',
                'Clear service pages that support search and conversion.',
                'A faster, easier experience on mobile and desktop.',
                'Room to grow into forms, portals and integrations.',
            ),
        ),
        array(
            'slug' => 'digital-marketing',
            'title' => 'Digital Marketing',
            'eyebrow' => 'Online growth',
            'summary' => 'Search, content, paid campaigns and social strategies that help the right customers find and trust your business.',
            'hero' => 'We connect your website, content and campaigns into a practical marketing system focused on enquiries and growth.',
            'solutions' => array(
                array('title' => 'SEO', 'copy' => 'Improve site structure, content and visibility so customers can find your services.'),
                array('title' => 'Paid campaigns', 'copy' => 'Focused search and social campaigns built around real business outcomes.'),
                array('title' => 'Content marketing', 'copy' => 'Useful content that explains your expertise and builds trust before customers call.'),
                array('title' => 'Conversion optimisation', 'copy' => 'Improve landing pages, calls to action and forms so more visitors become leads.'),
            ),
            'benefits' => array(
                'A clearer online message.',
                'Better quality website traffic.',
                'More consistent enquiry generation.',
                'Reporting that helps you decide what to do next.',
            ),
        ),
    );
}

function findServicePage(string $slug): ?array
{
    foreach (servicePages() as $service) {
        if ($service['slug'] === $slug) {
            return $service;
        }
    }

    return null;
}
