"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Uploader = void 0;
const multer_1 = __importDefault(require("multer"));
;
class Uploader {
    constructor(uploadDir) {
        this.uploadDir = uploadDir;
        this.fileFilter = (types) => {
            return (req, file, cb) => {
                const type = file.mimetype;
                if (!types)
                    return cb(null, true);
                if (types.length === 0)
                    return cb(null, true);
                if (types.some((accepted) => type === accepted)) {
                    return cb(null, true);
                }
                else {
                    req.uploaderError = new Error(`we only accept these types: ${types}`);
                    return cb(null, false);
                }
            };
        };
        this.storage = multer_1.default.diskStorage({
            destination: (req, file, cb) => {
                cb(null, this.uploadDir || this.defualtUploadDir);
            },
            filename: (req, file, cb) => {
                cb(null, file.fieldname + Date.now());
            }
        });
        this.defualtUploadDir = "upload/";
    }
    uploadMultipleFiles(options) {
        let fieldname = (options === null || options === void 0 ? void 0 : options.fieldName) ? options.fieldName : 'file';
        return (0, multer_1.default)({ storage: this.storage, fileFilter: this.fileFilter(options.types) })
            .array(options.fieldName || 'file');
    }
    uploadSingleFile(options) {
        return (0, multer_1.default)({ storage: this.storage, fileFilter: this.fileFilter(options.types) })
            .single(options.fieldName || "file");
    }
}
exports.Uploader = Uploader;
