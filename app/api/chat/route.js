"use strict";
/**
 * Chat API Route
 * Handles streaming chat requests with Gemini 2.5-Flash
 * Supports text, images, and tool calling
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = exports.maxDuration = exports.runtime = void 0;
var ai_1 = require("ai");
var provider_1 = require("@/lib/ai/provider");
var agent_1 = require("@/lib/ai/agent"); // ensure correct import path
var db_1 = require("@/lib/db");
exports.runtime = 'edge'; // ✅ ensures streaming compatibility on Vercel Edge
exports.maxDuration = 30;
function POST(req) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, messages, inputSessionId, data, sessionId_1, newSession, session, lastMessage, imageUrl, titlePreview, coreMessages, stream, error_1;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 9, , 10]);
                    return [4 /*yield*/, req.json()];
                case 1:
                    _a = _b.sent(), messages = _a.messages, inputSessionId = _a.sessionId, data = _a.data;
                    sessionId_1 = inputSessionId;
                    if (!!sessionId_1) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, db_1.createSession)()];
                case 2:
                    newSession = _b.sent();
                    sessionId_1 = newSession.id;
                    _b.label = 3;
                case 3: return [4 /*yield*/, (0, db_1.getSession)(sessionId_1)];
                case 4:
                    session = _b.sent();
                    if (!session) {
                        return [2 /*return*/, new Response('Session not found', { status: 404 })];
                    }
                    lastMessage = messages[messages.length - 1];
                    if (!((lastMessage === null || lastMessage === void 0 ? void 0 : lastMessage.role) === 'user')) return [3 /*break*/, 7];
                    imageUrl = (data === null || data === void 0 ? void 0 : data.imageUrl) || null;
                    return [4 /*yield*/, (0, db_1.saveMessage)(sessionId_1, 'user', lastMessage.content, imageUrl)];
                case 5:
                    _b.sent();
                    if (!(session.title === 'New Chat' && session.messages.length === 0)) return [3 /*break*/, 7];
                    titlePreview = lastMessage.content.slice(0, 50);
                    return [4 /*yield*/, (0, db_1.updateSessionTitle)(sessionId_1, titlePreview)];
                case 6:
                    _b.sent();
                    _b.label = 7;
                case 7:
                    coreMessages = (0, ai_1.convertToCoreMessages)(messages);
                    return [4 /*yield*/, (0, ai_1.streamText)({
                            model: provider_1.geminiFlash,
                            messages: coreMessages,
                            tools: agent_1.tools,
                            temperature: provider_1.modelConfig.temperature,
                            topP: provider_1.modelConfig.topP,
                            maxOutputTokens: provider_1.modelConfig.maxOutputTokens,
                            onFinish: function (_a) {
                                var text = _a.text, finishReason = _a.finishReason;
                                return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0:
                                                if (!text) return [3 /*break*/, 2];
                                                return [4 /*yield*/, (0, db_1.saveMessage)(sessionId_1, 'assistant', text)];
                                            case 1:
                                                _b.sent();
                                                _b.label = 2;
                                            case 2:
                                                console.log('[Chat] Finish reason:', finishReason);
                                                return [2 /*return*/];
                                        }
                                    });
                                });
                            },
                        })];
                case 8:
                    stream = _b.sent();
                    // ✅ Return live streaming response
                    return [2 /*return*/, stream.toDataStreamResponse({
                            headers: {
                                'X-Session-Id': sessionId_1,
                            },
                        })];
                case 9:
                    error_1 = _b.sent();
                    console.error('[Chat API Error]:', error_1);
                    return [2 /*return*/, new Response(JSON.stringify({
                            error: 'Failed to process chat request',
                            details: (error_1 === null || error_1 === void 0 ? void 0 : error_1.message) || 'Unknown error',
                        }), {
                            status: 500,
                            headers: { 'Content-Type': 'application/json' },
                        })];
                case 10: return [2 /*return*/];
            }
        });
    });
}
exports.POST = POST;
