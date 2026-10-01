<?php
declare(strict_types=1);

return [
    'ciuffo_portfolio' => [
        'site_key' => 'ciuffo_portfolio',
        'name' => 'Ciuffo Portfolio',
        'domain' => 'https://ciuffo-portfolio.vercel.app/',
        'enabled' => true,
        'checks' => [
            ['name' => 'Homepage', 'url' => 'https://ciuffo-portfolio.vercel.app/'],
        ],
    ],
];
