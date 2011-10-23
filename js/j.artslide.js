/* ArtSlide v0.1 - A light-weight, customizable lightbox plugin for jQuery
 *
 * Copyright (c) 2011 Sergio Toro - sergio@art4websites.com
 * Pluguin url: http://blog.art4websites.com/2011/artslide-simple-jquery-slideshow-plugin/
 *
 * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 */
(function($){
    $.fn.artslide = function(options){
        var s = {
            speed: 500,
            transitionInterval: 7500,
            width: function(){
                var itemWidth = $('> *',this).width();
                return itemWidth ? itemWidth : $(this).width();
            },
            height: function(){
                var itemHeight = $('> *',this).height();
                return itemHeight ? itemHeight : $(this).height();
            }
        };
        return this.each(function(){
            var defset = s;
            if( options )
                $.extend(true,s,options);
            var $this = $(this);
            var slideElements = $('> *',$this);

            if (slideElements.length == 0)
                return;

            var itemWidth = $.type(s.width) === 'function' ? s.width.apply(this, arguments) : parseInt(s.width);
            var itemHeight = $.type(s.height) === 'function' ? s.height.apply(this, arguments) : parseInt(s.height);
            var transInterval;
            var realClick = true;

            if (!itemWidth)
                itemWidth = defset.width();
            if (!itemHeight)
                itemHeight = defset.height();

            var listMaxWidth = itemWidth * slideElements.length;

            var selItemIndex = 0;
            /*******************************************************************
             * PREPARAR SLIDER
             *******************************************************************/
            /* NAVEGADOR DE BOLITAS */
            var navCount = '<div class="as-nav-cont">';
            for(var i=0; i<slideElements.length; i++)
            {
                var ssNavSelected = '';
                if (i==0)
                    ssNavSelected = ' as-nav-sel';
                navCount += '<a href="javascript:;" class="as-nav-trig'+ssNavSelected+'" data-index="'+i+'">&nbsp;</a>';
            }
            navCount += '</div>';
            /* CONFIGURAR MARKUP HTML */
            var commonDimensions = {
                width: itemWidth+'px',
                height: itemHeight + 'px'
                };
            slideElements.wrap('<li class="as-list-item"></li>').parent() /* .as-list-item selected */
            .wrapAll('<div class="as-cont"><ul class="as-list-cont"></ul></div>')
            .css(commonDimensions).parent()/* ul.as-list-cont */
            .css({
                width: listMaxWidth+'px',
                height: itemHeight + 'px'
            }).parent() /* .as-cont selected */
            .css(commonDimensions).parent() /* $(this) selected */
            .css(commonDimensions)
            .addClass('as-main-cont')
            .append($(navCount))
            .append('<a href="javascript:;" data-type="previous" class="as-control as-control-prev">&laquo;</a><a href="javascript:;" data-type="next" class="as-control as-control-next">&raquo;</a>');

            /*******************************************************************
             * VARIABLES CON EL SLIDER PREPARADO
             *******************************************************************/
            var sliderBox = $('ul.as-list-cont',$this);
            var navTriggers = $('a.as-nav-trig',$this);
            /*******************************************************************
             * EVENTOS
             *******************************************************************/
            navTriggers.click(function(){
                var data = $(this).data();
                if (data.index == selItemIndex)
                    return;
                // Stops automatic transition
                if (s.transitionInterval && transInterval && realClick)
                    clearInterval(transInterval);

                navTriggers.removeClass('as-nav-sel');
                $(this).addClass('as-nav-sel');
                selItemIndex = data.index;
                sliderBox.animate({
                    'left':(data.index * itemWidth * -1) + 'px'
                },s.speed);
            });

            $('a.as-control',$this).click(function(){
                var data = $(this).data();
                var index = null;

                switch(data.type)
                {
                    case 'previous':
                        index = slideElements.length-1;
                        if (selItemIndex > 0)
                            index = selItemIndex-1;
                        break;
                    case 'next':
                        index = 0;
                        if (selItemIndex < slideElements.length-1)
                            index = selItemIndex+1;
                        break;
                }
                if ($.type(index) != 'null')
                    $(navTriggers[index],$this).trigger('click');
            });

            /*******************************************************************
             * MOSTRAR EL SLIDER SI ESTA OCULTO
             *******************************************************************/
            $this.show();

            /*******************************************************************
             * TRANSICIÓN AUTOMÁTICA
             *******************************************************************/
            if (s.transitionInterval){
                if (s.transitionInterval <= s.speed)
                    $.error('Simpleslide: The speed of the transition can not be less than or equal to the speed of movement.');
                transInterval = setInterval(function(){
                    var index = selItemIndex +1;
                    if (selItemIndex >= slideElements.length-1)
                        index = 0;
                    realClick = false;
                    $(navTriggers[index],$this).trigger('click');
                    realClick = true;
                },s.transitionInterval);
            }
        });
    };
})(jQuery);