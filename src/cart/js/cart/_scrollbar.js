
export default class Scrollbar {

    constructor() {

        const SCOPE = this;

        SCOPE.option = {
            scope: "#CartModal",
            node: {
                body: "#CartModal .obj",
                item: "#CartModal .item",
                button: "#CartModal .scrollbar button",
            },
            event: {
                def: "touchstart.scrollbar touchmove.scrollbar touchend.scrollbar",
            },
            col: 1,
            row: 0,
            move: 0,
            old: 0,
            prev: 0,
        };
    }

    onScrollY(args, callback) {

        const SCOPE = this;

        let Scrollbar = SCOPE.option;

        let item = function(index) {

            let array = $(Scrollbar.node.item);

            return index ? array.eq(index) : array;
        }

        if(Scrollbar == null){
            
            return false;
        }

        $(Scrollbar.node.body).removeAttr("style");
        $(Scrollbar.node.button).removeAttr("style");
        $(Scrollbar.node.button).parent().removeAttr("style");

        // 터치 제스쳐
        $(document)
            .off(".scrollbar", Scrollbar.node.body)
            .on(Scrollbar.event.def, Scrollbar.node.body, function(event) {

                if(event.type == "touchstart" ){
                    Scrollbar.start = Math.floor(event.pageY);

                }

                if(event.type == "touchmove" ){
                    Scrollbar.move = Math.floor(event.pageY) - Scrollbar.start;

                    Scrollbar.movement();

                }

                if(event.type == "touchend" ){
                    Scrollbar.prev = 0;

                }
            }
        );

        Scrollbar.bounce = function(number) {
            Scrollbar.row = 0;

            return function(){
                for(let i=0; i<item().length; i++) {

                    if(i % Scrollbar.col == 0) {
                        Scrollbar.row++;

                    }
                }

                return [
                    item(0).outerHeight(true) * Scrollbar.row,
                    ( item(0).outerHeight(true) * Scrollbar.row ) - $(Scrollbar.scope).height()
                ];

            }()[number];
        };

        Scrollbar.percentage = function() {

            let buttonHeight = $(Scrollbar.node.button).outerHeight();
            let parentHeight = $(Scrollbar.node.button).parent().outerHeight();

            let percentage = ( Scrollbar.old / Scrollbar.bounce(1) * 100 ) + ( buttonHeight / parentHeight * 100 );

            return percentage > 0 ? 0 : percentage;
        };

        Scrollbar.movement = function(){

            Scrollbar.result = Scrollbar.move - Scrollbar.prev;

            $(Scrollbar.node.body).css({ "top": "+="+Scrollbar.result });

            $(Scrollbar.node.button).css({ "top": Scrollbar.percentage()*-1 + "%"});

            Scrollbar.old = $(Scrollbar.node.body).position().top;

            if(Scrollbar.old < Scrollbar.bounce(1)*-1) {
                Scrollbar.old = Scrollbar.bounce(1)*-1;

                $(Scrollbar.node.body).stop(true,false).animate({ "top": Scrollbar.old }, 300, "easeOutExpo");

            }

            if(Scrollbar.old > 0) {
                Scrollbar.old = 0;

                $(Scrollbar.node.body).stop(true,false).animate({ "top": 0 }, 300, "easeOutExpo");

            }

            Scrollbar.prev = Scrollbar.move;
        };

        $(window).resize(function(){

            clearTimeout(Scrollbar.timeout);

            Scrollbar.timeout = setTimeout(function(){
                Scrollbar.row = 0;
                Scrollbar.move = 0;

                $(Scrollbar.node.body).removeAttr("style");

                $(Scrollbar.node.button).removeAttr("style");

                return callback ? callback() : null;

            },100);

        });

        return callback ? callback() : null;
    }
}