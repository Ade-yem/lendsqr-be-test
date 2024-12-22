"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeKarmaRequest = void 0;
const node_https_1 = __importDefault(require("node:https"));
const ADJUTOR_API_KEY = process.env.ADJUTOR_API_KEY;
const HOSTNAME = 'adjutor.lendsqr.com';
const makeHttpsRequest = (options, params) => {
    return new Promise((resolve, reject) => {
        const req = node_https_1.default.request(options, res => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    const parsedData = JSON.parse(data);
                    resolve(parsedData);
                }
                catch (error) {
                    reject(error);
                }
            });
        }).on('error', error => {
            reject(error);
        });
        req.write(params);
        req.end();
    });
};
const makeKarmaRequest = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const options = {
        method: "GET",
        hostname: HOSTNAME,
        port: 443,
        path: '/v2/verification/karma/' + email,
        headers: {
            Authorization: 'Bearer ' + ADJUTOR_API_KEY,
        }
    };
    const response = yield makeHttpsRequest(options, "");
    return response;
});
exports.makeKarmaRequest = makeKarmaRequest;
