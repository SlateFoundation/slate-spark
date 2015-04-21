<?php

namespace Spark2;

class GradeLevel extends \ActiveRecord
{
    public static $tableName = 's2_grade_levels';

    public static $singularNoun = 'grade-level';
    public static $pluralNoun = 'grade-levels';

    public static $collectionRoute = '/spark2/grade-levels';

    public static $fields = [
        'ContextClass',
        'ContextID' => 'uint',
        'GK' => [
            'type' => 'boolean',
            'default' => false
        ],
        'G1' => [
            'type' => 'boolean',
            'default' => false
        ],
        'G2' => [
            'type' => 'boolean',
            'default' => false
        ],
        'G3' => [
            'type' => 'boolean',
            'default' => false
        ],
        'G4' => [
            'type' => 'boolean',
            'default' => false
        ],
        'G5' => [
            'type' => 'boolean',
            'default' => false
        ],
        'G6' => [
            'type' => 'boolean',
            'default' => false
        ],
        'G7' => [
            'type' => 'boolean',
            'default' => false
        ],
        'G8' => [
            'type' => 'boolean',
            'default' => false
        ],
        'G9'=> [
            'type' => 'boolean',
            'default' => false
        ],
        'G10' => [
            'type' => 'boolean',
            'default' => false
        ],
        'G11' => [
            'type' => 'boolean',
            'default' => false
        ],
        'G12'=> [
            'type' => 'boolean',
            'default' => false
        ],
    ];

    public static function calcGradeRange($input) {
        $ret = [];
        $len = count($input);

        $input = array_map(function($grade) {
            return (strtolower($grade) == 'k') ? 0 : (int) $grade;
        }, $input);

        asort($input);

        for ($i = 0; $i < $len; $i++) {
            $first = $last = $input[$i];

            while ($input[$i + 1] == $last + 1) {
                $last++;
                $i++;
            }

            array_push($ret, ($first == $last) ? $first : $first . "-" . $last);
        }

        $ret = str_replace('0-', 'K-', implode(",", $ret));

        return $ret == '0' ? 'K' : $ret;
    }

    public static $allGrades = ['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

    public function __get($key) {
        if (in_array($key, $this::$allGrades)) {
            return $this->getGrade($key);
        }
    }

    public function getGradeRange() {
        $grades = [];

        foreach ($this::$allGrades as $key => $value) {
            if ($this->getGrade($value)) {
                array_push($grades, $value);
            }
        }

        return $this::calcGradeRange($grades);
    }

    public function addGrade($grade) {
        $grade = ($grade == 0) ? 'K' : $grade;
        $this->setField('G' . $grade, true);
    }

    public function removeGrade($grade) {
        $grade = ($grade == 0) ? 'K' : $grade;
        $this->setField('G' . $grade, false);

    }

    public function setGrade($grade, $val) {
        $grade = ($grade == 0) ? 'K' : $grade;
        $this->setField('G' . $grade, $val);
    }

    public function getGrade($grade) {
        $grade = ($grade == 0) ? 'K' : $grade;
        return $this->getValue('G' . $grade);
    }
}
