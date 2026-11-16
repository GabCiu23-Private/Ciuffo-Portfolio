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
        'origins'=>['https://ciuffo-portfolio.vercel.app'],
        'checks' => [
            ['name' => 'Homepage', 'url' => 'https://ciuffo-portfolio.vercel.app/'],
        ],
      ],
      'poggio_alla_pieve'=>[
        'site_key'=>'poggio_alla_pieve','name'=>'Poggio alla Pieve','domain'=>'https://www.poggioallapieve.com/','enabled'=>getenv('POGGIO_ANALYTICS_ENABLED')==='true','database_key'=>'default',
        'origins'=>array_values(array_filter(array_map('trim',explode(',',getenv('POGGIO_ANALYTICS_ORIGINS')?:'')))),'checks'=>[],
      ],
    ],
];
