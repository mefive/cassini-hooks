"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ = _interopRequireWildcard(require("lodash"));

var _react = require("react");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var defaultErrorMessage = {
  required: '必填项需填写',
  pattern: '格式不匹配',
  validate: '验证未通过'
};

function formatRuleType(ruleType, name) {
  if (_typeof(ruleType) === 'object') {
    return ruleType;
  }

  return {
    value: ruleType,
    message: defaultErrorMessage[name]
  };
}

function validate(value, rule) {
  if (rule.required) {
    var _formatRuleType = formatRuleType(rule.required, 'required'),
        ruleValue = _formatRuleType.value,
        message = _formatRuleType.message;

    if (ruleValue && _.isEmpty(value)) {
      return message;
    }
  }

  if (rule.pattern) {
    var _formatRuleType2 = formatRuleType(rule.pattern, 'pattern'),
        _ruleValue = _formatRuleType2.value,
        _message = _formatRuleType2.message;

    if (!_ruleValue.test("".concat(value))) {
      return _message;
    }
  }

  if (rule.validate) {
    var _formatRuleType3 = formatRuleType(rule.validate, 'validate'),
        _ruleValue2 = _formatRuleType3.value,
        _message2 = _formatRuleType3.message;

    if (!_ruleValue2(value)) {
      return _message2;
    }
  }

  return null;
}

function useForm(options) {
  var _useState = (0, _react.useState)(options.defaultValues || {}),
      _useState2 = _slicedToArray(_useState, 2),
      defaultValues = _useState2[0],
      setDefaultValues = _useState2[1];

  var _useState3 = (0, _react.useState)(defaultValues),
      _useState4 = _slicedToArray(_useState3, 2),
      values = _useState4[0],
      setValues = _useState4[1];

  var _useState5 = (0, _react.useState)({}),
      _useState6 = _slicedToArray(_useState5, 2),
      errors = _useState6[0],
      setErrors = _useState6[1];

  var _useState7 = (0, _react.useState)(false),
      _useState8 = _slicedToArray(_useState7, 2),
      dirty = _useState8[0],
      setDirty = _useState8[1];

  var rules = {};
  var bind = (0, _react.useCallback)(function (name, rule) {
    if (rule) {
      rules["".concat(name)] = rule;
    }

    return {
      value: values && values[name],
      onChange: function onChange(valueOrEvent) {
        var value = 'target' in valueOrEvent ? valueOrEvent.target.value : valueOrEvent;

        var valuesNew = _objectSpread({}, values, _defineProperty({}, name, value));

        if (name in errors) {
          setErrors(_.omit(errors, ["".concat(name)]));
        }

        setValues(valuesNew);
        setDirty(!_.isEqual(valuesNew, defaultValues));
      }
    };
  }, [values, rules, errors]);
  var triggerValidation = (0, _react.useCallback)(function (k) {
    var keys = k || Object.keys(values);
    var errs = {};
    keys.forEach(function (key) {
      var rule = rules["".concat(key)];

      if (rule == null) {
        return;
      }

      var value = values[key];
      var message = validate(value, rule);

      if (message) {
        errs["".concat(key)] = message;
      }
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [values, rules]);
  var reset = (0, _react.useCallback)(function (values1) {
    setDefaultValues(values1);
    setValues(values1);
    setDirty(false);
  }, []);
  return {
    bind: bind,
    reset: reset,
    values: values,
    triggerValidation: triggerValidation,
    dirty: dirty,
    errors: errors,
    setErrors: setErrors
  };
}

var _default = useForm;
exports["default"] = _default;