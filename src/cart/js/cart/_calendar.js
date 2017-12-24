
import Requester from './_requester';

export default class Calendar extends Requester {

     setCalender(args, day) {

          const SCOPE = this;
          
          let id = SCOPE.CartBody.scope;
          let date = day;

          let CALENDAR_TARGET = $(id);

          if( date != null ) {
               date = date.split('-');
               date[1] = date[1] - 1;
               date = new Date(date[0], date[1], date[2]);
          } else {
               date = new Date();
          }

          let currentYear = date.getFullYear();
          //년도를 구함

          let currentMonth = date.getMonth() + 1;
          //연을 구함. 월은 0부터 시작하므로 +1, 12월은 11을 출력

          let currentDate = date.getDate();
          //오늘 일자.

          date.setDate(1);
          let currentDay = date.getDay();
          //이번달 1일의 요일은 출력. 0은 일요일 6은 토요일

          let dateString = new Array('sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat');
          let lastDate = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
          if( (currentYear % 4 === 0 && currentYear % 100 !== 0) || currentYear % 400 === 0 )
               lastDate[1] = 29;
          //각 달의 마지막 일을 계산, 윤년의 경우 년도가 4의 배수이고 100의 배수가 아닐 때 혹은 400의 배수일 때 2월달이 29일 임.

          let currentLastDate = lastDate[currentMonth-1];
          let week = Math.ceil( ( currentDay + currentLastDate ) / 7 );

          //총 몇 주인지 구함.

          let prevDate = 0 , nextDate = 0;

          if(currentMonth != 1) {
               prevDate = currentYear + '-' + ( currentMonth - 1 ) + '-' + currentDate;
          }
          else {
               prevDate = ( currentYear - 1 ) + '-' + 12 + '-' + currentDate;
          }
          //만약 이번달이 1월이라면 1년 전 12월로 출력.

          if(currentMonth != 12) {
               nextDate = currentYear + '-' + ( currentMonth + 1 ) + '-' + currentDate;
          }
          else {
               nextDate = ( currentYear + 1 ) + '-' + 1 + '-' + currentDate;
          }
          //만약 이번달이 12월이라면 1년 후 1월로 출력.


          if( currentMonth < 10 ) {
               currentMonth  = '0' + currentMonth;
          }
          //10월 이하라면 앞에 0을 붙여준다.

          console.log(SCOPE.CartBody.data.request);

          SCOPE.CartBody.data.request.data = args;
          SCOPE.onAjax(SCOPE.CartBody.data.request, function(res){

               let calendar = '';

               calendar += '<table>';
               calendar += '<caption>' + currentYear + '년 ' + currentMonth + '월 달력</caption>';
               calendar += '<thead>';
               calendar += '<tr>';
               calendar += '<th class="sun" scope="col">일</th>';
               calendar += '<th class="mon" scope="col">월</th>';
               calendar += '<th class="tue" scope="col">화</th>';
               calendar += '<th class="wed" scope="col">수</th>';
               calendar += '<th class="thu" scope="col">목</th>';
               calendar += '<th class="fri" scope="col">금</th>';
               calendar += '<th class="sat" scope="col">토</th>';
               calendar += '</tr>';
               calendar += '</thead>';
               calendar += '<tbody>';

               let dateNum = 1 - currentDay;

               for(let i = 0; i < week; i++) {
                    calendar += '<tr>';
                    for(let j = 0; j < 7; j++, dateNum++) {

                         if( dateNum < 1) {
                              calendar += '<td class="' + dateString[j] + '"></td>';
                              continue;
                         }

                         if( dateNum > currentLastDate ) {
                              calendar += '<td class="' + dateString[j] + '"></td>';
                              continue;
                         }

                         calendar += '<td class=" ' + dateString[j] + '">' + function() { 

                              let data = res[dateNum-1];

                              return data.TOTAL ? 
                                   '<button data-day="'+dateNum+'" type="button" '+
                                        'onclick="return CALENDAR.getLink({ day: '+dateNum+', url: \'http://192.168.0.4:8090'+data.LINK+'\' })">'+
                                        dateNum + '<span>(' + data.TOTAL + ')</span>'+
                                   '</button>' : dateNum;

                         }()+'</td>';

                    }
                    calendar += '</tr>';
               }

               calendar += '</tbody>';
               calendar += '</table>';

               CALENDAR_TARGET.html(calendar);

          });

          return 1;
     };

     getLink(args) {

          const SCOPE = this;

          let data = {
               type: 'GET',
               url: args.url,
               data: {
                    day: args.day
               }
          };

          let modalcode = 'carendar-'+args.day;

          CONTENT.setContent({ request: data, code: modalcode });

          return 1;
     };
}
