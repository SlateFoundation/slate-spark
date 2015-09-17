<?php

namespace Emergence\ActiveRecord;

abstract class AbstractActiveRecord implements ActiveRecordInterface
{
    // static configuration
    public static $singularNoun = 'record';
    public static $pluralNoun = 'records';
    public static $collectionRoute = null;

    public static $fieldHandlers = [
    
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


    // static collection getterts


    // instance members
    protected $data;
    protected $phantom;
    protected $dirty;
    protected $valid;
    protected $new;
    protected $destroyed;


    // constructor
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
