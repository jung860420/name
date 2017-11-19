
export default class Requester {

    constructor() {

        const SCOPE = this;

		SCOPE.CartBody = {
			scope: '#CartBody', 
			date: null,
			data : {
			    request: {
			         type: 'GET',
			         url : '/cart/data/calendar.json'
			    }
			}
		};

		SCOPE.CartContent = {
			scope: '#CartContent', 
			date: null,
			dom: function(opt) {
				return '\n'+
					'\n<div id="CartContent-modal-'+opt+'" class="floatbox">'+
					'\n\t<div class="TITLE">{{TITLE}}</div>'+
					'\n\t<div class="SUMMARY">{{SUMMARY}}</div>'+
					'\n\t<div class="CONTENT">{{CONTENT}}</div>'+
					'\n</div>';
			}

		};

    }

	onAjax(args, callback) {
		return $.ajax({
		   type: args.type,
		   url: args.url,
		   success: callback,
		   error: function(res) {
		        console.log(res);
		   }

		});
	}
}
