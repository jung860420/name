
export default class Requester {

    constructor() {

        const SCOPE = this;

        SCOPE.DOMAIN = 'http://192.168.0.7:8090/';

		SCOPE.CartBody = {
			scope: '#CartBody', 
			date: null,
			data : {
			    request: {
			        type: 'GET',
			        url : SCOPE.DOMAIN+'calender/calender.do'
			    }
			}
		};

		SCOPE.CartContent = {
			scope: '#CartContent', 
			date: null,
			dom: function(opt) {
				return '\n'+
					'\n<div id="CartContent-modal-'+opt+'" class="floatbox">'+
					'\n\t<div>{{CONTENTS}}</div>'+
					'\n\t<div>{{DEL_CHK}}</div>'+
					'\n\t<div>{{END_DE}}</div>'+
					'\n\t<div>{{REG_DE}}</div>'+
					'\n\t<div>{{REG_ID}}</div>'+
					'\n\t<div>{{SCHEDULE_NO}}</div>'+
					'\n\t<div>{{START_DE}}</div>'+
					'\n\t<div>{{SUBJECT}}</div>'+
					'\n\t<button onclick="return CONTENT.onPushRemove();">취소</button>'+
					'\n</div>';
					
			}

		};

		SCOPE.CartMenuContent = {
			scope: '#CartMenuContent', 
			date: null,
			dom: function(opt) {
				return '\n'+
					'\n<div id="CartMenuContent-modal-'+opt+'" class="floatbox">'+
					'\n\t<h1>{{TITLE}}</h1>'+
					'\n\t<button onclick="return CONTENT.onPushRemove();">취소</button>'+
					'\n</div>';
			}

		};
    }

	onAjax(args, callback) {
		return $.ajax({
		   type: args.type,
		   url: args.url,
		   data: args.data || {},
		   success: callback,
		   error: function(res) {
		        console.log(res);
		   }

		});
	}
}
