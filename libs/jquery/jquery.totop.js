/*
|--------------------------------------------------------------------------
| UItoTop jQuery Plugin 1.2 by Matt Varone
| http://www.mattvarone.com/web-design/uitotop-jquery-plugin/
|--------------------------------------------------------------------------
*/
(function(factory) {
        if (typeof define === 'function' && define.amd) {
                // AMD
                define(['jquery', './jquery.easing.1.3'], factory);
        } else if (typeof exports === 'object') {
                // CommonJS
                factory(require('jquery'));
        } else {
                // Browser globals
                factory(Elean);
        }
} (function($) {
        $.backTop = function(options) {

                var defaults = {
                        text: '',
                        min: 200,
                        inDelay: 200,
                        outDelay: 400,
                        containerID: 'backTop',
                        containerHoverID: 'toTopHover',
                        scrollSpeed: 200,
                        easingType: 'linear'
                },
                settings = $.extend(defaults, options),
                containerIDhash = '#' + settings.containerID,
                containerHoverIDHash = '#' + settings.containerHoverID;

                $('body').append('<a href="#" id="' + settings.containerID + '">' + settings.text + '</a>');
                $(containerIDhash).hide().on('click.UItoTop', function() {
                        $('html, body').animate({
                                scrollTop: 0
                        },
                        settings.scrollSpeed, settings.easingType);
                        $('#' + settings.containerHoverID, this).stop().animate({
                                'opacity': 0
                        },
                        settings.inDelay, settings.easingType);
                        return false;
                }).prepend('<span id="' + settings.containerHoverID + '"></span>').hover(function() {
                        $(containerHoverIDHash, this).stop().animate({
                                'opacity': 1
                        },
                        600, 'linear');
                },
                function() {
                        $(containerHoverIDHash, this).stop().animate({
                                'opacity': 0
                        },
                        700, 'linear');
                });

                $(window).scroll(function() {
                        var sd = $(window).scrollTop();
                        if (typeof document.body.style.maxHeight === "undefined") {
                                $(containerIDhash).css({
                                        'position': 'absolute',
                                        'top': sd + $(window).height() - 50
                                });
                        }
                        if (sd > settings.min) $(containerIDhash).fadeIn(settings.inDelay);
                        else $(containerIDhash).fadeOut(settings.Outdelay);
                });
        };
		$.backTop()
}));