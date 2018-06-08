define(function(require) {
    var _jQuery = require(['jquery']),
        _modernizr = require(['modernizr']);

    var _header = require('js/app/components/header/header.js');
    var _headerFooter = require('js/app/components/headerFooter/headerFooter.js');

    var config = {
        keyWordTxtBox: ".js-search-keywords",
        searchButton: "#contentSearch",
        categoryddn: "#categorySelectName",
        contentddn: "#contentTypeSelectName",
        displaySpinner: ".overlay-wrapper"
    }

    var carouselCountIndex = 186;
    
    $(document).on("change", "#quick-order-location", function () {
        var shipToAddress = $("#quick-order-location").val();
        shipToChangeAjax(shipToAddress);
    });

    var shipToChangeAjax = function (shipToAddress) {
        $(config.displaySpinner).show();
        $.ajax({
            type: "POST",
            data: JSON.stringify({shipToAddress: shipToAddress}),
            contentType: "application/json",
            dataType:"json",
            url: orderLubricantFormURL,
            success:ajaxEnded,
            error:function () {
                $(config.displaySpinner).hide();
            }
        })
        
        function ajaxEnded(data){
            $("#deliveryInstructions").val(data.deliveryInstructions);
            $("#poAddress").val(data.poAddress);
            $(config.displaySpinner).hide();
        }
    }

    $(config.displaySpinner).show();
    
    $(document).ready(function() {
        
        $(config.displaySpinner).hide();
        leftPaneExpandCollapse.init();
          
        // get the number of .child elements
        var totalitems = $("#parent .child").length;
        // get the height of .child
        var scrollval = $('.child').height();
        // work out the total height.
        var totalheight = (totalitems*scrollval)-($("#parent").height());
        
        $(document).on("click", "#down",function(){
            var currentscrollval = $('#parent').scrollTop();
            
            $('#parent').scrollTop(scrollval+currentscrollval);
    
            // hide/show buttons
            if(currentscrollval == totalheight) {
                $(this).hide();         
            }else {
                    $("#up").show();
            }
        });

        $(document).on("click", "#up",function(){
                var currentscrollval = parseInt($('#parent').scrollTop());
                
            $('#parent').scrollTop(currentscrollval-scrollval);
                
                // hide/show buttons
                if((scrollval+currentscrollval) == scrollval) {
                    $(this).hide();         
                }
                else {
                    $("#down").show();
                }
        });

        // duration of scroll animation
        var scrollDuration = 300;
        // paddles
        var leftPaddle = document.getElementsByClassName('left-paddle');
        var rightPaddle = document.getElementsByClassName('right-paddle');
        // get items dimensions
        var itemsLength = $('.menu-wrapper .menu .item').length;
        var itemSize = $('.menu-wrapper .menu .item').outerWidth(true);
        // get some relevant size for the paddle triggering point
        var paddleMargin = 20;

        // get wrapper width
        var getMenuWrapperSize = function() {
            return $('.menu-wrapper').outerWidth();
        }
        var menuWrapperSize = getMenuWrapperSize();

        // the wrapper is responsive
        $(window).on('resize', function() {
            menuWrapperSize = getMenuWrapperSize();
        });
        // size of the visible part of the menu is equal as the wrapper size 
        var menuVisibleSize = menuWrapperSize;

        // get total width of all menu items
        var getMenuSize = function() {
            return itemsLength * itemSize;
        };
        var menuSize = getMenuSize();

        // get how much of menu is invisible
        var menuInvisibleSize = menuSize - menuWrapperSize;

        // get how much have we scrolled to the left
        var getMenuPosition = function() {
            return $('.menu').scrollLeft();
        };

        // finally, what happens when we are actually scrolling the menu
        $('.menu').on('scroll', function() {

            // get how much of menu is invisible
            menuInvisibleSize = menuSize - menuWrapperSize;
            // get how much have we scrolled so far
            var menuPosition = getMenuPosition();

            var menuEndOffset = menuInvisibleSize - paddleMargin;

            // show & hide the paddles 
            // depending on scroll position
            if (menuPosition <= paddleMargin) {
                $(leftPaddle).addClass('hidden');
                $(rightPaddle).removeClass('hidden');
            } else if (menuPosition < menuEndOffset) {
                // show both paddles in the middle
                $(leftPaddle).removeClass('hidden');
                $(rightPaddle).removeClass('hidden');
            } else if (menuPosition >= menuEndOffset) {
                $(leftPaddle).removeClass('hidden');
                $(rightPaddle).addClass('hidden');
            }
            console.log("menuInvisibleSize >>>",menuInvisibleSize);
        });

        // scroll to left
        $(rightPaddle).on('click', function() {
            (function(){
                $('.menu').animate( { scrollLeft: carouselCountIndex}, scrollDuration);
            })(carouselCountIndex);
            carouselCountIndex+=186;
        });

        // scroll to right
        $(leftPaddle).on('click', function() {
            carouselCountIndex = getMenuPosition() - 186;
            (function(){
                $('.menu').animate( { scrollLeft: carouselCountIndex}, scrollDuration);
            })(carouselCountIndex);
        });
        
        
        $(document).on("click",config.searchButton, function(){
            var payLoadObj = {};
            
            payLoadObj.freeText = $(config.keyWordTxtBox).val();
                      
            payLoadObj.category = $(config.categoryddn).val() ? $(config.categoryddn).val() + "" : "All";
            payLoadObj.contentType = $(config.contentddn).val() ? $(config.contentddn).val() + "" : "All";
            
            localStorage.setItem("searchObj", JSON.stringify(payLoadObj));
            window.location.href = cbp.homePage.globalUrl.contentSearchUrl.replace("{0}",payLoadObj.freeText);
        });

        $('.menu-wrapper ul.menu li.item a.shapeTextLinksContainerLink span.linlTextFreqVisited').each(function(){
            if($(this).height()>30){;
                $(this).css("margin-top","-5px");
            }
        });

        if($('.notification-container #parent .child').length<=2){
            $('.notification-container #up').hide();
            $('.notification-container #down').hide();
            if($('.notification-container #parent .child').length<=0){
                $('.notification-container .heading-block').addClass('md-pb-10').css('border-bottom','1px solid #FFFFFF');
            }
        }

        if($('.menu-wrapper ul.menu li.item').length<=6){
            $('.paddles').css('visibility','hidden');
        }

        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
            var xhOffest = $('.notification-container .notification-inner-block').offset().top;
            var xh = $('.notification-container .notification-inner-block').height();
            var xhLength = $.trim($('.notification-height-reserve #parent .child').text()).length;
            var mlLength = $('.menu-wrapper ul.menu li').length;
            var htForMEnuWarpper = '';            
            if(xhLength<=0){
                $('.notification-container #parent').css('height','auto');                      
                $('.banner-container .menu-wrapper').css('top','6em');
                $('.carousel .carousel-inner .item').css({'height':'60em','min-height':'60em'});
            }else{
                if(mlLength<=6){
                    $('.carousel .carousel-inner .item').css('height','61em');
                    htForMEnuWarpper = Math.floor(xhOffest/16)+Math.floor(xh/16)+5;
                }else{
                    $('.carousel .carousel-inner .item').css('height','73em');
                    htForMEnuWarpper = Math.floor(xhOffest/16)+Math.floor(xh/16)+5;
                }

                if($('.notification-height-reserve #parent .child').length<=1){
                    $('.carousel .carousel-inner .item').css('height','63em');
                    htForMEnuWarpper = Math.floor(xhOffest/16)+Math.floor(xh/16);
                    $('.notification-container #parent').css('height','95px');
                }else{
                    $('.notification-container #parent').css('height','135px');
                }
                $('.banner-container .menu-wrapper').css('top',htForMEnuWarpper+'em');
            }
        }
    });

});

/*

require(["modernizr",
    "jquery",
    "bootstrap",
    "handlebars",
    "moment",
    "text!app/components/dropdown/_defaultDdn.hbs"

], function(modernizr, $, bootstrap, Handlebars, moment, _defaultDdnHBS) {
    
    
       
});
*/