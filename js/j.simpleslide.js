(function($){
    $.fn.simpleslide = function(options){
        var s = {
            speed: 500,
            transitionInterval: 7500,
            width: function(){
                return $('> *',this).width();
            },
            height: function(){
                return $('> *',this).height();
            }
        };
        return this.each(function(){
            if( options )
                $.extend(true,s,options);
            var $this = $(this);
            var slideElements = $('> *',$this);
			
			if (slideElements.length == 0)
				return false;
			
            var itemWidth = $.type(s.width) === 'function' ? s.width.apply(this, arguments) : s.width;
            var itemHeight = $.type(s.height) === 'function' ? s.height.apply(this, arguments) : s.height;
            var transInterval;
            var realClick = true;

            if (!itemWidth)
                itemWidth = slideElements.width();
            if (!itemHeight)
                itemHeight = slideElements.height();
            var listMaxWidth = itemWidth * slideElements.length;

            var selItemIndex = 0;
            /*******************************************************************
             * PREPARAR SLIDER
             *******************************************************************/
            /* NAVEGADOR DE BOLITAS */
            var navCount = '<div class="ss-nav-container">';
            for(var i=0; i<slideElements.length; i++)
            {
                var ssNavSelected = '';
                if (i==0)
                    ssNavSelected = ' ss-nav-selected';
                navCount += '<a href="javascript:;" class="ss-nav-trigger'+ssNavSelected+'" data-index="'+i+'">&nbsp;</a>';
            }
            navCount += '</div>';
            /* CONFIGURAR MARKUP HTML */
			var commonDimensions = {width: itemWidth+'px',height: itemHeight + 'px'};
            slideElements.wrap('<li class="ss-list-item"></li>').parent() /* .ss-list-item selected */
            .wrapAll('<div class="ss-container"><ul class="ss-list-container"></ul></div>')
            .css(commonDimensions).parent()/* ul.ss-list-container */
            .css({
                width: listMaxWidth+'px',
                height: itemHeight + 'px'
            }).parent() /* .ss-container selected */
            .css(commonDimensions).parent() /* $(this) selected */
			.css(commonDimensions)
            .addClass('ss-main-container')
            .append($(navCount))
            .append('<a href="javascript:;" data-type="previous" class="ss-control ss-control-previous">&laquo;</a><a href="javascript:;" data-type="next" class="ss-control ss-control-next">&raquo;</a>');

            /*******************************************************************
             * VARIABLES CON EL SLIDER PREPARADO
             *******************************************************************/
            var sliderBox = $('ul.ss-list-container',$this);
            var navTriggers = $('a.ss-nav-trigger',$this);
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

                navTriggers.removeClass('ss-nav-selected');
                $(this).addClass('ss-nav-selected');
                selItemIndex = data.index;
                sliderBox.animate({
                    'left':(data.index * itemWidth * -1) + 'px'
                },s.speed);
            });

            $('a.ss-control',$this).click(function(){
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