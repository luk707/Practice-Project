module.exports = function(grunt) {
    grunt.initConfig({
        browserify: {
            dist: {
                files: {
                    "dist/js/Game.js": ["build/Game.js"]
                }
            }
        },
        clean: ["dist", "build"],
        copy: {
            dist: {
                expand: true,
                cwd: "src/",
                src: ["**/*", "!ts/**", "!html/**"],
                dest: "dist/"
            },
            html: {
                expand: true,
                cwd: "src/html/",
                src: ["**/*"],
                dest: "dist/"
            }
        },
        exec: {
            tsc: {
                command: "tsc",
                stdout: true
            }
        },
        watch: {
            files: ["src/**/*.ts"],
            tasks: ["build"]
        }
    });

    grunt.loadNpmTasks("grunt-browserify");
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-exec");

    grunt.registerTask("build", ["clean", "copy", "exec:tsc", "browserify"]);
    grunt.registerTask("default", ["build", "watch"]);
};