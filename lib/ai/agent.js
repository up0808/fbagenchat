"use strict";
/**
 * AI Agent with tool definitions
 * Implements web search, weather, and other utility tools
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
exports.tools = exports.calculatorTool = exports.imageSearchTool = exports.weatherTool = exports.webSearchTool = void 0;
var zod_1 = require("zod");
var ai_1 = require("ai");
var mathjs_1 = require("mathjs");
var math = (0, mathjs_1.create)(mathjs_1.all, {
    number: 'number',
    precision: 14,
});
var withTimeout = function (promise, ms) {
    if (ms === void 0) { ms = 8000; }
    return Promise.race([
        promise,
        new Promise(function (_, reject) { return setTimeout(function () { return reject(new Error('Request timeout')); }, ms); }),
    ]);
};
/**
 * Google Custom Web Search Tool
 * Simulates searching the web for information
 * In production, integrate with real APIs like Serper, Brave Search, etc.
 */ exports.webSearchTool = (0, ai_1.tool)({
    description: 'Search the web using Google Custom Search API for real-time and recent information.',
    parameters: zod_1.z.object({
        query: zod_1.z.string().describe('The search query'),
        numResults: zod_1.z.number().optional().default(5).describe('Number of results to return'),
    }),
    execute: function (_a) {
        var query = _a.query, numResults = _a.numResults;
        return __awaiter(void 0, void 0, void 0, function () {
            var apiKey, cx, apiUrl, response, data, items, results, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        apiKey = process.env.GOOGLE_API_KEY;
                        cx = process.env.GOOGLE_CSE_ID;
                        if (!apiKey || !cx) {
                            console.error('Missing GOOGLE_API_KEY or GOOGLE_CSE_ID in environment variables.');
                            return [2 /*return*/, {
                                    query: query,
                                    results: [],
                                    error: 'Search unavailable: missing API configuration.',
                                    timestamp: new Date().toISOString(),
                                }];
                        }
                        apiUrl = "https://www.googleapis.com/customsearch/v1?q=".concat(encodeURIComponent(query), "&key=").concat(apiKey, "&cx=").concat(cx, "&num=").concat(numResults);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, withTimeout(fetch(apiUrl))];
                    case 2:
                        response = _b.sent();
                        if (!response.ok) {
                            throw new Error("Google API Error: ".concat(response.status));
                        }
                        return [4 /*yield*/, response.json()];
                    case 3:
                        data = _b.sent();
                        items = data.items || [];
                        results = items.map(function (item) { return ({
                            title: item.title,
                            url: item.link,
                            snippet: item.snippet || '',
                        }); });
                        return [2 /*return*/, {
                                source: 'Google Search',
                                query: query,
                                results: results,
                                timestamp: new Date().toISOString(),
                            }];
                    case 4:
                        error_1 = _b.sent();
                        console.error('Web search failed:', error_1.message);
                        return [2 /*return*/, {
                                query: query,
                                results: [],
                                error: error_1.message,
                                timestamp: new Date().toISOString(),
                            }];
                    case 5: return [2 /*return*/];
                }
            });
        });
    },
});
/**
 * Weather Tool
 * Fetches current weather information
 * In production, integrate with OpenWeatherMap, WeatherAPI, etc.
 */ exports.weatherTool = (0, ai_1.tool)({
    description: 'Get current weather information for a specific city or location using a free weather API (Open-Meteo).',
    parameters: zod_1.z.object({
        location: zod_1.z.string().describe('City name or location (e.g., London, New York, Delhi)'),
        units: zod_1.z.enum(['celsius', 'fahrenheit']).optional().default('celsius'),
    }),
    execute: function (_a) {
        var location = _a.location, units = _a.units;
        return __awaiter(void 0, void 0, void 0, function () {
            var geoUrl, geoRes, geoData, _b, latitude, longitude, name, country, tempUnit, weatherUrl, weatherRes, weatherData, _c, temperature, windspeed, weathercode, conditions, condition, error_2;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        console.log("[Weather] Location: \"".concat(location, "\", Units: ").concat(units));
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 6, , 7]);
                        geoUrl = "https://geocoding-api.open-meteo.com/v1/search?name=".concat(encodeURIComponent(location), "&count=1");
                        return [4 /*yield*/, withTimeout(fetch(geoUrl))];
                    case 2:
                        geoRes = _d.sent();
                        return [4 /*yield*/, geoRes.json()];
                    case 3:
                        geoData = _d.sent();
                        if (!geoData.results || geoData.results.length === 0) {
                            return [2 /*return*/, {
                                    location: location,
                                    error: 'Location not found',
                                    timestamp: new Date().toISOString(),
                                }];
                        }
                        _b = geoData.results[0], latitude = _b.latitude, longitude = _b.longitude, name = _b.name, country = _b.country;
                        tempUnit = units === 'fahrenheit' ? 'fahrenheit' : 'celsius';
                        weatherUrl = "https://api.open-meteo.com/v1/forecast?latitude=".concat(latitude, "&longitude=").concat(longitude, "&current_weather=true&temperature_unit=").concat(tempUnit, "&windspeed_unit=kmh");
                        return [4 /*yield*/, withTimeout(fetch(weatherUrl))];
                    case 4:
                        weatherRes = _d.sent();
                        return [4 /*yield*/, weatherRes.json()];
                    case 5:
                        weatherData = _d.sent();
                        if (!weatherData.current_weather) {
                            throw new Error('Weather data unavailable');
                        }
                        _c = weatherData.current_weather, temperature = _c.temperature, windspeed = _c.windspeed, weathercode = _c.weathercode;
                        conditions = {
                            0: 'Clear sky',
                            1: 'Mainly clear',
                            2: 'Partly cloudy',
                            3: 'Overcast',
                            45: 'Fog',
                            48: 'Depositing rime fog',
                            51: 'Light drizzle',
                            61: 'Rain',
                            71: 'Snowfall',
                            80: 'Rain showers',
                            95: 'Thunderstorm',
                        };
                        condition = conditions[weathercode] || 'Unknown';
                        return [2 /*return*/, {
                                location: "".concat(name, ", ").concat(country),
                                temperature: temperature,
                                unit: tempUnit,
                                condition: condition,
                                windSpeed: windspeed,
                                timestamp: new Date().toISOString(),
                            }];
                    case 6:
                        error_2 = _d.sent();
                        console.error('Weather API error:', error_2.message);
                        return [2 /*return*/, {
                                location: location,
                                error: error_2.message,
                                timestamp: new Date().toISOString(),
                            }];
                    case 7: return [2 /*return*/];
                }
            });
        });
    },
});
/**
 * Image Search Tool
 * Searches for images based on a query
 */ exports.imageSearchTool = (0, ai_1.tool)({
    description: 'Search for images using Google Custom Search (Image Type) or fallback to Unsplash API.',
    parameters: zod_1.z.object({
        query: zod_1.z.string().describe('The image search query'),
        count: zod_1.z.number().optional().default(4).describe('Number of images to return'),
    }),
    execute: function (_a) {
        var query = _a.query, count = _a.count;
        return __awaiter(void 0, void 0, void 0, function () {
            var googleKey, googleCx, unsplashKey, formatResults, googleUrl, res, data, unsplashUrl, res, data, fallback, error_3;
            var _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        googleKey = process.env.GOOGLE_API_KEY;
                        googleCx = process.env.GOOGLE_CSE_ID;
                        unsplashKey = process.env.UNSPLASH_ACCESS_KEY;
                        console.log("[Image Search] Query: \"".concat(query, "\", Count: ").concat(count));
                        formatResults = function (items, source) {
                            return items.map(function (item, i) {
                                var _a, _b, _c;
                                return ({
                                    url: item.link || ((_a = item.urls) === null || _a === void 0 ? void 0 : _a.regular) || item.url,
                                    thumbnail: ((_b = item.image) === null || _b === void 0 ? void 0 : _b.thumbnailLink) || ((_c = item.urls) === null || _c === void 0 ? void 0 : _c.thumb) || item.thumbnail,
                                    title: item.title || "".concat(query, " - Image ").concat(i + 1),
                                    source: source,
                                });
                            });
                        };
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 8, , 9]);
                        if (!(googleKey && googleCx)) return [3 /*break*/, 4];
                        googleUrl = "https://www.googleapis.com/customsearch/v1?q=".concat(encodeURIComponent(query), "&searchType=image&num=").concat(count, "&key=").concat(googleKey, "&cx=").concat(googleCx);
                        return [4 /*yield*/, withTimeout(fetch(googleUrl))];
                    case 2:
                        res = _d.sent();
                        if (!res.ok) return [3 /*break*/, 4];
                        return [4 /*yield*/, res.json()];
                    case 3:
                        data = _d.sent();
                        if ((_b = data.items) === null || _b === void 0 ? void 0 : _b.length) {
                            return [2 /*return*/, {
                                    query: query,
                                    images: formatResults(data.items, 'Google Images'),
                                    timestamp: new Date().toISOString(),
                                }];
                        }
                        _d.label = 4;
                    case 4:
                        if (!unsplashKey) return [3 /*break*/, 7];
                        unsplashUrl = "https://api.unsplash.com/search/photos?query=".concat(encodeURIComponent(query), "&per_page=").concat(count, "&client_id=").concat(unsplashKey);
                        return [4 /*yield*/, withTimeout(fetch(unsplashUrl))];
                    case 5:
                        res = _d.sent();
                        if (!res.ok) return [3 /*break*/, 7];
                        return [4 /*yield*/, res.json()];
                    case 6:
                        data = _d.sent();
                        if ((_c = data.results) === null || _c === void 0 ? void 0 : _c.length) {
                            return [2 /*return*/, {
                                    query: query,
                                    images: formatResults(data.results, 'Unsplash'),
                                    timestamp: new Date().toISOString(),
                                }];
                        }
                        _d.label = 7;
                    case 7:
                        fallback = Array.from({ length: count }, function (_, i) { return ({
                            url: "https://picsum.photos/seed/".concat(query, "-").concat(i, "/600/400"),
                            thumbnail: "https://picsum.photos/seed/".concat(query, "-").concat(i, "/300/200"),
                            title: "".concat(query, " - Image ").concat(i + 1),
                            source: 'Placeholder (Picsum)',
                        }); });
                        return [2 /*return*/, { query: query, images: fallback, timestamp: new Date().toISOString() }];
                    case 8:
                        error_3 = _d.sent();
                        console.error('Image search failed:', error_3.message);
                        return [2 /*return*/, {
                                query: query,
                                images: [],
                                error: error_3.message,
                                timestamp: new Date().toISOString(),
                            }];
                    case 9: return [2 /*return*/];
                }
            });
        });
    },
});
/**
 * Calculator Tool
 * Performs mathematical calculations
 */ exports.calculatorTool = (0, ai_1.tool)({
    description: 'Perform mathematical calculations from basic arithmetic to advanced Class-12 level and higher, including trigonometry, logarithms, algebra, and calculus expressions.',
    parameters: zod_1.z.object({
        expression: zod_1.z
            .string()
            .describe('Mathematical expression (e.g., "2 + 2", "sqrt(16)", "sin(45 deg)", "log(100,10)", "integrate(x^2, x)")'),
    }),
    execute: function (_a) {
        var expression = _a.expression;
        return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_b) {
                console.log("[Calculator] Expression: \"".concat(expression, "\""));
                try {
                    result = math.evaluate(expression);
                    return [2 /*return*/, {
                            expression: expression,
                            result: result,
                            success: true,
                            timestamp: new Date().toISOString(),
                        }];
                }
                catch (error) {
                    console.error('Calculation error:', error.message);
                    return [2 /*return*/, {
                            expression: expression,
                            error: error.message || 'Invalid or unsupported mathematical expression',
                            success: false,
                            timestamp: new Date().toISOString(),
                        }];
                }
                return [2 /*return*/];
            });
        });
    },
});
/**
 * Export all tools as a single object
 */
exports.tools = {
    webSearch: exports.webSearchTool,
    weather: exports.weatherTool,
    imageSearch: exports.imageSearchTool,
    calculator: exports.calculatorTool,
};
