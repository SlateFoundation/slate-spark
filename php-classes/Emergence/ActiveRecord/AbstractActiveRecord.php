<?php

namespace Emergence\ActiveRecord;

use Inflector;

abstract class AbstractActiveRecord implements ActiveRecordInterface
{
    use \Emergence\Classes\StackedConfigTrait;
    use \Emergence\Classes\SubclassesConfigTrait;

    // static configuration
    public static $singularNoun = 'record';
    public static $pluralNoun = 'records';
    public static $collectionRoute = null;

    public static $fields = [
        'ID' => [
            'type' => 'integer',
            'autoIncrement' => true,
            'unsigned' => true,
            'includeInSummary' => true
        ],
        'Class' => [
            'type' => 'enum',
            'null' => false,
            'values' => []
        ],
        'Created' => [
            'type' => 'timestamp',
            'default' => 'CURRENT_TIMESTAMP'
        ],
        'CreatorID' => [
            'type' => 'integer',
            'null' => true
        ]
    ];

    public static $fieldDefaults = [
        'type' => 'string'
    ];

    public static $fieldHandlers = [
        Fields\Integer::class,
        Fields\String::class,
        Fields\Text::class => [
            'foo' => 'bar',
            'boo' => 'baz'
        ]
    ];



    // static configuration getters
    public static function getSingularNoun()
    {
        return static::$singularNoun;
    }

    public static function getPluralNoun()
    {
        return static::$pluralNoun;
    }

    public static function getNoun($count)
    {
        return $count == 1 ? static::getSingularNoun() : static::getPluralNoun();
    }

    public static function getCollectionRoute()
    {
        return $collectionRoute;
    }


    // static instance getters
    public static function getById($id, array $options = [])
    {
        return static::getByField('id', $id, $options);
    }

    public static function getByHandle($handle, array $options = [])
    {
        return static::getByField('handle', $handle, $options);
    }


    // static collection getters



    // static configuration management
    protected static function initFields(array $config)
    {
        $fields = [];

        // apply defaults to field definitions
        foreach ($config AS $field => $options) {
            if (!$options) {
                continue;
            }

            if (is_string($field)) {
                $fields[$field] = static::initField($field, is_array($options) ? $options : ['type' => $options]);
            } elseif (is_string($options)) {
                $field = $options;
                $fields[$field] = static::initField($field);
            }
        }

        return $fields;
    }

    protected static function initField($field, array $options = [])
    {
        // backwards compatibility
        if (isset($options['notnull'])) {
            if (!isset($options['null'])) {
                $options['null'] = !$options['notnull'];
            }

            unset($options['notnull']);
        }

        if (isset($options['autoincrement'])) {
            if (!isset($options['autoIncrement'])) {
                $options['autoIncrement'] = $options['autoincrement'];
            }

            unset($options['autoincrement']);
        }

        if (isset($options['blankisnull'])) {
            if (!isset($options['blankIsNull'])) {
                $options['blankIsNull'] = $options['blankisnull'];
            }

            unset($options['blankisnull']);
        }

        // apply defaults
        $options = array_merge([
            'type' => null,
            'length' => null,
            'primary' => null,
            'unique' => null,
            'autoIncrement' => null,
            'null' => array_key_exists('default', $options) && $options['default'] === null ? true : false,
            'unsigned' => null,
            'default' => null,
            'values' => null
        ], static::$fieldDefaults, ['columnName' => $field], $options);

        if ($field == 'Class') {
            // apply Class enum values
            $options['values'] = static::getStaticSubClasses();
        }

        $options['blankIsNull'] = !isset($options['blankIsNull']) && !empty($options['null']);

        if ($options['autoincrement']) {
            $options['primary'] = true;
        }

        if (empty($options['label'])) {
            $options['label'] = Inflector::labelIdentifier($field);
        }

        return $options;
    }

    /**
     * Supported syntaxes:
     *  $fieldHandlers = [
     *      \Emergence\ActiveRecord\Fields\Integer::class,
     *      'superint' => \Emergence\ActiveRecord\Fields\Integer::class,
     *      [
     *          'aliases' => ['bonusint', 'deluxeint'],
     *          'class' => \Emergence\ActiveRecord\Fields\Integer::class,
     *      ],
     *      'extrabigint' => [
     *          'aliases' => ['jumboint'],
     *          'class' => \Emergence\ActiveRecord\Fields\Integer::class
     *      ],
     *      \Emergence\ActiveRecord\Fields\Integer::class => [
     *          'aliases' => ['uberint']
     *      ]
     *  ]
     */
    protected static function initFieldHandlers(array $config)
    {
        $fieldHandlers = [];

        // apply defaults to field definitions
        foreach ($config AS $key => $value) {
            if (!$value) {
                continue;
            }

            $config = is_array($value) ? $value : [];

            if (is_string($value)) {
                $config = [
                    'class' => $value
                ];
            } else {
                $config = $value;
            }

            $aliases = !empty($config['aliases']) ? $config['aliases'] : [];
            unset($config['aliases']);

            if (is_string($key)) {
                if (empty($config['class'])) {
                    $config['class'] = $key;
                } else {
                    $aliases[] = $key;
                }
            }

            if (!count($aliases)) {
                $aliases = $config['class']::getAliases();
            }

            foreach ($aliases AS $alias) {
                $fieldHandlers[$alias] = $config;
            }
        }

        return $fieldHandlers;
    }

    // instance members
    protected $data;
    protected $phantom;
    protected $dirty;
    protected $valid;
    protected $new;
    protected $destroyed;


    // magic methods
    public function __construct(array $data = [], array $options = [])
    {
        $this->data = $data;
        $this->phantom = isset($options['phantom']) ? $options['phantom'] : empty($data);
        $this->dirty = $this->phantom || !empty($options['dirty']);
        $this->valid = isset($options['valid']) ? $options['valid'] : null;
        $this->new = !empty($options['new']);
        $this->destroyed = !empty($options['destroyed']);
    }


    // lifecycle state setters
    public function setPhantom($phantom)
    {
        if ($this->phantom != $phantom) {
            $this->updatePhantom($phantom);
        }
    }

    public function setDirty($dirty)
    {
        if ($this->dirty != $dirty) {
            $this->updateDirty($dirty);
        }
    }

    public function setValid($valid)
    {
        if ($this->valid != $valid) {
            $this->updateValid($valid);
        }
    }

    public function setNew($new)
    {
        if ($this->new != $new) {
            $this->updateNew($new);
        }
    }

    public function setDestroyed($destroyed)
    {
        if ($this->destroyed != $destroyed) {
            $this->updateDestroyed($destroyed);
        }
    }


    // lifecycle state update handlers
    protected function updatePhantom($phantom)
    {
        $this->phantom = $phantom;

        if (!$phantom) {
            $this->setNew(true);
            $this->setDestroyed(false);
        }
    }

    protected function updateDirty($dirty)
    {
        $this->dirty = $dirty;

        if ($dirty) {
            $this->valid = null;
        }
    }

    protected function updateValid($valid)
    {
        $this->valid = $valid;
    }

    protected function updateNew($new)
    {
        $this->new = $new;

        if ($new) {
            $this->setPhantom(false);
            $this->setDirty(false);
        }
    }

    protected function updateDestroyed($destroyed)
    {
        $this->destroyed = $destroyed;

        if ($destroyed) {
            $this->setPhantom(true);
        }
    }


    // instance methods
    public function getValues(array $options = [])
    {
        return $this->data;
    }
}
