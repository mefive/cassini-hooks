"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var _ = __importStar(require("lodash"));
function getDataSource(treeData, expandedRowKeys) {
    var rows = [];
    var walk = function (nodes, level) {
        if (level === void 0) { level = 0; }
        nodes.forEach(function (node) {
            var children = node.children;
            rows.push(__assign(__assign({}, _.omit(node, ['children'])), { level: level, children: children && children.map(function (c) { return c.key; }) }));
            if (children && expandedRowKeys.includes(node.key)) {
                walk(children, level + 1);
            }
        });
    };
    if (treeData != null) {
        walk(treeData);
    }
    return rows;
}
function useTree(treeData, defaultExpandedKeys) {
    if (defaultExpandedKeys === void 0) { defaultExpandedKeys = []; }
    var _a = react_1.useState(defaultExpandedKeys), expandedKeys = _a[0], setExpandedKeys = _a[1];
    var _b = react_1.useState(getDataSource(treeData, expandedKeys)), dataSource = _b[0], setDataSource = _b[1];
    react_1.useEffect(function () {
        setDataSource(getDataSource(treeData, expandedKeys));
    }, [treeData, expandedKeys]);
    return {
        dataSource: dataSource,
        expandedKeys: expandedKeys,
        setExpandedKeys: setExpandedKeys,
    };
}
exports.default = useTree;
