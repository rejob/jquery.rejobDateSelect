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
export default class RejobDataSelect {
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
  constructor(yearSelect, monthSelect, dateSelect, yearOptions, monthOptions, dateOptions) {
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

  setHandlers() {
    const handler = (e) => { return this.onChange(e); };

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
  setStart(date) {
    this.start = date;
    return this;
  }

  /**
   * @param {Date} date
   * @returns {RejobDataSelect}
   */
  setEnd(date) {
    this.end = date;
    return this;
  }

  /**
   * @param {Array} arr
   * @param {Function} callback
   * @returns {*}
   */
  findInArray(arr, callback) {
    if (arr === null || typeof callback !== 'function') {
      return undefined;
    }

    const list = Object(arr);
    const length = list.length >>> 0;
    let value;

    for (let i = 0; i < length; i++) {
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
  getDaysOfMonth(year, month) {
    if (!month) {
      return 31;
    }

    if (!year) {
      if (month === 2) {
        // 年 がないと 2月は何日まであるか決められない
        return 29;
      }

      year = (new Date).getFullYear();
    }

    return (new Date(year, (month - 1) + 1, 0)).getDate();
  }

  isChanged() {
    const year = this.findInArray(this.yearOptions, (data) => {
      return data.element.selected;
    });
    const month = this.findInArray(this.monthOptions, (data) => {
      return data.element.selected;
    });
    const date = this.findInArray(this.dateOptions, (data) => {
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

  optionFilter(options, start, end, current) {
    let selectMin = current.value && current.value < start;
    let selectMax = current.value && current.value > end;

    for (let i = 0; i < options.length; i++) {
      let option = options[i];

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

  onChange() {
    if (!this.isChanged()) {
      return true;
    }

    // change year
    const yearStart = this.start ? this.start.getFullYear() : 1000;
    const yearEnd = this.end ? this.end.getFullYear() : 9999;
    this.year = this.optionFilter(this.yearOptions, yearStart, yearEnd, this.year);

    // change month
    const isSameYearBetweenStartEnd = this.start && this.end && this.start.getFullYear() === this.end.getFullYear();
    const isStartYear = this.start && this.year.value && this.start.getFullYear() === this.year.value;
    const isEndYear = this.end && this.year.value && this.end.getFullYear() === this.year.value;

    const monthStart = isSameYearBetweenStartEnd || isStartYear ? this.start.getMonth() + 1 : 1;
    const monthEnd = isSameYearBetweenStartEnd || isEndYear ? this.end.getMonth() + 1 : 12;
    this.month = this.optionFilter(this.monthOptions, monthStart, monthEnd, this.month);

    // change date
    const isSameMonthBetweenStartEnd = isSameYearBetweenStartEnd && this.start.getMonth() === this.end.getMonth();
    const isStartMonth = isStartYear && this.month.value && (this.start.getMonth() + 1) === this.month.value;
    const isEndMonth = isEndYear && this.month.value && (this.end.getMonth() + 1) === this.month.value;

    const dateStart = isSameMonthBetweenStartEnd || isStartMonth
      ? this.start.getDate()
      : 1;
    const dateEnd = isSameMonthBetweenStartEnd || isEndMonth
      ? this.end.getDate()
      : this.getDaysOfMonth(this.year.value, this.month.value);
    this.date = this.optionFilter(this.dateOptions, dateStart, dateEnd, this.date);

    return true;
  }
}
