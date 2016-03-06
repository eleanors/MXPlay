define(function(require, exports, module) {
        require('cookie');
        require('i18next');
        require("bootstrap");
        require('helper').init();
        require('ie-shim').init();
		require('../libs/jquery/jquery.totop');
		
        var page = require('page');
        var Modernizr = require('modernizr');
	    var Handlebars = require('Handlebars');
	    var nicescroll = require('nicescroll');
        var router = require('../router/router');
		
		//绑定全局事件标志,防止body上面重复绑定事件
		window.initGlobalDomEvt = false;   // push模块
							 
        window.backRender = true;
		

        if (!window.i18n) {

                var i18nx = require("i18next");
                i18nx.init({
                        lng: $.cookie("i18next") || "zh-CN",
                        fallbackLng: false,
                        load: 'current'
                },
                function(t) {
                        LoadContent();
                });
                window.i18n = i18nx;
        } else {
                LoadContent();
        }

        function LoadContent() {
				//init router
                if (Modernizr.history) {
                        page({
                                //dispatch: false //首页为后端渲染   分派
                        });
                }
                var renderTPL = function(pageName, router){
					    var req = {};
						req.cookies = {}
                        req.cookies.curAppId = 123456;
                        req.cookies.curAppName = 'AppName';
                        req.cookies.mcmOpened = 1//$.cookie('mcmOpened');
                        req.cookies.appType = $.cookie('appType');
						
                        req.cookies.i18next = $.cookie('i18next');
                        req.cookies.username = $.cookie('username');
                        req.url = location.pathname + 'apicloud';
						var res = {
						          render: function(tplId, jsonData){
									      var tplPath = '../template/' + tplId + '.html';//console.log(tplPath)
										  $.get(tplPath, function(data){
											      if(data){
													      
													      var template = Handlebars.compile(data);
														  var html = template(jsonData);
														  if(jsonData.result){
															  
														  }else{
															     var $wrapper = $('.main-content');
																 
																 $wrapper.fadeOut(200, function(){
																	     $wrapper.html(html)
																	     if(jsonData && jsonData.title){
																			     document.title = jsonData.title;
																		 }
																		 $('#menu').trigger('activeMenu')
																		 var index = pageName.lastIndexOf('/')
																		 var jsName = pageName.slice(index + 1);
																		     jsName = jsName || 'appoverview';
																		     if(jsonData.jsName){
																				 jsName = jsonData.jsName
																			 }
																		    //异步加载
																		     require(['../module/'+jsName], function(modules){
																					setTimeout(function() {
																							modules.init();
																					}, 400);
																		     })
																 })	
                                                                 $wrapper.fadeIn('200');
                                                                 $(".butterbar").removeClass("active").addClass("hide");
														  }
												  }
										  })
								  }
						}
                        router(req, res);
				}
				//router
				var routePage = function(path, router, fn) {
		
						if (!Modernizr.history) {
								return;
						}
						//console.log(path) 
						page(path, function() {
								//防止多次点击
								//console.log(path +'==='+ location.pathname)
								var curPath = location.pathname;
								if (curPath === path) {
										$(".butterbar").removeClass("active").addClass("hide");
										return false;
								}
								renderTPL(path, router);
								fn && fn();
						});
				};
				var $menu = $('#menu'); 
				var clientWid = $(window).width();
				var clientHei = $(window).height();
				if (clientWid < 1260) {
					$('body').addClass('shrink');
					$menu.addClass('shrink');
					$('#menu-shadow').addClass('shrink');
					$(".mainWrap").css("maxWidth",clientWid-50);
				} else {
					$('body').removeClass('shrink');
					
					$(".mainWrap").css("maxWidth",clientWid-235);
				}
				
        		var app = {};
				app.get = function(path, routeFn) {
						routePage(path, routeFn, function() {
							
								window.backRender = false;
						});
				};
		
				page("*", function(ctx, next) {
		
						$(".butterbar").addClass("active").removeClass("hide");
						next();
				});
		
				router(app);
		
				page("*", function(ctx, next) {
						$(".butterbar").removeClass("active").addClass("hide");
						next();
				});
				
				
                //加载执行JS
                var pathname = location.pathname;
                var fun = pathname.slice(pathname.lastIndexOf('/')+1);
                if (fun.lastIndexOf('/') > 1) {
                        fun = fun.replace('/', '');
                }
                fun = fun || 'appoverview';
                var jname = getJsName();
                if (jname) {
                        fun = jname;
                }
				console.log(fun)
				
				require(['../module/'+fun], function(modules){
						setTimeout(function() {
								modules.init();
						}, 400);
				});
				
				//左侧菜单状态切换
				$menu.on('click', '.toggle-menu', function(){
					    $(this).attr('title', i18n.t('expandMenu'));
					    if($('body').hasClass('shrink')){
							
						      $('.mainWrap').css('maxWidth', clientWid - 235);	
						}else{
						      $('.mainWrap').css('maxWidth', clientWid - 50);	
						}
						$menu.toggleClass('shrink');
						$('body').toggleClass('shrink');
				})
				
				//高亮被点击项
				$('#menu .innerWrap').on('click', 'a', function(event){
                       var $menu = $('#menu .innerWrap');
					   
					   $menu.find('.active').removeClass('active');
					   $(this).parent().addClass('active');
					   $(window).scrollTop(0);
				});
				
				
				$menu.on('activeMenu', function(){
					
				        var path = location.pathname;
						path = path.replace('/mxplay/module', '')
						var $inner = $menu.find('.innerWrap');
						var $link;
							if(/^\/module/.test(path)){
								  
								   $link = $inner.find('a[href="../module/module"]');
							}else if(/^\/total/.test(path)){
								
								   $link = $inner.find('a[href="../module/total"]');
							}else{
								
							       $link = $inner.find('a[href="../module/'+ path +'"]')	
							}
							$inner.find('.active').removeClass('active');
							$link.parent().addClass('active');
				});
				
				$menu.trigger('activeMenu');
		
		}

})