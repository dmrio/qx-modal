/* *****************************/
/* Blackout V 1.5
/* *****************************/
/*
 * Fn: blackout
 * Description: Give a lightbox effect
 * Parameters: 
 * *** animationspeed: the speed of all animations (default: medium)
 * *** blackoutclass: the class of blackout element (default: blackout)
 * *** content: the content inside box
 * *** action: action to to with blackout (default: open) (accept: close or open)
 * *** zindex: the zindex control of element (default: 1000)
 */
jQuery.fn.qxBlackout = function(options, callback) {
    ///	<summary>
    /// Blackout para criar elemento que cubra a tela toda
    ///	</summary>
	options = jQuery.extend({
		animationspeed: 250,
		content: null,
		action: 'open',
		zindex: 201,
        delay:0,
        wrapperElement: 'body'
	},options);
	
	//Prevent
    if(jQuery('#qx-Blackout').length != 0) {
        options.delay = 1;
        jQuery('#qx-Blackout').remove();
    }
	if(options.action == 'close') {
		jQuery('#qx-Blackout').children('.qx-blackout-wrapper').hide().parent().fadeOut(options.animationspeed,function(){jQuery(this).remove();});
        jQuery('body').unbind('keyup.qxPopOp');
        return this;
	}
	
	if(options.action != 'close' && options.action != "remove") {
            var prependTo = options.wrapperElement ? options.wrapperElement : 'body';
            var el = jQuery('<div id="qx-Blackout" style="width:100%; height:100%; top:0; left:0; position:fixed; z-index:'+options.zindex+';"><div class="qx-blackout-wrapper" style="display:none;">'+options.content+'</div></div>').prependTo('body');
			el.hide();

            if(options.delay == 1)
                el.show(0,function(){
				    //On complete
				    if(typeof eval(callback)== 'function') {
					    jQuery.fn.callback = callback;
					    jQuery(this).callback();
				    }
			    });
            else
                el.fadeIn(options.animationspeed, function(){
				    //On complete
				    if(typeof eval(callback)== 'function') {
					    jQuery.fn.callback = callback;
					    jQuery(this).callback();
				    }
			    });

			mouse_is_inside = false;
			jQuery('#qx-Blackout').find('.qx-blackout-wrapper').hover(function(){ 
				mouse_is_inside = true; 
			}, function(){ 
				mouse_is_inside = false; 
			});
			
            //On click outside content
			jQuery('#qx-Blackout').bind('click', function(){
				if(mouse_is_inside == false)
					jQuery('.qx-popUp-btn-close','#qx-Blackout').trigger('click');
			});

            //On press ESC key
            jQuery('body').bind('keyup.qxPopOp', function (e) {
                if (e.keyCode == 27) {
                    jQuery('.qx-popUp-btn-close','#qx-Blackout').trigger('click');
                }
            });

            //On press ENTER key
            jQuery('body').bind('keyup.qxPopOp', function (e) {
                if (e.keyCode == 13) {
                    jQuery('.qx-popUp-btn-ok','#qx-Blackout').trigger('click');
                }
            });
		

	}
	else if(options.action == "remove") {
		jQuery(this).remove();
	}
	
	return this;
};

/* *****************************/
/* popUp V 2.2
/* *****************************/
/*
 * Fn: popUp
 * Description: Give an lightbox popUp with actions
 * Author: Rafael Heringer
 * Contributors: Rodrigo Lemos
 * Parameters: 
 * *** type: the type of popUp (default: 'default') (accept: 'default', 'confirm' or string)
 * *** popupclass: the class of popUp container (default: 'popUp')
 * *** text: the text of box
 * *** content: html content of the box
 * *** title: the title of box
 * *** oklabel: text of ok button
 * *** cancellabel: text of cancel button
 * *** okaction: action when click in ok button (default:'close') (accept: 'close' or function)
 * *** cancelaction: action when click in cancel button (default:'close') (accept: 'close' or function)
 * *** closeaction: action when click in close button (default:'close') (accept: 'close' or function)
 * *** popclose: if set to true, give a link in header to close the popUp (default: true)
 * *** popclosetext: text of close button in header
 * *** buttons: create a set of cutom buttons (array of objects) (eg: [{newclass:'newclassofbutton', name:'name of button', action:'close' or function}])
 * *** ajax: load ajax content (accept: url)
 * *** ajaxerrorcontent: content to show if error occurs (if empty dont show the popUp)
 * *** ajaxerroraction: action to do when error occurs (accept: function)
 * *** ajaxmethod: ajax method (accept: 'GET' or 'POST')
 * *** ajaxdata: ajax data parser (object - key value pair)
 * *** centered: if set to true, automatic center the popUp (default:true)
 * *** animationspeed: speed of fade (default: 250)
 * *** animationdelay: time to box show up (default: 0)
 * *** bodypadding: space between window and popUp
 * *** calconchange: Calculate in every chance of document or window
 */
