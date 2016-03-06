define(function (require, exports, module) {
    module.exports = function (app) {
        //home page
		
        var appoverview = require('../router/appoverview.js');
        app.get('/mxplay/module/appoverview', appoverview);
		
		
		
		// module
        app.get('/mxplay/module/module', require('../router/module.js'));
        app.get('/mxplay/module/module-store', require('../router/module-store.js'));
        app.get('/mxplay/module/module-custom', require('../router/module-custom.js'));
        app.get('/mxplay/module/module-auth', require('../router/module-auth.js'));
		
		
		// 消息推送
        app.get('/mxplay/module/push', require('../router/push.js'));
		
		
        //mam统计
        app.get("/mxplay/module/total", require('../router/total.js'));
        app.get("/mxplay/module/total-version", require('../router/total-version.js'));
        app.get("/mxplay/module/total-area", require('../router/total-area.js'));
        app.get("/mxplay/module/total-terminal", require('../router/total-terminal.js'));
        app.get("/mxplay/module/total-error", require('../router/total-error.js'));
        app.get("/mxplay/module/total-custom", require('../router/total-custom.js'));
		
		
		//setting mcm
		app.get("/mxplay/module/setting", require('../router/setting.js'));
		
		/*
		// module
        
        app.get('/apicloud/module/module', require('../router//module.js'));
		
        app.get('/', index);
        var develop = require('./dev.js');
        app.get('/dev', develop);
        var client = require('./client.js');
        app.get('/client', client);
        var cloud = require('./cloud.js');
        app.get('/cloud', cloud);
        var price = require('./price.js');
        app.get('/price', price);
        var about = require('./about.js');
        app.get('/about', about);
        var blog = require('./blog.js');
        app.get('/blog', blog);

        var blogDetails = require('./blogDetails.js');
        app.get('/blogDetails', blogDetails);

        var _console = require('./console.js');
        app.get('/console', _console);
        var appoverview = require('./appoverview.js');
        app.get('/appoverview', appoverview);

        var restore = require('./restore.js');
        app.get('/restore', restore);

        var profile = require('./profile.js');
        app.get('/profile', profile);
        var certificate = require('./certificate.js');
        app.get('/certificate', certificate);
        var code = require('./code.js');
        app.get('/code', code);
        var version = require('./version.js');
        app.get('/version', version);

        var pack = require('./package.js');
        app.get('/package', pack);

        var appstore = require('./appstore.js');
        app.get('/appstore', appstore);
        var auth = require('./auth.js');
        app.get('/auth', auth);
        var runctrl = require('./runctrl.js');
        app.get('/runctrl', runctrl);
        var member = require('./member.js');
        app.get('/member', member);
        var CADConfig = require('./CADConfig.js');
        app.get('/CADConfig', CADConfig);
        var push = require('./push.js');
        app.get('/push', push);
        // module
        app.get('/module', require('./module.js'));
        app.get('/module-store', require('./module-store.js'));
        app.get('/module-custom', require('./module-custom.js'));
        app.get('/module-auth', require('./module-auth.js'));
        app.get('/module-loader', require('./module-loader.js'));
        app.get('/modulestore', require('./modulestore.js'));
        app.get('/module_pub_history', require('./module_pub_history.js'));
        app.get('/mod-ui', require('./mod-ui.js'));
        app.get('/mod-nav', require('./mod-nav.js'));
        app.get('/mod-ext', require('./mod-ext.js'));
        app.get('/mod-sdk', require('./mod-sdk.js'));
        app.get('/mod-dev', require('./mod-dev.js'));
        app.get('/mod-cloud', require('./mod-cloud.js'));

        //mam统计
        app.get("/total", require('./mam/total.js'));
        app.get("/totalversion", require('./mam/version.js'));
        app.get("/totalarea", require('./mam/area.js'));
        app.get("/totalterminal", require('./mam/terminal.js'));
        app.get("/totalerror", require('./mam/error.js'));
        app.get("/totalcustom", require('./mam/event.js'));

        //mcm
        app.get("/mcmdatabase", require('./mcm/database.js'));
        app.get("/mcmbase", require('./mcm/base.js'));
        app.get("/mcmapi", require('./mcm/api.js'));
        app.get("/mcmdata", require('./mcm/data.js'));

        //im
        app.get("/imuser", require('./im/user.js'));
        app.get("/imgroup", require('./im/group.js'));
        app.get("/imtotal", require('./im/total.js'));

        //template store
        // app.get("/tpl-store",require('./tpl-store.js'));
        // app.get("/tpl-detail",require('./tpl-detail.js'));
        // app.get("/tpl-manage",require('./tpl-manage.js'));

        // 暂时
        app.get("/tech-share", require('./tech-share.js'));
        // 课程详情页面
        app.get("/training_entrance", require('./training_entrance.js'));
        app.get("/watchvideo", require('./watchvideo.js')); /*selecting activity
        app.get("/selectingActy", require('./selectingActy.js'));

        /*ali Land
        // app.get("/aliland",require('./aliland.js'));

        // 发布会二
        app.get("/launch", require('./launch.js'));*/
    };
});