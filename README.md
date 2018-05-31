## Usage

后端服务koa + swagger：

``` bash
$ cd koa-server
$ npm install
$ npm start
```

代理服务proxy-server:

``` bash
$ cd proxy-server
$ npm install
$ npm install pm2 -g
$ pm2 start index.js --name="proxy 8181"
```

This is a project template for [vue-cli](https://github.com/vuejs/vue-cli). **It is recommended to use npm 3+ for a more efficient dependency tree.**

``` bash
$ npm install -g vue-cli
$ vue init cetcFE/vueTemplate my-project
$ cd my-project
$ npm install
$ npm run dev
```

### Fork It And Make Your Own

You can fork this repo to create your own boilerplate, and use it with `vue-cli`:

``` bash
vue init cetcFE/vueTemplate my-project
```
