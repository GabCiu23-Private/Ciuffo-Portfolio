<?php
declare(strict_types=1);

return [
    'default_site_key' => 'ciuffo_portfolio',
    'sites' => [
      'ciuffo_portfolio' => [
        'site_key' => 'ciuffo_portfolio',
        'name' => 'Ciuffo Portfolio',
        'domain' => 'https://ciuffo-portfolio.vercel.app/',
        'enabled' => true,
        'database_key' => 'default',
        'checks' => [
            ['name' => 'Homepage', 'url' => 'https://ciuffo-portfolio.vercel.app/'],
        ],
      ],
    ],
];
