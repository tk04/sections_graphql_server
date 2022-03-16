"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tweet = exports.Media = exports.Poll = exports.TweetUser = void 0;
const type_graphql_1 = require("type-graphql");
let TweetUser = class TweetUser {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], TweetUser.prototype, "profile_image_url", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Boolean)
], TweetUser.prototype, "verified", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], TweetUser.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], TweetUser.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], TweetUser.prototype, "username", void 0);
TweetUser = __decorate([
    (0, type_graphql_1.ObjectType)()
], TweetUser);
exports.TweetUser = TweetUser;
let Poll = class Poll {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], Poll.prototype, "label", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], Poll.prototype, "votes", void 0);
Poll = __decorate([
    (0, type_graphql_1.ObjectType)()
], Poll);
exports.Poll = Poll;
let Media = class Media {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], Media.prototype, "media_key", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], Media.prototype, "type", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], Media.prototype, "url", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], Media.prototype, "preview_image_url", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], Media.prototype, "width", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], Media.prototype, "height", void 0);
Media = __decorate([
    (0, type_graphql_1.ObjectType)()
], Media);
exports.Media = Media;
let Tweet = class Tweet {
};
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], Tweet.prototype, "text", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], Tweet.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], Tweet.prototype, "likes", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", TweetUser)
], Tweet.prototype, "user", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], Tweet.prototype, "retweets", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], Tweet.prototype, "replies", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Poll], { nullable: true }),
    __metadata("design:type", Array)
], Tweet.prototype, "pollOptions", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Media], { nullable: true }),
    __metadata("design:type", Array)
], Tweet.prototype, "media", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], Tweet.prototype, "url", void 0);
Tweet = __decorate([
    (0, type_graphql_1.ObjectType)()
], Tweet);
exports.Tweet = Tweet;
