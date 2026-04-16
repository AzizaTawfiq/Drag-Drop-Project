"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ProjectsList = void 0;
var _Base2 = require("./Base.js");
var _ProjectState = require("../store/ProjectState.js");
var _projectStatus = require("../utils/project-status.js");
var _Project = require("./Project.js");
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
var ProjectsList = exports.ProjectsList = /*#__PURE__*/function (_Base) {
  function ProjectsList(private status) {
    var _this;
    _classCallCheck(this, ProjectsList);
    _this = _callSuper(this, ProjectsList, ['projects-list', 'app', false, "".concat(status.toLowerCase(), "-projects")]);
    _this._renderProjectsList();
    if (JSON.parse(localStorage.getItem("projects"))) {
      var localStorageProjects = JSON.parse(localStorage.getItem("projects"));
      _this._showProjectInDom(localStorageProjects);
    }
    _ProjectState.projectState.pushListener(function (projects) {
      _this._showProjectInDom(projects);
    });
    return _this;
  }

  /**
   * @desc Renders the projects list based on the status (Initial, Active, Finished) and updates the DOM accordingly.
   */
  _inherits(ProjectsList, _Base);
  return _createClass(ProjectsList, [{
    key: "_renderProjectsList",
    value: function _renderProjectsList() {
      var title = this.element.querySelector('.title');
      var list = this.element.querySelector('ul');
      list.id = "".concat(this.status.toLowerCase(), "-list");
      title.textContent = "".concat(this.status, " Projects");
    }

    /**
     * @desc Renders the projects in the list based on the provided projects array and updates the DOM accordingly.
     * @param projects : ProjectRules[]
     * @return void
     */
  }, {
    key: "_renderProjects",
    value: function _renderProjects(projects) {
      var projectsList = document.getElementById("".concat(this.status.toLowerCase(), "-list"));
      projectsList.innerHTML = '';
      var _iterator = _createForOfIteratorHelper(projects),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var project = _step.value;
          new _Project.Project("".concat(this.status.toLowerCase(), "-list"), project);
          /* const content = this._createProjectElement(project);
             projectsList.innerHTML += content; */
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }

    /**
     * @desc Shows the projects in the DOM by filtering them based on the status and rendering them accordingly.
     * @return void
     */
  }, {
    key: "_showProjectInDom",
    value: function _showProjectInDom(projects) {
      var filteredProjects = this._filterProjectsByStatus(projects);
      this._renderProjects(filteredProjects);
    }

    /**
     * @desc Creates a project element and appends it to the projects list in the DOM.
     * @param project : ProjectRules
     * @return void
     */
    /*  private _createProjectElement(project: ProjectRules) {
         const content = ` 
         <div class="project" draggable="true" >
         <h2 class="project_title" id="project_title">${project.title}</h2>
         <p class="project_desc" id="project_desc">${project.desc}</p>
         </div>
         `
         return content
     } */

    /**
     * @desc Filters the projects based on the status (Initial, Active, Finished) and returns the filtered projects array.
     * @param projects : ProjectRules[]
     * @return filteredProjects : ProjectRules[]
     */
  }, {
    key: "_filterProjectsByStatus",
    value: function _filterProjectsByStatus(projects) {
      var _this2 = this;
      var filteredProjects = projects.filter(function (project) {
        if (_this2.status === 'Initial') {
          return project.status === _projectStatus.ProjectStatus.Initial;
        } else if (_this2.status === 'Active') {
          return project.status === _projectStatus.ProjectStatus.Active;
        } else if (_this2.status === 'Finished') {
          return project.status === _projectStatus.ProjectStatus.Finished;
        }
      });
      return filteredProjects;
    }
  }]);
}(_Base2.Base);