jQuery.fn.qxPopUp = function (options, callback) {

    //Close popUp?
    if (options == "close") {
        jQuery().qxBlackout({ action: 'close' });
        return this;
    }

    //Popup with link?
    if(jQuery(this).length) {
        jQuery(this).bind('click', function(event){
            event.preventDefault();
            if(options) {
                if(!options.ajax && !options.content && !options.text)
                    options.ajax = jQuery(this).attr('href');
            }
            else {
                options = {};
                options.ajax = jQuery(this).attr('href');
            }
            jQuery().qxPopUp(options, callback);
        });
        return this;
    }

    //////////Sets
    var html;
    var options;
    var init = false;
    var thisPopUp;
    var _THIS = jQuery(this);

    //Set Options
    options = jQuery.extend({
        type: 'default',
        popupclass: 'popUp',
        text: null,
        content: null,
        title: 'Aviso',
        oklabel: 'Ok',
        cancellabel: 'Cancelar',
        okaction: 'close',
        closeaction: 'close',
        cancelaction: 'close',
        buttons: null, //Array of objects - {name:'', class:'', action:function(){}}
        popclose: true,
        popclosetext: 'Fechar',
        ajax: false, //URL of ajax
        ajaxerrorcontent: '<p>Ops! Algum erro ocorreu.</p>',
        ajaxerroraction: null,
        ajaxmethod: 'GET', //GET or POST
        ajaxdata: null, //Data array
        centered: true,
        beforestart: null,
        data: null,
        animationspeed: 250,
        animationdelay: 0,
        width: 'auto',
        height: 'auto',
        bodypadding: 40,
        calconchange: false
    }, options);

    /////////On start Callback
    if (typeof eval(options.beforestart) == 'function') {
        jQuery.fn.beforestart = options.beforestart;
        jQuery(this).beforestart();
    }

    /////////If ajax = null get url
    if (!options.ajax && !options.content) {
        options.ajax = jQuery(this).attr('href');
    }

    ////////Initialization
    _THIS.init = function () {
        html = _THIS.createBaseHtml();
        jQuery().qxBlackout({ content: html, animationspeed: options.animationspeed }, function () {
            thisPopUp = jQuery('#qxPopUp');

            //No AJAX
            if(!options.ajax) {
                _THIS.execute();
            } 

            //Have AJAX
            else {
                _THIS.ajaxLoad();
            }
            
        });
    };

    ////////Execute PopUp
    _THIS.execute = function(){
        //Fade Content
        thisPopUp.parent().show();

        //Other
        jQuery('.qx-popUp-content > div', thisPopUp).css('float','left');

        //Set position
        _THIS.centerBlock();

        //Check Min Width
        _THIS.checkMinWidthAndHeight();

        //Fade Content
        thisPopUp.parent().hide().delay(options.animationdelay).fadeIn(options.animationspeed);

        //Events
        _THIS.bindEvents();

        //On complete
        if (typeof eval(callback) == 'function') {
            jQuery.fn.callback = callback;
            thisPopUp.callback(event);
        }

        init = true;
    };    

    ////////Centered popUp
    _THIS.centerBlock = function(){
        if (options.centered) {
            return thisPopUp.css({ left: '50%', top: '50%', marginLeft: thisPopUp.outerWidth() / -2, marginTop: thisPopUp.outerHeight() / -2 });
        }
    };

    ////////Calculate max and min Width and Height
    _THIS.checkMinWidthAndHeight = function(){
        var selector = jQuery('.qx-popUp-content', thisPopUp);
        selector.css({'height':'auto', 'overflow-x': 'hidden', 'overflow-y': 'hidden'});

        var bodyWidth = jQuery(window).width();
        var bodyHeight = jQuery(window).height();
        var popUpWidth = jQuery(thisPopUp).width();
        var popUpHeight = jQuery(thisPopUp).height();
        var hasModification = false;

        //IE7 BUG
        if(jQuery.browser.msie && jQuery.browser.version == "7.0") {
            selector.css({'overflow-x': 'hidden','float':'left','width':'auto'});
            if($('> div', selector).outerWidth() >= bodyWidth - options.bodypadding) {
                selector.css({'overflow-x': 'auto'});
                thisPopUp.width(bodyWidth - options.bodypadding);
            } else {
                thisPopUp.width($('> div', selector).outerWidth());    
            }
            selector.css({'float':'none'});
            hasModification = true;
        } else {
            //PopUp width
            if(popUpWidth >= bodyWidth - options.bodypadding) {
                selector.css({'overflow-x': 'auto'});
                jQuery(thisPopUp).width(bodyWidth - options.bodypadding);
                hasModification = true;
            }
        }

        //PopUp height
        if(popUpHeight >= bodyHeight - options.bodypadding) {
            selector.css({'overflow-y': 'auto'});
            jQuery(thisPopUp).height(bodyHeight - options.bodypadding);
            if(options.calconchange) {
                selector.height( bodyHeight - options.bodypadding - jQuery('.qx-popUp-header', thisPopUp).outerHeight() - jQuery('.qx-popUp-footer', thisPopUp).outerHeight() - 24 );
            }
            hasModification = true;
        }

        if(hasModification) {
            _THIS.centerBlock();
        }
    };

    ////////Create HTML
    _THIS.createBaseHtml = function(){
        //First HTML Part
        html = '<div id="qxPopUp" class="qx-popUp ' + options.popupclass + ' ' + options.type + '" style="position:absolute;"> \n';

        //Header HTML Part
        html += '<div class="qx-popUp-header"> \n';
        html += '<div class="qx-popUp-options"> \n';
        if (options.popclose)
            html += '<a class="qx-popUp-icon qx-popUp-btn-close" title="' + options.popclosetext + '" href="javascript:void(0)">' + options.popclosetext + '</a> \n';
        html += '</div> \n';
        if (options.title)
            html += '<h2>' + options.title + '</h2> \n'; //Title
        html += '</div> \n';

        //Middle HTML Part
        html += '<div class="qx-popUp-content"> \n';

        //HTML content
        if (options.content)
            html += '<div class="qx-popUp-middleContent">' + options.content + '</div> \n'; //Content
        else if (options.text)
            html += '<div class="qx-popUp-middleContent"><p class="qx-popUp-text">' + options.text + '</p></div> \n'; //Content

        //Ajax content
        if (options.ajax) {
            html += '<div class="qx-popUp-ajaxContent"> \n';
            html += '</div> \n';
        }
        html += '<span style="display:block; clear:both; width:100%; height:1px;"></span> \n';
        html += '</div> \n';

        //Footer 
        html += '<div class="qx-popUp-footer">\n';

        //Action Buttons
        html += '<div class="qx-popUp-fieldset"> \n';
        
        //Is it array?
        if (typeof(options.buttons)=='object' && (options.buttons instanceof Array)) {
            for (var i = 0; i < options.buttons.length; i++) {
                if(typeof options.buttons[i].newclass != 'undefined')
                    options.buttons[i].newclass = '';
                html += '<a class="' + options.buttons[i].newclass + ' qx-popUp-btn" href="javascript:void(0)" title="">' + options.buttons[i].name + '</a>';
            }
        } else if(options.buttons == null) {
            if (options.type == 'confirm') {
                html += '<a class="qx-popUp-btn qx-popUp-btn-cancel" href="javascript:void(0)" title="">' + options.cancellabel + '</a>';
                html += '<a class="qx-popUp-btn qx-popUp-btn-ok" href="javascript:void(0)" title="">' + options.oklabel + '</a>';
            }
            else if (options.type == 'default') {
                html += '<a class="qx-popUp-btn qx-popUp-btn-ok" href="javascript:void(0)" title="">' + options.oklabel + '</a>';
            } else {
                if (options.cancellabel)
                    html += '<a class="qx-popUp-btn qx-popUp-btn-cancel" href="javascript:void(0)" title="">' + options.cancellabel + '</a>';
                if (options.oklabel)
                    html += '<a class="qx-popUp-btn qx-popUp-btn-ok" href="javascript:void(0)" title="">' + options.oklabel + '</a>';
            }
        }
        html += '</div> \n';
        html += '</div> \n';

        ////////Footer HTML Part
        html += '</div> \n';

        return html;
    };

    ////////Bind Events
    _THIS.bindEvents = function(){
        //Buttons Actions
        jQuery('.qx-popUp-btn-ok', thisPopUp).bind('click', function () { //OK
            if (options.okaction == 'close' || options.okaction == null) {
                jQuery().qxBlackout({ action: 'close' });
            } else if (typeof eval(options.okaction) == 'function') {
                jQuery.fn.okaction = options.okaction;
                if (_THIS.okaction())
                    jQuery().qxPopUp('close');
            }
            return false;
        });

        jQuery('.qx-popUp-btn-close', thisPopUp).bind('click', function () { //Close
            if (options.closeaction == 'close' || options.closeaction == null) {
                jQuery().qxPopUp('close');
            } else if (typeof eval(options.closeaction) == 'function') {
                jQuery.fn.closeaction = options.closeaction;
                if (_THIS.closeaction())
                    jQuery().qxPopUp('close');
            }

            return false;
        });

        jQuery('.qx-popUp-btn-cancel', thisPopUp).bind('click', function () { //Cancel
            if (options.cancelaction == 'close' || options.cancelaction == null) {
                jQuery().qxPopUp('close');
            } else if (typeof eval(options.cancelaction) == 'function') {
                jQuery.fn.cancelaction = options.cancelaction;
                if (_THIS.cancelaction())
                    jQuery().qxPopUp('close');
            }

            return false;
        });

        //Customized actions
        if (typeof(options.buttons)=='object' && (options.buttons instanceof Array)) {
            for (var i = 0; i < options.buttons.length; i++) {
                if (typeof options.buttons[i].action == 'function') {
                    jQuery('.qx-popUp-btn', thisPopUp).eq(i).data('eq', i).bind('click', function (e) {
                        jQuery(this).is('.disabled') ? e.preventDefault() : options.buttons[jQuery(this).data('eq')].action();
                    });
                } else {
                    jQuery('.qx-popUp-btn', thisPopUp).eq(i).data('eq', i).bind('click', function (e) {
                        jQuery(this).is('.disabled') ? e.preventDefault() : jQuery().qxPopUp('close');
                    });
                }
            }
        }

        //Keyboard event
        thisPopUp.keypress(function (event) {
            if (event.keyCode == 13) {
                jQuery('.qx-popUp-btn-ok', thisPopUp).trigger('click');
            }
        });

        if(options.calconchange) {
            //On window resize
            jQuery(window).resize(function(){
                jQuery(thisPopUp).css({'height': 'auto', 'width': 'auto'});
                _THIS.checkMinWidthAndHeight();
            });

            var selector = jQuery('.qx-popUp-content > div', thisPopUp);
            selector.data('width', selector.width());
            selector.data('height', selector.height());

            //On popUp resize
            setInterval(function(){
                if( selector.data('width') != selector.width() || selector.data('height') != selector.height() ) {
                    jQuery(thisPopUp).css({'height': 'auto', 'width': 'auto'});
                    _THIS.checkMinWidthAndHeight();
                    _THIS.centerBlock();
                    selector.data('width', selector.width());
                    selector.data('height', selector.height());
                }
            },  100);

            jQuery('.qx-popUp-content > div', thisPopUp).resize(function(){
                //console.log('go');
                //jQuery(thisPopUp).css({'height': 'auto', 'width': 'auto'});
                //_THIS.checkMinWidthAndHeight();
            });
        }
    };

    ///////Ajax Load
    _THIS.ajaxLoad = function(){
        thisPopUp.find('.qx-popUp-fieldset').hide();
        
        jQuery.ajax({
            type: options.ajaxmethod,
            data: options.ajaxdata,
            url: options.ajax,
            beforeSend: function (XMLHttpRequest, settings) {
                //Add loading
                thisPopUp.find('.qx-popUp-content').addClass('qx-popUp-loading');

            },
            data: options.data,
            error: function(jqXHR, textStatus, errorThrown){
                if(options.ajaxerrorcontent) {
               
                    //Populate
                    thisPopUp.find('.qx-popUp-ajaxContent').html(options.ajaxerrorcontent);

                    //Execute
                    _THIS.execute();
                }

                //Error action
                if (typeof eval(options.ajaxerroraction) == 'function') {
                    jQuery.fn.callback = options.ajaxerroraction;
                    thisPopUp.callback(jqXHR, textStatus, errorThrown);
                }
            },
            success: function (data, textStatus, XMLHttpRequest) {
                //Populate
                thisPopUp.find('.qx-popUp-ajaxContent').html(data);

                //Execute
                _THIS.execute();
                
            }
        });
    };

    _THIS.init();


    return this;
};