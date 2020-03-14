<?php

class JSON
{
    public static function getRequestData($subkey = false)
    {
        if (!$requestText = file_get_contents('php://input')) {
			return false;
		}
		
		$data = json_decode($requestText, true);
		
		return $subkey ? $data[$subkey] : $data;
	}
		
	public static function respond($data, $options = array())
	{
        // backwards-compatibilty
        if (is_bool($options)) {
            $options = array(
                'exit' => $options
            );
        }

        // apply options defaults
        $options = array_merge(array(
            'exit' => true,
            'encode' => true
        ), $options);

        // ensure newrelic doesn't insert its runtime code into our response
		if (extension_loaded('newrelic')) {
			newrelic_disable_autorum();
		}

        // encode to json
        if ($options['encode']) {
            // generators need to be converted to arrays before being passed to json_encode
            if ($data instanceof Traversable) {
                $data = iterator_to_array($data);
            }

		    $data = json_encode($data);
        }

        if ($data === false) {
            throw new Exception('Failed to encode json data, json_last_error='.json_last_error());
        }
        
    	header('Content-type: application/json', true);
        print($data);
		Site::finishRequest($options['exit']);
	}
	
	public static function translateAndRespond($data, $summary = null, $include = null)
	{
		static::respond(static::translateObjects($data, $summary, $include));
	}

	
	public static function error($message, $statusCode = 200)
	{
        switch ($statusCode) {
            case 400:
                header('HTTP/1.0 400 Bad Request');
                break;
            case 401:
                header('HTTP/1.0 401 Unauthorized');
                break;
            case 403:
                header('HTTP/1.0 403 Forbidden');
                break;
            case 404:
                header('HTTP/1.0 404 Not Found');
                break;
            case 405:
                header('HTTP/1.0 405 Method Not Allowed');
                break;
            case 429:
                header('HTTP/1.1 429 Too Many Requests');
                break;
            case 500:
                header('HTTP/1.0 500 Internal Server Error');
                break;
            case 501:
                header('HTTP/1.0 501 Not Implemented');
                break;
        }

		$args = func_get_args();

		self::respond(array(
			'success' => false
			,'message' => vsprintf($message, array_slice($args, 1))
		));
	}
	
	public static function translateObjects($input, $summary = null, $include = null, $stringsOnly = false)
	{
		if (is_object($input)) {
            if (method_exists($input, 'getValues')) {
		        $input = $input->getValues([
		            'summary' => $summary,
		            'include' => $include,
		            'stringEncode' => $stringsOnly
		        ]);
	        } elseif ($summary && method_exists($input, 'getSummary')) {
                $input = $input->getSummary();
            } elseif (!empty($include) && method_exists($input, 'getDetails')) {
                $includeThisLevel = array();
                $includeLater = array();
                
                if (!empty($include)) {
                    if (is_string($include)) {
                        $include = explode(',', $include);
                    }
                    
                    foreach ($include AS $value) {
                        if ($value == '*') {
                            $includeThisLevel = '*';
                            continue;
                        }
        
                        if (strpos($value, '.') !== false) {
                            list($prefix, $rest) = explode('.', $value, 2);
        
                            if ($prefix == '*') {
                                $includeThisLevel = '*';
                            } elseif($includeThisLevel != '*' &&!in_array($prefix, $includeThisLevel)) {
                                $includeThisLevel[] = $prefix;
                            }
                            
                            $includeLater[$prefix][] = $rest;
                        } else {
                            if ($value[0] == '~') {
                                $includeLater['*'] = $value;
                                $value = substr($value, 1);
                            }
                            
                            if ($includeThisLevel != '*') {
                                $includeThisLevel[] = $value;
                            }
                        }
                    }
                }

				$input = $input->getDetails($includeThisLevel, $stringsOnly);
			} elseif (method_exists($input, 'getData')) {
				$input = $input->getData();
			}
		}
        
        if (is_array($input)) {
			foreach ($input AS $key => &$item) {
                if (isset($includeLater)) {
                    $includeNext = array_key_exists('*', $includeLater) ? $includeLater['*'] : array();
                    
                    if (array_key_exists($key, $includeLater)) {
                        $includeNext = array_merge($includeNext, $includeLater[$key]);
                    }
                } else {
                    $includeNext = $include;
                }

				$item = static::translateObjects($item, $summary, $includeNext);
			}
			
			return $input;
		} else {
			return $input;
		}
	}
}
