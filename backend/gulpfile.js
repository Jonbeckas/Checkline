var gulp = require("gulp")
var ts = require("gulp-typescript")
var tsProject = ts.createProject("tsconfig.json")
var sourcemaps = require("gulp-sourcemaps");
const clean = require('gulp-clean');
const {task, watch, series, parallel} = require("gulp");
const {readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync} = require("fs");
const nodemon = require("nodemon");

function loadJson (path) {
    try {
        const str = readFileSync(path).toString();
        return JSON.parse(str);
    } catch {
        throw Error("Unable to load module.json")
    }
}

function buildProject() {
    gulp.src("src/fonts/**/*").pipe(gulp.dest("build/fonts"))
    return tsProject.src()
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

task( "copyNewManifest",(done)=> {
    let manifest = loadJson("package.json")
    let newManifest = {name: "chackline-backend", version: manifest.version, dependencies: manifest.dependencies}
    let manifesString = JSON.stringify(newManifest)
    writeFileSync("build/package.json", manifesString)
    done()
});


task("copyProdConfig",(done) =>{
    copyFileSync("config/config-prod.json","build/config.json")
    done()
})

task("copyTestConfig",(done) => {
    copyFileSync("config/config-test.json","build/config.json")
    done()
})

task("nodemon",(done) => {
    nodemon({
        script: 'build/main.js'
        , ext: 'js'
        , env: { 'NODE_ENV': 'development' }
        , done: done
    })
})

task("clean",() => {
    return gulp.src('build', {read: false}).pipe(clean());
})

task("watchCode",() => {
    watch("src/**/*",series("compile"))
})

task("default", series("clean","compile","copyNewManifest","copyProdConfig"))

task("watch",series("compile","copyTestConfig",parallel("nodemon","watchCode")))





