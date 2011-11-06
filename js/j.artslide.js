/* ArtSlide v0.3 - A light-weight, customizable lightbox plugin for jQuery
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
            },
            navLinks: true,
            prevControl: true,
            prevText: '&laquo;',
            nextControl: true,
            nextText: '&raquo;'
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
            var prevControl = s.prevControl ? '<a href="javascript:;" data-type="previous" class="as-control as-control-prev">'+(s.prevText ? s.prevText : '&nbsp;')+'</a>': '';
            var nextControl = s.nextControl ? '<a href="javascript:;" data-type="next" class="as-control as-control-next">'+(s.nextText ? s.nextText : '&nbsp;')+'</a>' : '';

            var selItemIndex = 0;
            /*******************************************************************
             * PREPARAR SLIDER
             *******************************************************************/
            /* NAVEGADOR DE BOLITAS */
            var navCount = '<div class="as-nav-cont '+(s.navLinks ? '' : 'as-nav-hidden')+'">';
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
            .wrapAll('<div class="as-cont as-loading"><ul class="as-list-cont"></ul></div>')
            .css(commonDimensions).parent()/* ul.as-list-cont */
            .css({
                width: listMaxWidth+'px',
                height: itemHeight + 'px'
            }).parent() /* .as-cont selected */
            .css(commonDimensions).parent() /* $(this) selected */
            .css(commonDimensions)
            .addClass('as-main-cont')
            .append($(navCount))
            .append(prevControl + ' ' + nextControl);

            /*******************************************************************
             * VARIABLES CON EL SLIDER PREPARADO
             *******************************************************************/
            var sliderBox = $('ul.as-list-cont',$this);
            var navTriggers = $('a.as-nav-trig',$this);
            var controls = $('.as-control',$this);

            /*******************************************************************
             * CARGADOR DE IMAGENES
             *******************************************************************/
            var $images = $('img',sliderBox);
            var maxImages = $images.length;
            var loadedImages = 0;
            var fallLoadingTimeout;
            if(maxImages){
                controls.hide();
                navTriggers.hide();
                sliderBox.hide();

                $.each($images,function(index,img){
                    if (!img.complete || (typeof img.naturalWidth != "undefined" && img.naturalWidth== 0))
                        return;
                    loadedImages++;
                });
                if (loadedImages == maxImages){
                    elements_loaded();
                }
                else{
                    $images.load(function(){
                        loadedImages++;
                        if (loadedImages == maxImages){
                            elements_loaded();
                            clearTimeout(fallLoadingTimeout);
                        }
                    });
                    fallLoadingTimeout = setTimeout(elements_loaded,(maxImages*1000) + 1500);
                }
            }

            $this.show();
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
             * TRANSICIÓN AUTOMÁTICA
             *******************************************************************/
            if (s.transitionInterval){
                if (s.transitionInterval <= s.speed)
                    $.error('ArtSlide: The speed of the transition can not be less than or equal to the speed of movement.');
                transInterval = setInterval(function(){
                    var index = selItemIndex +1;
                    if (selItemIndex >= slideElements.length-1)
                        index = 0;
                    realClick = false;
                    $(navTriggers[index],$this).trigger('click');
                    realClick = true;
                },s.transitionInterval);
            }
            function elements_loaded(){
                controls.show();
                navTriggers.show();
                sliderBox.show();
                $('div.as-cont',$this).removeClass('as-loading');
            }
        });
    };
})(jQuery);