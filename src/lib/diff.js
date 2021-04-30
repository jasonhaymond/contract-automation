/* diff.js
 *
 * This module is adapted from Scott Mebberson's array-sync module,
 * which is available on GitHub under the MIT license.
 *
 * https://github.com/smebberson/array-sync
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2016 Scott Mebberson
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

const keyComparator = (key) => (value1, value2) => value1[key] === value2[key];

const mapToKey = (arr, key) => arr.map((val) => val[key]);

const defaultNeedsUpdate = (obj1, obj2, ignoreKeys) =>
    Object.keys(obj1).some(
        (key) =>
            obj2.hasOwnProperty(key) &&
            obj1[key] !== obj2[key] &&
            !ignoreKeys.includes(key)
    );

const difference = (a, b, comparator) =>
    a.filter(
        (aValue) => b.find((bValue) => comparator(aValue, bValue)) === undefined
    );

const findNewValues = (source, updated, comparator) =>
    difference(updated, source, comparator);

const findChangedValues = (
    source,
    updated,
    comparator,
    { needsUpdate = defaultNeedsUpdate, ignoreKeys = [] } = {}
) =>
    updated.filter(
        (updatedValue) =>
            source.find(
                (sourceValue) =>
                    comparator(sourceValue, updatedValue) &&
                    needsUpdate(sourceValue, updatedValue, ignoreKeys)
            ) !== undefined
    );

const findRemovedValues = (source, updated, comparator) =>
    difference(source, updated, comparator);

const unidirectionalArrayDiff = (source, updated, key, updateOptions) => {
    const comparator = keyComparator(key);

    const newValues = findNewValues(source, updated, comparator);
    const changedValues = findChangedValues(
        source,
        updated,
        comparator,
        updateOptions
    );
    const removedValues = findRemovedValues(source, updated, comparator);

    return {
        newValues,
        changedValues,
        removedKeys: mapToKey(removedValues, key),
    };
};

module.exports = {
    unidirectionalArrayDiff,
};
