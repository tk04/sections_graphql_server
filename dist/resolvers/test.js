"use strict";
var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
          ? (desc = Object.getOwnPropertyDescriptor(target, key))
          : desc,
      d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
var __metadata =
  (this && this.__metadata) ||
  function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
      return Reflect.metadata(k, v);
  };
var __param =
  (this && this.__param) ||
  function (paramIndex, decorator) {
    return function (target, key) {
      decorator(target, key, paramIndex);
    };
  };
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestResolver = void 0;
const type_graphql_1 = require("type-graphql");
const user_1 = require("../entities/user");
let TestResolver = class TestResolver {
  name(root) {
    return "FIELD RESOLVER YAY";
  }
  test() {
    return { name: "tk", age: 20, title: "title" };
  }
};
__decorate(
  [
    (0, type_graphql_1.FieldResolver)(),
    __param(0, (0, type_graphql_1.Root)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [
      typeof (_a = typeof user_1.Recipe !== "undefined" && user_1.Recipe) ===
      "function"
        ? _a
        : Object,
    ]),
    __metadata("design:returntype", void 0),
  ],
  TestResolver.prototype,
  "name",
  null
);
__decorate(
  [
    (0, type_graphql_1.Query)(() => user_1.Recipe),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0),
  ],
  TestResolver.prototype,
  "test",
  null
);
TestResolver = __decorate(
  [(0, type_graphql_1.Resolver)(user_1.Recipe)],
  TestResolver
);
exports.TestResolver = TestResolver;
