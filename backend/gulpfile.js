var gulp = require("gulp")
var ts = require("gulp-typescript")
var sourcemaps = require("gulp-sourcemaps");
const mocha = require("gulp-mocha");
const clean = require('gulp-clean');
const {task, watch, series, parallel, src} = require("gulp");
const {readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync} = require("fs");
const nodemon = require("nodemon");
const run = require('gulp-run');
const concat = require('gulp-concat-sourcemap');



function loadJson (path) {
    try {
        const str = readFileSync(path).toString();
        return JSON.parse(str);
    } catch {
        throw Error("Unable to load module.json")
    }
}

function buildProject() {
    const tsProject = ts.createProject("tsconfig.json")
    gulp.src("src/fonts/**/*").pipe(gulp.dest("build/fonts"))

    return src("src/**/*.ts")
        .pipe(tsProject()).js
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest("build"))
}

function checkBuildFolder() {
    if (!existsSync("build")) {
        mkdirSync("build")
    }
}

task("compile", ()=> {
    checkBuildFolder()
    return buildProject()
})

function copyNewManifest(done) {
    let manifest = loadJson("package.json")
    let newManifest = {name: "chackline-backend", version: manifest.version, dependencies: manifest.dependencies}
    let manifesString = JSON.stringify(newManifest)
    writeFileSync("build/package.json", manifesString)
    done()
};


function copyProdConfig(done) {
    copyFileSync("config/config-prod.json","build/config.json")
    done()
}

function copyTestConfig(done) {
    copyFileSync("config/config-test.json","build/config.json")
    done()
}

task("test",() => {
    const tsProject = ts.createProject("tsconfig.json")
    return gulp.src('./src/**/*.ts')
        /*transpile*/
        .pipe(tsProject())
        /*flush to disk*/
        .pipe(gulp.dest('build'))
        /*execute tests*/
        .pipe(mocha())
        .on("error", function(err) {
            console.log(err)
        })
        .on("out",(info) => {
            console.log(info)
        });
})

function nodemonFun(done) {
    nodemon({
        script: 'build/main.js'
        , ext: 'js'
        , env: { 'NODE_ENV': 'development' }
        , done: done
    })
}

function runCode() {
    return run("node main.js",{cwd:"build","verbosity":3}).exec().pipe(gulp.dest("output"))
}

task("clean",(done) => {
    if (existsSync("build")) {
        gulp.src('build', {read: false}).pipe(clean())
    }
    done()
})

function watchCode() {
    watch("src/**/*",series("compile",nodemonFun));
}

task("default", series("clean","compile",copyProdConfig, copyNewManifest))

task("watch",series("compile",copyTestConfig,parallel(watchCode,nodemonFun)))





