<?php

if (isset($_GET['url'])) {
    $response = ['success' => true];

    $host = parse_url($_GET['url'])['host'];

    if ($host == 'drive.google.com' || $host == 'docs.google.com') {
        $isGoogle = true;
    }

    if (!$host) {
        $response = ['success' => false, 'error' => 'Invalid URL'];
    } else {
        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, $_GET['url']);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2401.0 Safari/537.36');
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 3);

        $html = curl_exec($ch);

        if($error = curl_errno($ch))
        {
            $response['success'] = false;
            $response['error'] = curl_strerror($error);
        } else {
            $realUrl = curl_getinfo($ch, CURLINFO_EFFECTIVE_URL);
            $host = parse_url($realUrl)['host'];

            $dom = new DOMDocument;
            @$dom->loadHTML($html);
            $response['title'] = $dom->getElementsByTagName('title')->item('0')->nodeValue;

            if ($isGoogle) {
                $allowedItemScope = [
                    "http://schema.org/CreativeWork/DocumentObject",
                    "http://schema.org/CreativeWork/SpreadsheetObject",
                    "http://schema.org/CreativeWork/PresentationObject",
                    "http://schema.org/CreativeWork/DrawingObject"
                ];

                $body = $dom->getElementsByTagName('body')->item('0');

                $itemScope = $body->getAttribute('itemscope');

                if (in_array($itemScope, $allowedItemScope) || $body->getAttribute('itemtype') == 'http://schema.org/CreativeWork/FileObject') {
                    $response['title'] = preg_replace("/\\s-\\sGoogle\\s\\w+$/u", "", $response['title']);
                } else {
                    $response['error'] = 'Students cannot access this link. Please share it in Google Drive. For help on sharing, please visit: https://goo.gl/WIq8KA';
                }
            }

            foreach ($dom->getElementsByTagName('link') as $link) {
                $rel = $link->getAttribute('rel');

                if ($rel == 'icon' || $rel == 'shortcut icon') {
                    $iconUrl = $link->getAttribute('href');

                    if (substr($iconUrl, 0, 4) !== 'http') {
                        $iconUrl = "http://$host/$iconUrl";
                    }
                    break;
                }
            }

            if ($_GET['extended']) {
                foreach ($dom->getElementsByTagName('meta') as $meta) {
                    if ($meta->getAttribute('name') == 'description') {
                        $response['description'] = $meta->getAttribute('content');
                        break;
                    }
                }

                if (!$iconUrl) {
                    $iconUrl = 'http://' . $host . '/favicon.ico';
                    curl_setopt($ch, CURLOPT_NOBODY, true);
                    curl_setopt($ch, CURLOPT_URL, $iconUrl);
                    curl_exec($ch);
                    $contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
                    curl_close($ch);

                    if (substr($contentType, 0, 5) != 'image') {
                        $iconUrl = null;
                    }
                }
            }

            if ($iconUrl) {
                $response['icon'] = $iconUrl;
            }
        }
    }

    http_response_code($response['success'] ? 200: 500);

    print json_encode($response, JSON_PRETTY_PRINT);

} else {
    http_response_code(400);

    print json_encode([
        'success' => false,
        'error' => 'url parameter required'
    ], JSON_PRETTY_PRINT);
}