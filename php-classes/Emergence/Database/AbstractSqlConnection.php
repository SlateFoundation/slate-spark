<?php

namespace Emergence\Database;

use PDO;

/**
 * Provides a base class for implementing SQL connection types.
 *
 * Subclasses MUST declare a local `public static $defaultInstance`
 */
abstract class AbstractSqlConnection implements SqlConnectionInterface
{
    protected $pdo;



    // instance management:

    /**
     * Create connection wrapper instance from given PDO instance or PDO DSN string
     *
     * Subclasses may override this method to support additional techniques for turning
     * non-instance configuration into an instance.
     */
    public static function createInstance($pdo)
    {
        if ($pdo && is_string($pdo)) {
            $pdo = new PDO($pdo);
        } elseif (!$pdo instanceof PDO) {
            throw new \Exception('$pdo for createInstance must be a DSN string or PDO instance');
        }

        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        return new static($pdo);
    }

    /**
     * Returns whether this connection type has a default instance configured or instantiated,
     * without instantiating it if it's only configured
     */
    public static function hasDefaultInstance()
    {
        return (boolean)static::$defaultInstance;
    }

    /**
     * Returns default instance for this connection type, attempting to instantiate it if needed
     */
    public static function getDefaultInstance()
    {
        if (!static::$defaultInstance instanceof static) {
            if (!static::$defaultInstance = static::createInstance(static::$defaultInstance)) {
                throw new \Exception('Unable to create default instance of ' . get_called_class());
            }
        }

        return static::$defaultInstance;
    }

    /**
     * Sets the default instance or instance config for this connection type
     */
    public static function setDefaultInstance($instance)
    {
        static::$defaultInstance = $instance;
    }



    // instance methods:

    /**
     * Create connection wrapper instance for given PDO instance
     */
    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    /**
     * Quote a scalar value to be used directly in an SQL query
     */
    public function quoteValue($value)
    {
        return $this->pdo->quote($value);
    }

    /**
     * Quote an identifier name to be used directly in an SQL query
     */
    public function quoteIdentifier($identifier)
    {
        return '"' . str_replace('"', '""', $identifier) . '"';
    }

    /**
     * Prepare and execute a query statement, returning the statement reference
     */
    public function query($query, $params = [])
    {
        $statement = $this->pdo->prepare($query);

        $statement->execute($params);

        return $statement;
    }

    /**
     * Prepare and execute a non-query statement, immediately closing the result cursor
     */
    public function nonQuery($query, $params = [])
    {
        $statement = $this->pdo->prepare($query);

        $statement->execute($params);

        $statement->closeCursor();

        return true;
    }

    /**
     * Prepare and execute a query, returning an associative array of the first returned row
     * and immediately closing the result cursor
     */
    public function oneRow($query, $params = [])
    {
        $statement = $this->query($query, $params);

        try {
            return $statement->fetch(PDO::FETCH_ASSOC);
        } finally {
            $statement->closeCursor();
        }
    }

    /**
     * Prepare and execute a query, returning a generator for all returned rows as
     * associative arrays. Frees result cursor when generator is drained
     */
    public function allRows($query, $params = [])
    {
        $statement = $this->query($query, $params);

        try {
            while ($row = $statement->fetch(PDO::FETCH_ASSOC)) {
                yield $row;
            }
        } finally {
            $statement->closeCursor();
        }
    }
    
    public function select(array $options)
    {
        $query = 'SELECT';

        // columns
        if (!empty($options['columns'])) {
            if (is_array($options['columns'])) {
                $select = implode(', ', $options['columns']);
            } else {
                $select = $options['columns'];
            }
        } elseif(!empty($options['from'])) {
            $select = '*';
        } else {
            throw new \Exception('SELECT query must have columns or from configured');
        }

        $query .= ' ' . $select;


        // from
        if (!empty($options['from'])) {
            if (is_array($options['from'])) {
                $from = [];
                foreach ($options['from'] AS $fromAlias => $fromValue) {
                    $from[] = $fromValue . ( is_string($fromAlias) ? ' AS ' . $fromAlias : '' );
                }
                $from = implode(', ', $from);
            } else {
                $from = $options['from'];
            }

            $query .= ' FROM ' . $from;
        }


        // join
        if (!empty($options['join'])) {
            if (is_array($options['join'])) {
                $join = implode(' ', $options['join']);
            } else {
                $join = $options['join'];
            }

            $query .= ' ' . $join;
        }


        // where
        if (!empty($options['where'])) {
            if (is_array($options['where'])) {
                $where = [];
                foreach ($options['where'] AS $whereKey => $whereValue) {
                    if (is_string($whereKey)) {
                        $where[] = $this->quoteIdentifier($whereKey) . ' = ' . $this->quoteValue($whereValue);
                    } else {
                        $where[] = $whereValue;
                    }
                }
                $where = '(' . implode(') AND (', $where) . ')';
            } else {
                $where = $options['where'];
            }

            $query .= ' WHERE ' . $where;
        }


        // group
        if (!empty($options['group'])) {
            if (is_array($options['group'])) {
                $group = implode(', ', $options['group']);
            } else {
                $group = $options['group'];
            }

            $query .= ' GROUP BY ' . $group;
        }


        // order
        if (!empty($options['order'])) {
            if (is_array($options['order'])) {
                $order = [];
                foreach ($options['order'] AS $orderKey => $orderValue) {
                    if (is_string($orderKey)) {
                        $order[] = $orderKey . ' ' . $orderValue;
                    } else {
                        $order[] = $orderValue;
                    }
                }
                $order = implode(', ', $order);
            } else {
                $order = $options['order'];
            }

            $query .= ' ORDER BY ' . $order;
        }


        // limit
        if (!empty($options['limit'])) {
            $query .= ' LIMIT ' . $options['limit'];
        }


        // offset
        if (!empty($options['offset'])) {
            $query .= ' OFFSET ' . $options['offset'];
        }


        // params
        if (!empty($options['params'])) {
            if (!is_array($options['params'])) {
                $params = [$options['params']];
            } else {
                $params = $options['params'];
            }
        } else {
            $params = [];
        }

        return $this->query($query, $params);
    }

    public function selectOne(array $options)
    {
        $options['limit'] = 1;

        $statement = $this->select($options);

        try {
            return $statement->fetch(PDO::FETCH_ASSOC);
        } finally {
            $statement->closeCursor();
        }
    }

    public function selectAll(array $options)
    {
        $statement = $this->select($options);

        try {
            while ($row = $statement->fetch(PDO::FETCH_ASSOC)) {
                yield $row;
            }
        } finally {
            $statement->closeCursor();
        }
    }
}