<a name="module_util"></a>
## util

* [util](#module_util)
  * [.rnd(a, b)](#module_util.rnd) ⇒ <code>Number</code> &#124; <code>String</code> &#124; <code>Boolean</code> &#124; <code>Array</code> &#124; <code>Object</code>
  * [.filterObjectKeys(keys, obj)](#module_util.filterObjectKeys) ⇒ <code>Object</code>
  * [.gradeRangeToArray(gradeRange, [returnNumbers])](#module_util.gradeRangeToArray) ⇒ <code>Array</code>
  * [.arrayToGradeRange(input, [pkStr])](#module_util.arrayToGradeRange) ⇒ <code>String</code>
  * [.isGteZero(str)](#module_util.isGteZero) ⇒ <code>Boolean</code>
  * [.isAsnId(code)](#module_util.isAsnId) ⇒ <code>Boolean</code>
  * [.isMatchbookId(code)](#module_util.isMatchbookId) ⇒ <code>Boolean</code>
  * [.isAsnStyleId(code)](#module_util.isAsnStyleId) ⇒ <code>Boolean</code>

<a name="module_util.rnd"></a>
### util.rnd(a, b) ⇒ <code>Number</code> &#124; <code>String</code> &#124; <code>Boolean</code> &#124; <code>Array</code> &#124; <code>Object</code>
A helper function to generate random numbers and pick random (un)weighted values from a set of values

**Kind**: static method of <code>[util](#module_util)</code>  
**Returns**: <code>Number</code> &#124; <code>String</code> &#124; <code>Boolean</code> &#124; <code>Array</code> &#124; <code>Object</code> - randomValue  

| Param | Type |
| --- | --- |
| a | <code>Object</code> &#124; <code>Array</code> &#124; <code>Number</code> | 
| b | <code>Number</code> | 

**Example**  
```js
// returns a random number between min and max (defaults to 0,100 if called with no arguments)
rnd(min,max)
```
**Example**  
```js
// returns a random value from array (evenly weighted)
rnd(['a', 'b', 'c'])
```
**Example**  
```js
// returns a random value key weighted by val (win: 89%, mac: %9, lin: 2%)
rnd({win: .89,  mac: .09 , lin: .02})
```
**Example**  
```js
// returns a random truthy/falsey value (50/50)
rnd(0,1)
```
**Example**  
```js
// returns a random boolean value (50/50)
rnd([true, false])
```
**Example**  
```js
// returns 'pizza' (1:2) 'chicken fingers' (1:4) or 'cheese streak' (1:4)
rnd({'pizza': .5, 'chicken fingers': .25, 'cheese steak': .25})
```
<a name="module_util.filterObjectKeys"></a>
### util.filterObjectKeys(keys, obj) ⇒ <code>Object</code>
Returns a copy of an object minus the properties in keys

**Kind**: static method of <code>[util](#module_util)</code>  

| Param | Type |
| --- | --- |
| keys | <code>Array</code> | 
| obj | <code>Object</code> | 

<a name="module_util.gradeRangeToArray"></a>
### util.gradeRangeToArray(gradeRange, [returnNumbers]) ⇒ <code>Array</code>
Returns an array of grades when provided a range (including sprase ranges).

**Kind**: static method of <code>[util](#module_util)</code>  
**See**: [arrayToGradeRange](#module_util.arrayToGradeRange) for the reverse of this function.

**Important:** The output when using `returnsNumber=true` is not valid input for `arrayToGradeRange`  

| Param | Type | Default |
| --- | --- | --- |
| gradeRange | <code>String</code> |  | 
| [returnNumbers] | <code>Boolean</code> | <code>false</code> | 

**Example**  
```js
// returns [ 'PK', 'K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12' ]
gradeRangeToArray('PK-2,3-5,6-8,9-12')
```
**Example**  
```js
// returns [ 'K', '1', '2', '3', '4', '5', '6', '7', '8' ]
gradeRangeToArray('K-8')
```
**Example**  
```js
// returns [ -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ]
gradeRangeToArray('P-2,3-5,6-8,9-12', true)
```
<a name="module_util.arrayToGradeRange"></a>
### util.arrayToGradeRange(input, [pkStr]) ⇒ <code>String</code>
Returns a grade range as a string (including sprase ranges).

**Kind**: static method of <code>[util](#module_util)</code>  
**See**: [gradeRangeToArray](#module_util.gradeRangeToArray) for the reverse of this function.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| input | <code>String</code> |  |  |
| [pkStr] | <code>String</code> | <code>P</code> | the abbreviation to use for Pre-Kindergarten |

**Example**  
```js
// returns 'PK-2,3-5,6-8,9-12'
arrayToGradeRange([ 'PK', 'K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12' ], 'PK')
```
**Example**  
```js
// returns 'K-8'
arrayToGradeRange([ 'K', '1', '2', '3', '4', '5', '6', '7', '8' ])
```
<a name="module_util.isGteZero"></a>
### util.isGteZero(str) ⇒ <code>Boolean</code>
Returns a boolean indicating whether the given string is a number greater than zero

**Kind**: static method of <code>[util](#module_util)</code>  

| Param | Type |
| --- | --- |
| str | <code>String</code> | 

<a name="module_util.isAsnId"></a>
### util.isAsnId(code) ⇒ <code>Boolean</code>
Returns a boolean indicating whether the given string contains an ASN ID in the following format:
- 56-bit (7 character) hexadecimal numbers prefixed with S (8 characters total)

**Kind**: static method of <code>[util](#module_util)</code>  

| Param | Type |
| --- | --- |
| code | <code>String</code> | 

<a name="module_util.isMatchbookId"></a>
### util.isMatchbookId(code) ⇒ <code>Boolean</code>
Returns a boolean indicating whether the given string contains a Matchbook ID in the following format:
- zero-filled decimal numbers with a maximum value of 9,999,999 prefixed with M (8 characters total)

**Kind**: static method of <code>[util](#module_util)</code>  

| Param | Type |
| --- | --- |
| code | <code>String</code> | 

<a name="module_util.isAsnStyleId"></a>
### util.isAsnStyleId(code) ⇒ <code>Boolean</code>
Returns a boolean indicating whether the given string contains an ASN or Matchbook ID in the following formats:
- Matchbook: zero-filled decimal numbers with a maximum value of 9,999,999 prefixed with M (8 characters total)
- ASN: 56-bit (7 character) hexadecimal numbers prefixed with S (8 characters total)

**Kind**: static method of <code>[util](#module_util)</code>  

| Param | Type |
| --- | --- |
| code | <code>String</code> | 

