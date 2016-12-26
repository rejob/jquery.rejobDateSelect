(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * RejobDataSelect
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
var RejobDataSelect = function () {
  /**
   * @param {Element}     yearSelect
   * @param {Element}     monthSelect
   * @param {Element}     dateSelect
   * @param {Object[]}    yearOptions
   * @param {number|null} yearOptions[].value
   * @param {Element}     yearOptions[].element
   * @param {Object[]}    monthOptions
   * @param {number|null} monthOptions[].value
   * @param {Element}     monthOptions[].element
   * @param {Object[]}    dateOptions
   * @param {number|null} dateOptions[].value
   * @param {Element}     dateOptions[].element
   */
  function RejobDataSelect(yearSelect, monthSelect, dateSelect, yearOptions, monthOptions, dateOptions) {
    _classCallCheck(this, RejobDataSelect);

    this.start = null;
    this.end = null;

    this.yearSelect = yearSelect;
    this.monthSelect = monthSelect;
    this.dateSelect = dateSelect;

    this.yearOptions = yearOptions;
    this.monthOptions = monthOptions;
    this.dateOptions = dateOptions;

    this.year = {};
    this.month = {};
    this.date = {};

    this.setHandlers();
  }

  _createClass(RejobDataSelect, [{
    key: 'setHandlers',
    value: function setHandlers() {
      var _this = this;

      var handler = function handler(e) {
        return _this.onChange(e);
      };

      this.yearSelect.addEventListener('click', handler, false);
      this.yearSelect.addEventListener('touchend', handler, false);
      this.yearSelect.addEventListener('change', handler, false);

      this.monthSelect.addEventListener('click', handler, false);
      this.monthSelect.addEventListener('touchend', handler, false);
      this.monthSelect.addEventListener('change', handler, false);

      this.dateSelect.addEventListener('click', handler, false);
      this.dateSelect.addEventListener('touchend', handler, false);
      this.dateSelect.addEventListener('change', handler, false);
    }

    /**
     * @param {Date} date
     * @returns {RejobDataSelect}
     */

  }, {
    key: 'setStart',
    value: function setStart(date) {
      this.start = date;
      return this;
    }

    /**
     * @param {Date} date
     * @returns {RejobDataSelect}
     */

  }, {
    key: 'setEnd',
    value: function setEnd(date) {
      this.end = date;
      return this;
    }

    /**
     * @param {Array} arr
     * @param {Function} callback
     * @returns {*}
     */

  }, {
    key: 'findInArray',
    value: function findInArray(arr, callback) {
      if (arr === null || typeof callback !== 'function') {
        return undefined;
      }

      var list = Object(arr);
      var length = list.length >>> 0;
      var value = void 0;

      for (var i = 0; i < length; i++) {
        value = list[i];
        if (callback.call(null, value, i, list)) {
          return value;
        }
      }

      return undefined;
    }

    /**
     * 年月からその月が何日まであるかを返します
     *
     * @param {string|number} year
     * @param {string|number} month
     * @returns {number}
     */

  }, {
    key: 'getDaysOfMonth',
    value: function getDaysOfMonth(year, month) {
      if (!month) {
        return 31;
      }

      if (!year) {
        if (month === 2) {
          // 年 がないと 2月は何日まであるか決められない
          return 29;
        }

        year = new Date().getFullYear();
      }

      return new Date(year, month - 1 + 1, 0).getDate();
    }
  }, {
    key: 'isChanged',
    value: function isChanged() {
      var year = this.findInArray(this.yearOptions, function (data) {
        return data.element.selected;
      });
      var month = this.findInArray(this.monthOptions, function (data) {
        return data.element.selected;
      });
      var date = this.findInArray(this.dateOptions, function (data) {
        return data.element.selected;
      });

      if (this.year.value === year.value && this.month.value === month.value && this.date.value === date.value) {
        return false;
      }

      this.year = year;
      this.month = month;
      this.date = date;

      return true;
    }
  }, {
    key: 'optionFilter',
    value: function optionFilter(options, start, end, current) {
      var selectMin = current.value && current.value < start;
      var selectMax = current.value && current.value > end;

      for (var i = 0; i < options.length; i++) {
        var option = options[i];

        if (!option.value) {
          continue;
        }

        if (option.value >= start && option.value <= end) {
          option.element.disabled = false;
          option.element.style.display = '';

          if (selectMax) {
            option.element.selected = true;
            current = option;
          } else if (selectMin) {
            selectMin = false;
            option.element.selected = true;
            current = option;
          }
        } else {
          option.element.disabled = true;
          option.element.style.display = 'none';
        }
      }

      return current;
    }
  }, {
    key: 'onChange',
    value: function onChange() {
      if (!this.isChanged()) {
        return true;
      }

      // change year
      var yearStart = this.start ? this.start.getFullYear() : 1000;
      var yearEnd = this.end ? this.end.getFullYear() : 9999;
      this.year = this.optionFilter(this.yearOptions, yearStart, yearEnd, this.year);

      // change month
      var isSameYearBetweenStartEnd = this.start && this.end && this.start.getFullYear() === this.end.getFullYear();
      var isStartYear = this.start && this.year.value && this.start.getFullYear() === this.year.value;
      var isEndYear = this.end && this.year.value && this.end.getFullYear() === this.year.value;

      var monthStart = isSameYearBetweenStartEnd || isStartYear ? this.start.getMonth() + 1 : 1;
      var monthEnd = isSameYearBetweenStartEnd || isEndYear ? this.end.getMonth() + 1 : 12;
      this.month = this.optionFilter(this.monthOptions, monthStart, monthEnd, this.month);

      // change date
      var isSameMonthBetweenStartEnd = isSameYearBetweenStartEnd && this.start.getMonth() === this.end.getMonth();
      var isStartMonth = isStartYear && this.month.value && this.start.getMonth() + 1 === this.month.value;
      var isEndMonth = isEndYear && this.month.value && this.end.getMonth() + 1 === this.month.value;

      var dateStart = isSameMonthBetweenStartEnd || isStartMonth ? this.start.getDate() : 1;
      var dateEnd = isSameMonthBetweenStartEnd || isEndMonth ? this.end.getDate() : this.getDaysOfMonth(this.year.value, this.month.value);
      this.date = this.optionFilter(this.dateOptions, dateStart, dateEnd, this.date);

      return true;
    }
  }]);

  return RejobDataSelect;
}();

exports.default = RejobDataSelect;

},{}],2:[function(require,module,exports){
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

var _RejobDataSelect = require('./RejobDataSelect');

var _RejobDataSelect2 = _interopRequireDefault(_RejobDataSelect);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var $ = jQuery || $;

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
$.fn.rejobDateSelect = function () {
  var defaultOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  defaultOptions = $.extend(true, {}, {
    start: null,
    end: null,
    year: null,
    month: null,
    date: null,
    years: [],
    months: [],
    dates: []
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
    var $temp = $target.find(selector);
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
  function collectOptions($target) {
    var regexpValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : /^[0-9]{1,2}$/m;

    return $target.find('*').map(function () {
      var $option = $(this);
      var value = $option.is('option') ? $.trim($option.data('rejobDateSelectValue') || $option.val()) : '';
      return {
        value: value.match(regexpValue) ? parseInt(value, 10) : null,
        element: $option[0]
      };
    }).get();
  }

  return this.each(function () {
    var $target = $(this);
    var options = $.extend(true, {}, defaultOptions, $target.data('rejobDateSelect') || {});

    options = assignOptions($target.data(), options);

    var $year = findFallback($, $target, options.year);
    var $month = findFallback($, $target, options.month);
    var $date = findFallback($, $target, options.date);

    if (!options.years || !options.years.length) {
      options.years = collectOptions($year, /^[0-9]{4}$/m);
    }
    if (!options.months || !options.months.length) {
      options.months = collectOptions($month);
    }
    if (!options.dates || !options.dates.length) {
      options.dates = collectOptions($date);
    }

    var dataSelect = new _RejobDataSelect2.default($year[0], $month[0], $date[0], options.years, options.months, options.dates);
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
$(function () {
  $('[data-rejob-date-select]').rejobDateSelect();
});

},{"./RejobDataSelect":1}]},{},[2]);
