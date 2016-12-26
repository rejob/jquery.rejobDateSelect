/**
 * jquery.rejobDateSelect
 * https://github.com/rejob/jquery.rejobDateSelect
 *
 * @license
 * Copyright (c) 2016 Koji Iwasaki, REJOB Co., Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
'use strict';

import RejobDataSelect from './RejobDataSelect';
const $ = jQuery || $;

/**
 *
 * @param {Object} [defaultOptions={}]
 * @param {string} [defaultOptions.start]
 * @param {string} [defaultOptions.end]
 * @param {*} [defaultOptions.year]
 * @param {*} [defaultOptions.month]
 * @param {*} [defaultOptions.date]
 * @param {Array} [defaultOptions.years=[]]
 * @param {Array} [defaultOptions.months=[]]
 * @param {Array} [defaultOptions.dates=[]]
 * @returns {Object}
 */
$.fn.rejobDateSelect = function (defaultOptions = {}) {
  defaultOptions = $.extend(true, {}, {
    start: null,
    end: null,
    year: null,
    month: null,
    date: null,
    years: [],
    months: [],
    dates: [],
  }, defaultOptions);

  /**
   * @param {Object} data
   * @param {Object} options
   * @returns {Object}
   */
  function assignOptions(data, options) {
    if (data['rejobDateSelectStart']) {
      options.start = data['rejobDateSelectStart'];
    }

    if (data['rejobDateSelectEnd']) {
      options.end = data['rejobDateSelectEnd'];
    }

    if (data['rejobDateSelectYear']) {
      options.year = data['rejobDateSelectYear'];
    }

    if (data['rejobDateSelectMonth']) {
      options.month = data['rejobDateSelectMonth'];
    }

    if (data['rejobDateSelectDate']) {
      options.date = data['rejobDateSelectDate'];
    }

    return options;
  }

  /**
   * @param $
   * @param $target
   * @param selector
   * @returns {Object|null}
   */
  function findFallback($, $target, selector) {
    let $temp = $target.find(selector);
    if ($temp.size() >= 1) {
      return $temp.eq(0);
    }

    $temp = $('body').find(selector);
    if ($temp.size() >= 1) {
      return $temp.eq(0);
    }
  }

  /**
   * @param $target
   * @param {RegExp} regexpValue
   */
  function collectOptions($target, regexpValue = /^[0-9]{1,2}$/m) {
    return $target.find('*').map(function () {
      const $option = $(this);
      const value = $option.is('option') ? $.trim(($option.data('rejobDateSelectValue') || $option.val())) : '';
      return {
        value: value.match(regexpValue) ? parseInt(value, 10) : null,
        element: $option[0],
      };
    }).get();
  }

  return this.each(function () {
    const $target = $(this);
    let options = $.extend(true, {}, defaultOptions, $target.data('rejobDateSelect') || {});

    options = assignOptions($target.data(), options);

    const $year = findFallback($, $target, options.year);
    const $month = findFallback($, $target, options.month);
    const $date = findFallback($, $target, options.date);

    if (!options.years || !options.years.length) {
      options.years = collectOptions($year, /^[0-9]{4}$/m);
    }
    if (!options.months || !options.months.length) {
      options.months = collectOptions($month);
    }
    if (!options.dates || !options.dates.length) {
      options.dates = collectOptions($date);
    }

    const dataSelect = new RejobDataSelect($year[0], $month[0], $date[0], options.years, options.months, options.dates);
    if (options.start) {
      dataSelect.setStart(new Date(options.start));
    }
    if (options.end) {
      dataSelect.setEnd(new Date(options.end));
    }
    dataSelect.onChange(); // initialize
  });
};

// initialize
$(() => {
  $('[data-rejob-date-select]').rejobDateSelect();
});
