var gulp = require("gulp")
var ts = require("gulp-typescript")
var tsProject = ts.createProject("tsconfig.json")
var uglify = require("gulp-uglify");
var sourcemaps = require("gulp-sourcemaps");
const {task} = require("gulp");
const {readFileSync, writeFileSync, existsSync, createDictionary, mkdirSync} = require("fs");

function loadJson (path) {
    try {
        const str = readFileSync(path).toString();
        return JSON.parse(str);
    } catch {
        throw Error("Unable to load module.json")
    }
}

function copyNewMainfest() {
    let manifest = loadJson("package.json")
    let newManifest = {name: "chackline-backend", version: manifest.version, dependencies: manifest.dependencies}
    let manifesString = JSON.stringify(newManifest)
    writeFileSync("build/package.json", manifesString)
}




task("default", function () {

    if (!existsSync("build")) {
        mkdirSync("build")
    }

    gulp.src("src/fonts/**/*").pipe(gulp.dest("build/fonts"))

    copyNewMainfest()

    return tsProject.src()
        .pipe(tsProject()).js
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(uglify())
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest("build"))
})




